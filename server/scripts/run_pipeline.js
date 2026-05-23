#!/usr/bin/env node
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { ImapFlow } = require('imapflow');
const { simpleParser } = require('mailparser');
const {
  ENV_FILE,
  LOGS_DIR,
  PARSER_BINARIES,
} = require('../config/paths');
const { SUPPORTED_MESSAGE_TYPES, SUPPORTED_CIMP_MESSAGE_TYPES, isSupportedMessageType } = require('../config/messageTypes');
const { withDbClient, pool } = require('../config/db');
const { getPipelineConfig, getExtractEmailLimit } = require('../config/pipeline');
const { getImapConfig } = require('../config/imap');

require('dotenv').config({ path: ENV_FILE });

const PIPELINE_RUNS_DIR = path.join(LOGS_DIR, 'pipeline-runs');
const PIPELINE_LOCK_FILE = path.join(LOGS_DIR, 'pipeline.lock.json');

const pipelineConfig = getPipelineConfig();

const POLL_INTERVAL_MS = pipelineConfig.pollIntervalMs;
const STEP_MAX_RETRIES = pipelineConfig.stepMaxRetries;
const PARSE_BATCH_LIMIT = pipelineConfig.parseBatchLimit;

const RUN_ONCE = process.argv.includes('--once');
const FORCE = process.argv.includes('--force');

fs.mkdirSync(LOGS_DIR, { recursive: true });
fs.mkdirSync(PIPELINE_RUNS_DIR, { recursive: true });

function log(level, text) {
  const ts = new Date().toISOString();
  const line = `${ts} [${level.toUpperCase()}] ${text}`;
  process.stderr.write(line + '\n');
}

function safeIsoNow() {
  return new Date().toISOString();
}

function normalizeBody(parsedEmail) {
  const textBody = (parsedEmail.text || '').replace(/\r\n/g, '\n').trim();
  if (textBody) return textBody;
  return (parsedEmail.html || '').toString().replace(/\r\n/g, '\n').trim();
}

function firstBodyLine(body) {
  return String(body || '').replace(/\r\n/g, '\n').split('\n')[0].trim().toUpperCase();
}

function detectMessageFormat(body) {
  const header = firstBodyLine(body);
  const cimpMatch = header.match(/^([A-Z]+)\/\d+/);
  if (cimpMatch) {
    const format = cimpMatch[1].toLowerCase();
    if (SUPPORTED_CIMP_MESSAGE_TYPES.includes(format)) return format;
  }
  if (header === 'MVT') return SUPPORTED_MESSAGE_TYPES.MVT;
  return null;
}

function messageTypeToDbEnum(messageType) {
  if (messageType === SUPPORTED_MESSAGE_TYPES.FFM) return 'FFM';
  if (messageType === SUPPORTED_MESSAGE_TYPES.FWB) return 'FWB';
  if (messageType === SUPPORTED_MESSAGE_TYPES.FHL) return 'FHL';
  if (messageType === SUPPORTED_MESSAGE_TYPES.MVT) return 'MVT';
  return null;
}

function runParser(parserBinary, body) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ncaparser-db-'));
  const inputFile = path.join(tmpDir, 'email_body.txt');
  let resultObj = {};

  try {
    fs.writeFileSync(inputFile, body.endsWith('\n') ? body : body + '\n', 'utf8');

    const result = spawnSync(parserBinary, ['-file', inputFile], {
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024,
    });

    const stdoutText = (result.stdout || '').trim();
    const stderrText = (result.stderr || '').trim();

    if (result.status !== 0) {
      resultObj = {
        status: 'error',
        stderr: `Parser exited with status ${result.status}` + (stderrText ? `\n${stderrText}` : ''),
        stdout: stdoutText,
      };
    } else {
      try {
        resultObj = {
          status: 'ok',
          fields: JSON.parse(stdoutText),
          stderr: stderrText,
          stdout: stdoutText,
        };
      } catch (error) {
        resultObj = {
          status: 'error',
          stderr: `Parser output was not valid JSON: ${error.message}` + (stderrText ? `\n${stderrText}` : ''),
          stdout: stdoutText,
        };
      }
    }
  } catch (error) {
    resultObj = {
      status: 'error',
      stderr: error.message,
      stdout: '',
    };
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }

  return resultObj;
}

function splitBySlash(line) {
  if (!line || typeof line !== 'string') return [];
  return line.split('/');
}

function normalizeFfmFields(fields) {
  if (!fields || typeof fields !== 'object') return {};

  if (!fields.FlightIdentification || typeof fields.FlightIdentification !== 'object') {
    const parts = splitBySlash(fields.FlightIdentificationLine || '');
    fields.FlightIdentification = {
      MessagePageNumber: parts[0] || '',
      CarrierFlightNumber: parts[1] || '',
      DayMonthTime: parts[2] || '',
      BoardPoint: parts[3] || '',
      AircraftRegistration: parts[4] || '',
    };
  } else if (!fields.FlightIdentification.MessagePageNumber && fields.FlightIdentification.MessageFunctionCode) {
    fields.FlightIdentification.MessagePageNumber = fields.FlightIdentification.MessageFunctionCode;
    delete fields.FlightIdentification.MessageFunctionCode;
  }

  if (!Array.isArray(fields.Routes)) {
    const lines = String(fields.RouteLine || '').split('\n').filter(Boolean);
    fields.Routes = lines.map((line) => {
      const directMatch = line.match(/^([A-Z]{3})\/\/([^\/]*)$/);
      if (directMatch) {
        return {
          AirportCode: directMatch[1],
          RouteKind: 'Direct',
          ScheduledArrivalTime: directMatch[2],
          ScheduledArrivalDateTime: directMatch[2],
          ScheduledDepartureTime: '',
        };
      }
      const nilMatch = line.match(/^([A-Z]{3})\/NIL(?:\/([^\/]*))?(?:\/([^\/]*))?$/);
      if (nilMatch) {
        return {
          AirportCode: nilMatch[1],
          RouteKind: 'TransitNIL',
          ScheduledArrivalTime: nilMatch[2] || '',
          ScheduledArrivalDateTime: nilMatch[2] || '',
          ScheduledDepartureTime: nilMatch[3] || '',
          ScheduledOnwardDepartureDateTime: nilMatch[3] || '',
        };
      }
      return {
        AirportCode: line,
        RouteKind: 'DestinationOnly',
        ScheduledArrivalTime: '',
        ScheduledArrivalDateTime: '',
        ScheduledDepartureTime: '',
        ScheduledOnwardDepartureDateTime: '',
      };
    });
  }

  return fields;
}

function normalizeFwbFields(fields) {
  if (!fields || typeof fields !== 'object') return {};

  if (!Array.isArray(fields.FlightBookings) && typeof fields.FlightBookingsLine === 'string') {
    const tokens = splitBySlash(fields.FlightBookingsLine);
    const bookings = [];
    if (tokens[0] === 'FLT') {
      for (let i = 1; i + 1 < tokens.length; i += 2) {
        bookings.push({ CarrierFlightNumber: tokens[i], Day: tokens[i + 1] });
      }
    }
    fields.FlightBookings = bookings;
  }

  if (!Array.isArray(fields.Routing) && typeof fields.RoutingLine === 'string') {
    const tokens = splitBySlash(fields.RoutingLine);
    const routing = [];
    if (tokens[0] === 'RTG') {
      for (let i = 1; i < tokens.length; i++) {
        const point = tokens[i] || '';
        routing.push({ AirportCode: point.slice(0, 3), CarrierCode: point.slice(3) });
      }
    }
    fields.Routing = routing;
  }

  if ((!fields.ChargesDeclaration || typeof fields.ChargesDeclaration !== 'object') && typeof fields.CvdLine === 'string') {
    const tokens = splitBySlash(fields.CvdLine);
    if (tokens[0] === 'CVD' && tokens.length >= 7) {
      fields.ChargesDeclaration = {
        CurrencyCode: tokens[1],
        WeightValuation: tokens[2],
        OtherCharges: tokens[3],
        DeclaredValueForCarriage: tokens[4],
        DeclaredValueForCustoms: tokens[5],
        InsuranceValue: tokens[6],
      };
    }
  }

  return fields;
}

function normalizeFhlFields(fields) {
  if (!fields || typeof fields !== 'object') return {};

  if ((!fields.ChargesDeclaration || typeof fields.ChargesDeclaration !== 'object') && typeof fields.CvdLine === 'string') {
    const tokens = splitBySlash(fields.CvdLine);
    if (tokens[0] === 'CVD' && tokens.length >= 6) {
      fields.ChargesDeclaration = {
        CurrencyCode: tokens[1],
        WeightValuation: tokens[2],
        DeclaredValueForCarriage: tokens[3],
        DeclaredValueForCustoms: tokens[4],
        InsuranceValue: tokens[5],
      };
    }
  }

  return fields;
}

function normalizeParsedFields(messageType, fields) {
  if (messageType === SUPPORTED_MESSAGE_TYPES.FFM) return normalizeFfmFields(fields);
  if (messageType === SUPPORTED_MESSAGE_TYPES.FWB) return normalizeFwbFields(fields);
  if (messageType === SUPPORTED_MESSAGE_TYPES.FHL) return normalizeFhlFields(fields);
  return fields || {};
}

async function upsertRawEmail(client, email) {
  const query = `
    INSERT INTO emails_raw (
      mailbox, uid, message_type, subject, sender, received_at, body, raw_json
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    ON CONFLICT (mailbox, uid) DO UPDATE SET
      message_type = EXCLUDED.message_type,
      subject = EXCLUDED.subject,
      sender = EXCLUDED.sender,
      received_at = EXCLUDED.received_at,
      body = EXCLUDED.body,
      raw_json = EXCLUDED.raw_json
    RETURNING id
  `;

  const values = [
    email.mailbox,
    email.uid,
    messageTypeToDbEnum(email.messageType),
    email.subject,
    email.sender,
    email.receivedAt,
    email.body,
    email.rawJson,
  ];

  const result = await client.query(query, values);
  return result.rows[0].id;
}

async function insertParsedResult(client, payload) {
  const query = `
    INSERT INTO messages_parsed (
      email_id, parser_name, parser_version, message_type, status, stderr, stdout, result_json, payload_json
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING id
  `;

  const values = [
    payload.emailId,
    payload.parserName,
    payload.parserVersion,
    payload.messageType,
    payload.status,
    payload.stderr,
    payload.stdout,
    payload.resultJson,
    payload.payloadJson,
  ];

  const result = await client.query(query, values);
  return result.rows[0].id;
}

function parseOriginDestination(value) {
  const text = String(value || '');
  if (text.length >= 6) {
    return {
      origin: text.slice(0, 3),
      destination: text.slice(3, 6),
    };
  }
  return { origin: null, destination: null };
}

async function persistFfmNormalized(client, parsedMessageId, fields) {
  const fi = fields.FlightIdentification || {};

  const flightInsert = await client.query(
    `
      INSERT INTO ffm_flight (
        parsed_message_id, message_page_number, carrier_flight_number,
        scheduled_departure_datetime, scheduled_departure_date, scheduled_departure_time,
        departure_airport_code, aircraft_registration, raw_fields
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      ON CONFLICT (parsed_message_id) DO UPDATE SET
        message_page_number = EXCLUDED.message_page_number,
        carrier_flight_number = EXCLUDED.carrier_flight_number,
        scheduled_departure_datetime = EXCLUDED.scheduled_departure_datetime,
        scheduled_departure_date = EXCLUDED.scheduled_departure_date,
        scheduled_departure_time = EXCLUDED.scheduled_departure_time,
        departure_airport_code = EXCLUDED.departure_airport_code,
        aircraft_registration = EXCLUDED.aircraft_registration,
        raw_fields = EXCLUDED.raw_fields
      RETURNING id
    `,
    [
      parsedMessageId,
      fi.MessagePageNumber || null,
      fi.CarrierFlightNumber || null,
      fi.ScheduledDepartureDateTime || fi.DayMonthTime || null,
      fi.ScheduledDepartureDate || null,
      fi.ScheduledDepartureTime || null,
      fi.DepartureAirportCode || fi.BoardPoint || null,
      fi.AircraftRegistration || null,
      fi,
    ]
  );

  const ffmFlightId = flightInsert.rows[0].id;

  await client.query('DELETE FROM ffm_route WHERE ffm_flight_id = $1', [ffmFlightId]);
  await client.query('DELETE FROM ffm_awb WHERE ffm_uld_id IN (SELECT id FROM ffm_uld WHERE ffm_flight_id = $1)', [ffmFlightId]);
  await client.query('DELETE FROM ffm_uld WHERE ffm_flight_id = $1', [ffmFlightId]);

  const routes = Array.isArray(fields.Routes) ? fields.Routes : [];
  for (let i = 0; i < routes.length; i++) {
    const route = routes[i] || {};
    await client.query(
      `
        INSERT INTO ffm_route (
          ffm_flight_id, route_seq, arrival_airport_code, route_kind,
          scheduled_arrival_datetime, scheduled_arrival_date, scheduled_arrival_time,
          scheduled_onward_departure_datetime, scheduled_onward_departure_date,
          scheduled_onward_departure_time, raw_fields
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      `,
      [
        ffmFlightId,
        i + 1,
        route.ArrivalAirportCode || route.AirportCode || null,
        route.RouteKind || null,
        route.ScheduledArrivalDateTime || route.ScheduledArrivalTime || null,
        route.ScheduledArrivalDate || null,
        route.ScheduledArrivalClockTime || route.ScheduledArrivalTime || null,
        route.ScheduledOnwardDepartureDateTime || route.ScheduledDepartureTime || null,
        route.ScheduledOnwardDepartureDate || null,
        route.ScheduledOnwardDepartureTime || null,
        route,
      ]
    );
  }

  const ulds = fields.ULDs && typeof fields.ULDs === 'object' ? fields.ULDs : {};
  let uldSeq = 0;
  for (const [uldCode, uldValue] of Object.entries(ulds)) {
    uldSeq += 1;
    const uld = uldValue || {};

    const uldInsert = await client.query(
      `
        INSERT INTO ffm_uld (
          ffm_flight_id, uld_seq, uld_code, uld_detail_text, raw_fields
        ) VALUES ($1,$2,$3,$4,$5)
        RETURNING id
      `,
      [ffmFlightId, uldSeq, uldCode || null, uld.ULDDetailText || null, uld]
    );

    const ffmUldId = uldInsert.rows[0].id;
    const awbs = Array.isArray(uld.AWBs) ? uld.AWBs : [];

    for (let j = 0; j < awbs.length; j++) {
      const awb = awbs[j] || {};
      await client.query(
        `
          INSERT INTO ffm_awb (
            ffm_uld_id, awb_seq, master_awb_number, origin_and_destination,
            shipment_summary, free_text, osi, oci, sci, qualifiers, continuations, raw_fields
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
        `,
        [
          ffmUldId,
          j + 1,
          awb.MasterAirwayBillNumber || null,
          awb.OriginAndDestination || null,
          awb.ShipmentSummary || null,
          awb.FreeText || null,
          JSON.stringify(Array.isArray(awb.OSI) ? awb.OSI : []),
          JSON.stringify(Array.isArray(awb.OCI) ? awb.OCI : []),
          JSON.stringify(Array.isArray(awb.SCI) ? awb.SCI : []),
          JSON.stringify(Array.isArray(awb.Qualifiers) ? awb.Qualifiers : []),
          JSON.stringify(Array.isArray(awb.Continuations) ? awb.Continuations : []),
          awb,
        ]
      );
    }
  }
}

async function persistFwbNormalized(client, parsedMessageId, fields) {
  const masterAwb = fields.MasterAirwayBillNumber || null;
  const od = parseOriginDestination(fields.OriginAndDestination);

  const insert = await client.query(
    `
      INSERT INTO fwb_master (
        parsed_message_id, mawb_number, origin_airport_code, destination_airport_code,
        piece_count, weight_kg, volume_amount, volume_unit, nature_of_goods,
        shipper_name, consignee_name, charges_declaration, raw_fields
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      ON CONFLICT (parsed_message_id) DO UPDATE SET
        mawb_number = EXCLUDED.mawb_number,
        origin_airport_code = EXCLUDED.origin_airport_code,
        destination_airport_code = EXCLUDED.destination_airport_code,
        piece_count = EXCLUDED.piece_count,
        weight_kg = EXCLUDED.weight_kg,
        volume_amount = EXCLUDED.volume_amount,
        volume_unit = EXCLUDED.volume_unit,
        nature_of_goods = EXCLUDED.nature_of_goods,
        shipper_name = EXCLUDED.shipper_name,
        consignee_name = EXCLUDED.consignee_name,
        charges_declaration = EXCLUDED.charges_declaration,
        raw_fields = EXCLUDED.raw_fields
      RETURNING id
    `,
    [
      parsedMessageId,
      masterAwb,
      od.origin,
      od.destination,
      Number.isFinite(Number(fields.TotalPieceCount)) ? Number(fields.TotalPieceCount) : null,
      Number.isFinite(Number(fields.TotalWeight)) ? Number(fields.TotalWeight) : null,
      Number.isFinite(Number(fields.VolumeAmount)) ? Number(fields.VolumeAmount) : null,
      fields.VolumeUnit || null,
      fields.NatureOfGoods || null,
      (fields.Shipper && fields.Shipper.Name) || null,
      (fields.Consignee && fields.Consignee.Name) || null,
      fields.ChargesDeclaration || null,
      fields,
    ]
  );

  const fwbMasterId = insert.rows[0].id;
  await client.query('DELETE FROM fwb_flight_booking WHERE fwb_master_id = $1', [fwbMasterId]);
  await client.query('DELETE FROM fwb_routing_leg WHERE fwb_master_id = $1', [fwbMasterId]);

  const bookings = Array.isArray(fields.FlightBookings) ? fields.FlightBookings : [];
  for (let i = 0; i < bookings.length; i++) {
    const booking = bookings[i] || {};
    await client.query(
      `
        INSERT INTO fwb_flight_booking (
          fwb_master_id, booking_seq, carrier_flight_number, day_text, raw_fields
        ) VALUES ($1,$2,$3,$4,$5)
      `,
      [fwbMasterId, i + 1, booking.CarrierFlightNumber || null, booking.Day || null, booking]
    );
  }

  const routing = Array.isArray(fields.Routing) ? fields.Routing : [];
  for (let i = 0; i < routing.length; i++) {
    const leg = routing[i] || {};
    await client.query(
      `
        INSERT INTO fwb_routing_leg (
          fwb_master_id, leg_seq, airport_code, carrier_code, raw_fields
        ) VALUES ($1,$2,$3,$4,$5)
      `,
      [fwbMasterId, i + 1, leg.AirportCode || null, leg.CarrierCode || null, leg]
    );
  }
}

async function persistFhlNormalized(client, parsedMessageId, fields) {
  const od = parseOriginDestination(fields.MasterOriginAndDestination);
  const master = await client.query(
    `
      INSERT INTO fhl_master (
        parsed_message_id, mawb_number, origin_airport_code, destination_airport_code,
        charges_declaration, raw_fields
      ) VALUES ($1,$2,$3,$4,$5,$6)
      ON CONFLICT (parsed_message_id) DO UPDATE SET
        mawb_number = EXCLUDED.mawb_number,
        origin_airport_code = EXCLUDED.origin_airport_code,
        destination_airport_code = EXCLUDED.destination_airport_code,
        charges_declaration = EXCLUDED.charges_declaration,
        raw_fields = EXCLUDED.raw_fields
      RETURNING id
    `,
    [
      parsedMessageId,
      fields.MasterAirwayBillNumber || null,
      od.origin,
      od.destination,
      fields.ChargesDeclaration || null,
      fields,
    ]
  );

  const fhlMasterId = master.rows[0].id;
  await client.query('DELETE FROM fhl_house WHERE fhl_master_id = $1', [fhlMasterId]);

  const houses = Array.isArray(fields.HouseBills) ? fields.HouseBills : [];
  for (let i = 0; i < houses.length; i++) {
    const house = houses[i] || {};
    await client.query(
      `
        INSERT INTO fhl_house (
          fhl_master_id, house_seq, hawb_number, piece_count,
          weight_kg, goods_description, shipper_name, consignee_name, raw_fields
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      `,
      [
        fhlMasterId,
        i + 1,
        house.HouseWaybillNumber || null,
        Number.isFinite(Number(house.HousePieceCount)) ? Number(house.HousePieceCount) : null,
        Number.isFinite(Number(house.HouseWeight)) ? Number(house.HouseWeight) : null,
        house.NatureOfGoodsDescription || null,
        (house.Shipper && house.Shipper.Name) || null,
        (house.Consignee && house.Consignee.Name) || null,
        house,
      ]
    );
  }
}

async function persistMvtNormalized(client, parsedMessageId, fields) {
  await client.query(
    `
      INSERT INTO mvt_event (
        parsed_message_id, event_type, carrier_flight_number, board_point, off_point,
        event_datetime_text, event_date_text, event_time_text, registration,
        service_type, diversion_airport_code, delay_airport_code, delay_reason_code,
        delay_duration_minutes, raw_fields
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
      ON CONFLICT (parsed_message_id) DO UPDATE SET
        event_type = EXCLUDED.event_type,
        carrier_flight_number = EXCLUDED.carrier_flight_number,
        board_point = EXCLUDED.board_point,
        off_point = EXCLUDED.off_point,
        event_datetime_text = EXCLUDED.event_datetime_text,
        event_date_text = EXCLUDED.event_date_text,
        event_time_text = EXCLUDED.event_time_text,
        registration = EXCLUDED.registration,
        service_type = EXCLUDED.service_type,
        diversion_airport_code = EXCLUDED.diversion_airport_code,
        delay_airport_code = EXCLUDED.delay_airport_code,
        delay_reason_code = EXCLUDED.delay_reason_code,
        delay_duration_minutes = EXCLUDED.delay_duration_minutes,
        raw_fields = EXCLUDED.raw_fields
    `,
    [
      parsedMessageId,
      fields.EventType || fields.MovementType || null,
      fields.CarrierFlightNumber || fields.FlightNumber || null,
      fields.BoardPoint || null,
      fields.OffPoint || null,
      fields.EventDateTime || null,
      fields.EventDate || null,
      fields.EventTime || null,
      fields.Registration || null,
      fields.ServiceType || null,
      fields.DiversionAirportCode || null,
      fields.DelayAirportCode || null,
      fields.DelayReasonCode || null,
      Number.isFinite(Number(fields.DelayDurationMinutes)) ? Number(fields.DelayDurationMinutes) : null,
      fields,
    ]
  );
}

async function persistNormalized(client, dbMessageType, parsedMessageId, fields) {
  if (dbMessageType === 'FFM') {
    await persistFfmNormalized(client, parsedMessageId, fields);
    return;
  }
  if (dbMessageType === 'FWB') {
    await persistFwbNormalized(client, parsedMessageId, fields);
    return;
  }
  if (dbMessageType === 'FHL') {
    await persistFhlNormalized(client, parsedMessageId, fields);
    return;
  }
  if (dbMessageType === 'MVT') {
    await persistMvtNormalized(client, parsedMessageId, fields);
  }
}

async function extractEmailsToDb() {
  const { host, user, pass, port, mailbox } = getImapConfig();
  const extractLimit = getExtractEmailLimit();

  const client = new ImapFlow({
    host,
    port,
    secure: true,
    auth: { user, pass },
    logger: false,
  });

  let extractedCount = 0;
  let skippedUnrecognizedCount = 0;

  try {
    await client.connect();
    const lock = await client.getMailboxLock(mailbox);

    try {
      const uids = await client.search({ uid: '1:*' }, { uid: true });
      uids.sort((a, b) => b - a);

      for (const uid of uids) {
        if (extractLimit !== -1 && extractedCount >= extractLimit) break;

        const message = await client.fetchOne(
          uid,
          { uid: true, internalDate: true, source: true },
          { uid: true }
        );

        if (!message) continue;

        const parsedEmail = await simpleParser(message.source);
        const body = normalizeBody(parsedEmail);
        const messageType = detectMessageFormat(body);

        if (!messageType || !isSupportedMessageType(messageType)) {
          skippedUnrecognizedCount += 1;
          log('warn', `[extract] skipped uid=${message.uid} due to unrecognized message type`);
          continue;
        }

        const rawJson = {
          uid: message.uid,
          mailbox,
          date: message.internalDate ? message.internalDate.toISOString() : null,
          subject: parsedEmail.subject || '(no subject)',
          from: parsedEmail.from ? parsedEmail.from.text : '(unknown sender)',
          to: parsedEmail.to ? parsedEmail.to.text : null,
          body,
          messageType,
        };

        await withDbClient(async (dbClient) => {
          await upsertRawEmail(dbClient, {
            mailbox,
            uid: message.uid,
            messageType,
            subject: rawJson.subject,
            sender: rawJson.from,
            receivedAt: rawJson.date,
            body,
            rawJson,
          });
        });

        extractedCount += 1;
      }
    } finally {
      lock.release();
    }
  } finally {
    await client.logout().catch(() => {});
  }

  return { extractedCount, skippedUnrecognizedCount };
}

async function fetchEmailsToParse(dbClient, force) {
  if (force) {
    const result = await dbClient.query(
      `
        SELECT id, mailbox, uid, message_type, body
        FROM emails_raw
        ORDER BY uid DESC
        LIMIT $1
      `,
      [PARSE_BATCH_LIMIT]
    );
    return result.rows;
  }

  const result = await dbClient.query(
    `
      SELECT er.id, er.mailbox, er.uid, er.message_type, er.body
      FROM emails_raw er
      LEFT JOIN LATERAL (
        SELECT mp.id
        FROM messages_parsed mp
        WHERE mp.email_id = er.id
        ORDER BY mp.parsed_at DESC, mp.id DESC
        LIMIT 1
      ) latest ON TRUE
      WHERE latest.id IS NULL
      ORDER BY er.uid DESC
      LIMIT $1
    `,
    [PARSE_BATCH_LIMIT]
  );
  return result.rows;
}

async function parseEmailsFromDb(force) {
  let parsedCount = 0;
  let errorCount = 0;

  await withDbClient(async (dbClient) => {
    const rows = await fetchEmailsToParse(dbClient, force);

    for (const row of rows) {
      const inferredType = row.message_type ? String(row.message_type).toLowerCase() : detectMessageFormat(row.body || '');
      const dbMessageType = messageTypeToDbEnum(inferredType);
      const localMessageType = inferredType;

      if (!dbMessageType || !localMessageType || !isSupportedMessageType(localMessageType)) {
        errorCount += 1;
        log('warn', `[parse] skipped unsupported email_id=${row.id} uid=${row.uid} message_type=${row.message_type || 'NULL'}`);
        continue;
      }
      const parserBinary = localMessageType && PARSER_BINARIES[localMessageType] ? PARSER_BINARIES[localMessageType] : null;

      const baseResult = {
        messageType: dbMessageType,
        status: 'error',
        stderr: null,
        stdout: null,
        fields: null,
      };

      let parserResult = null;

      if (!parserBinary || !fs.existsSync(parserBinary)) {
        parserResult = {
          ...baseResult,
          status: 'error',
          stderr: `Parser binary missing for type ${localMessageType}`,
        };
      } else {
        const parsed = runParser(parserBinary, row.body || '');
        const normalizedFields = parsed.status === 'ok'
          ? normalizeParsedFields(localMessageType, parsed.fields)
          : null;

        parserResult = {
          ...baseResult,
          status: parsed.status,
          stderr: parsed.stderr || null,
          stdout: parsed.stdout || null,
          fields: normalizedFields,
        };
      }

      await dbClient.query('BEGIN');
      try {
        const parsedMessageId = await insertParsedResult(dbClient, {
          emailId: row.id,
          parserName: localMessageType ? `parser_${localMessageType}_json` : 'parser_unknown',
          parserVersion: process.env.PARSER_VERSION || 'v1',
          messageType: dbMessageType,
          status: parserResult.status,
          stderr: parserResult.stderr,
          stdout: parserResult.stdout,
          resultJson: parserResult,
          payloadJson: parserResult.fields,
        });

        if (parserResult.status === 'ok' && parserResult.fields) {
          await persistNormalized(dbClient, dbMessageType, parsedMessageId, parserResult.fields);
          parsedCount += 1;
        } else {
          errorCount += 1;
        }

        await dbClient.query('COMMIT');
      } catch (error) {
        await dbClient.query('ROLLBACK');
        errorCount += 1;
        log('error', `[parse] failed email_id=${row.id} uid=${row.uid}: ${error.message}`);
      }
    }
  });

  return { parsedCount, errorCount };
}

async function createRunRow(client, runId, runNumber) {
  try {
    const result = await client.query(
      `
        INSERT INTO pipeline_runs (run_id, run_number, status, started_at, force_run)
        VALUES ($1, $2, 'running', NOW(), $3)
        RETURNING id
      `,
      [runId, runNumber, FORCE]
    );
    return result.rows[0].id;
  } catch (_error) {
    return null;
  }
}

async function insertRunStep(client, pipelineRunId, stepName, status, detail) {
  if (!pipelineRunId) return;
  await client.query(
    `
      INSERT INTO pipeline_run_steps (pipeline_run_id, step_name, status, detail_json, started_at, finished_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
    `,
    [pipelineRunId, stepName, status, detail || {}]
  );
}

async function finalizeRunRow(client, pipelineRunId, status, metrics) {
  if (!pipelineRunId) return;
  await client.query(
    `
      UPDATE pipeline_runs
      SET status = $2,
          metrics_json = $3,
          finished_at = NOW()
      WHERE id = $1
    `,
    [pipelineRunId, status, metrics || {}]
  );
}

function createRunContext(runNumber) {
  const startedAtIso = safeIsoNow();
  const runId = `${startedAtIso.replace(/[:.]/g, '-')}-#${runNumber}`;

  return {
    runId,
    runNumber,
    startedAtIso,
    finishedAtIso: null,
    status: 'running',
    force: FORCE,
    steps: [],
    metrics: {
      extracted: 0,
      parsedOk: 0,
      parsedError: 0,
    },
  };
}

function writeRunReport(report) {
  const safeRunId = report.runId.replace(/[^a-zA-Z0-9-_]/g, '_');
  const reportPath = path.join(PIPELINE_RUNS_DIR, `${safeRunId}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n', 'utf8');
  return reportPath;
}

function acquireLockOrExit() {
  const currentPid = process.pid;
  const nowIso = safeIsoNow();

  if (fs.existsSync(PIPELINE_LOCK_FILE)) {
    try {
      const payload = JSON.parse(fs.readFileSync(PIPELINE_LOCK_FILE, 'utf8'));
      const pid = payload && payload.pid;
      if (pid && Number.isInteger(pid)) {
        try {
          process.kill(pid, 0);
          log('error', `[pipeline] another pipeline runner is active (pid=${pid}); exiting`);
          process.exit(1);
        } catch (_err) {
          log('warn', `[pipeline] found stale lock for dead pid=${pid}; replacing lock`);
        }
      }
    } catch (_err) {
      log('warn', '[pipeline] lock file unreadable; replacing lock');
    }
  }

  const lockPayload = {
    pid: currentPid,
    startedAt: nowIso,
    cwd: process.cwd(),
    mode: RUN_ONCE ? 'once' : 'polling',
  };

  fs.writeFileSync(PIPELINE_LOCK_FILE, JSON.stringify(lockPayload, null, 2) + '\n', 'utf8');
}

function releaseLock() {
  try {
    if (fs.existsSync(PIPELINE_LOCK_FILE)) {
      const payload = JSON.parse(fs.readFileSync(PIPELINE_LOCK_FILE, 'utf8'));
      if (payload && payload.pid === process.pid) {
        fs.rmSync(PIPELINE_LOCK_FILE, { force: true });
      }
    }
  } catch (_err) {
    fs.rmSync(PIPELINE_LOCK_FILE, { force: true });
  }
}

async function executeWithRetry(stepName, fn, maxRetries) {
  let attempt = 0;
  let final = null;

  while (attempt <= maxRetries) {
    attempt += 1;
    const startedAt = Date.now();

    try {
      const detail = await fn();
      final = {
        stepName,
        attempt,
        ok: true,
        durationMs: Date.now() - startedAt,
        detail,
      };
      return final;
    } catch (error) {
      final = {
        stepName,
        attempt,
        ok: false,
        durationMs: Date.now() - startedAt,
        detail: { error: error.message },
      };

      if (attempt <= maxRetries) {
        log('warn', `[${stepName}] attempt ${attempt} failed, retrying`);
      }
    }
  }

  return final;
}

async function executePipelineRun(runNumber) {
  const report = createRunContext(runNumber);
  const label = `[pipeline #${runNumber}]`;

  log('log', `${'='.repeat(72)}`);
  log('log', `${label} started at ${report.startedAtIso}`);

  let pipelineRunId = null;
  await withDbClient(async (dbClient) => {
    pipelineRunId = await createRunRow(dbClient, report.runId, report.runNumber);
  });

  const extractResult = await executeWithRetry('extract_to_db', () => extractEmailsToDb(), STEP_MAX_RETRIES);
  report.steps.push(extractResult);
  report.metrics.extracted = extractResult.ok ? extractResult.detail.extractedCount : 0;

  await withDbClient(async (dbClient) => {
    await insertRunStep(dbClient, pipelineRunId, 'extract_to_db', extractResult.ok ? 'success' : 'failed', extractResult.detail);
  });

  if (!extractResult.ok) {
    report.status = 'failed';
    report.finishedAtIso = safeIsoNow();
    await withDbClient(async (dbClient) => {
      await finalizeRunRow(dbClient, pipelineRunId, 'failed', report.metrics);
    });
    const reportPath = writeRunReport(report);
    log('error', `${label} extract step failed`);
    log('error', `${label} report: ${reportPath}`);
    return;
  }

  const parseResult = await executeWithRetry('parse_to_db', () => parseEmailsFromDb(FORCE), STEP_MAX_RETRIES);
  report.steps.push(parseResult);
  if (parseResult.ok) {
    report.metrics.parsedOk = parseResult.detail.parsedCount;
    report.metrics.parsedError = parseResult.detail.errorCount;
  }

  await withDbClient(async (dbClient) => {
    await insertRunStep(dbClient, pipelineRunId, 'parse_to_db', parseResult.ok ? 'success' : 'failed', parseResult.detail);
  });

  report.status = parseResult.ok ? 'success' : 'failed';
  report.finishedAtIso = safeIsoNow();

  await withDbClient(async (dbClient) => {
    await finalizeRunRow(dbClient, pipelineRunId, report.status, report.metrics);
  });

  const reportPath = writeRunReport(report);
  if (report.status === 'success') {
    log('log', `${label} complete: extracted=${report.metrics.extracted} parsed_ok=${report.metrics.parsedOk} parsed_error=${report.metrics.parsedError}`);
    log('log', `${label} report: ${reportPath}`);
  } else {
    log('error', `${label} failed`);
    log('error', `${label} report: ${reportPath}`);
  }
}

let runNumber = 0;
let isRunning = false;
let isShuttingDown = false;
let timer = null;

async function tick() {
  if (isRunning) {
    log('warn', '[pipeline] previous run still active; skipping this tick');
    return;
  }
  if (isShuttingDown) return;

  runNumber += 1;
  isRunning = true;

  try {
    await executePipelineRun(runNumber);
  } catch (err) {
    log('error', `[pipeline #${runNumber}] unexpected error: ${err.message}`);
  } finally {
    isRunning = false;
    if (isShuttingDown) {
      releaseLock();
      await pool.end().catch(() => {});
      process.exit(0);
    }
  }
}

function requestShutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;
  if (timer) clearInterval(timer);
  log('warn', `[pipeline] received ${signal}; shutting down`);
  if (!isRunning) {
    releaseLock();
    pool.end().catch(() => {}).finally(() => process.exit(0));
  }
}

process.on('SIGINT', () => requestShutdown('SIGINT'));
process.on('SIGTERM', () => requestShutdown('SIGTERM'));
process.on('exit', () => releaseLock());

acquireLockOrExit();

if (RUN_ONCE) {
  tick();
} else {
  log('log', `[pipeline] polling every ${Math.floor(POLL_INTERVAL_MS / 1000)}s`);
  tick();
  timer = setInterval(() => {
    tick().catch((err) => {
      log('error', `[pipeline] tick failed: ${err.message}`);
    });
  }, POLL_INTERVAL_MS);
}
