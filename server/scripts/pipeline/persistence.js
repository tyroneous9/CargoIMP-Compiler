'use strict';

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

function cleanText(value) {
  const text = String(value || '').trim();
  return text.length > 0 ? text : null;
}

function extractNameFromLine(line, allowedPrefixes) {
  const text = cleanText(line);
  if (!text) return null;

  const slashIndex = text.indexOf('/');
  if (slashIndex > 0) {
    const prefix = text.slice(0, slashIndex).trim().toUpperCase();
    if (allowedPrefixes.has(prefix)) {
      const suffix = cleanText(text.slice(slashIndex + 1));
      return suffix || null;
    }
  }

  return text;
}

function extractPartyName(party, fallbackLineKey, allowedPrefixes) {
  if (!party || typeof party !== 'object') return null;

  const directName = cleanText(party.Name) || cleanText(party.name);
  if (directName) return directName;

  const nameLine = cleanText(party.NameLine) || cleanText(party.nameLine);
  if (nameLine) {
    const parsed = extractNameFromLine(nameLine, allowedPrefixes);
    if (parsed) return parsed;
  }

  const fallbackLine = cleanText(party[fallbackLineKey]);
  if (fallbackLine) {
    const parsed = extractNameFromLine(fallbackLine, allowedPrefixes);
    if (parsed) return parsed;
  }

  return null;
}

const SHIPPER_PREFIXES = new Set(['SHP', 'NAM']);
const CONSIGNEE_PREFIXES = new Set(['CNE', 'NAM']);

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
          ffm_flight_id, uld_seq, uld_code, uld_detail_text, uld_weight, uld_detail_code, raw_fields
        ) VALUES ($1,$2,$3,$4,$5,$6,$7)
        RETURNING id
      `,
      [
        ffmFlightId,
        uldSeq,
        uldCode || null,
        uld.ULDDetailText || null,
        Number.isFinite(Number(uld.ULDWeight)) ? Number(uld.ULDWeight) : null,
        uld.ULDDetailCode || null,
        uld,
      ]
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
  const shipperName = extractPartyName(fields.Shipper, 'ShipperLine', SHIPPER_PREFIXES);
  const consigneeName = extractPartyName(fields.Consignee, 'ConsigneeLine', CONSIGNEE_PREFIXES);

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
      shipperName,
      consigneeName,
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
  const fallbackShipperName = extractPartyName(fields.Shipper, 'ShipperLine', SHIPPER_PREFIXES);
  const fallbackConsigneeName = extractPartyName(fields.Consignee, 'ConsigneeLine', CONSIGNEE_PREFIXES);
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
    const houseShipperName =
      extractPartyName(house.Shipper, 'ShipperLine', SHIPPER_PREFIXES) || fallbackShipperName;
    const houseConsigneeName =
      extractPartyName(house.Consignee, 'ConsigneeLine', CONSIGNEE_PREFIXES) || fallbackConsigneeName;
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
        houseShipperName,
        houseConsigneeName,
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

module.exports = {
  parseOriginDestination,
  persistFfmNormalized,
  persistFhlNormalized,
  persistFwbNormalized,
  persistMvtNormalized,
  persistNormalized,
};