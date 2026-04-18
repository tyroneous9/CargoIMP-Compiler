// Script to parse extracted emails using C++ parsers
// Reads email JSONs from server/data/outputs/emails/INBOX-uid-<UID>.json
// Uses cimpType field to select parser
// Outputs to server/data/outputs/parsed/parsed-INBOX-uid-<UID>.json

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const paths = require('../config/paths');
const { log } = require('../config/logger');

const EMAILS_DIR = paths.EMAILS_DIR;
const PARSED_EMAILS_DIR = paths.PARSED_EMAILS_DIR;

const PARSER_BINARIES = {
  ffm: paths.PARSER_BINARIES.ffm,
  fwb: paths.PARSER_BINARIES.fwb,
  fhl: paths.PARSER_BINARIES.fhl,
};

fs.mkdirSync(PARSED_EMAILS_DIR, { recursive: true });

function buildParsedFilename(mailbox, uid) {
  return `parsed-${mailbox}-uid-${uid}.json`;
}

function runParser(parserBinary, body) {
  const os = require('os');
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ncaparser-batch-'));
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
    resultObj = { status: 'error', stderr: error.message };
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

  // Canonical FlightIdentification object.
  if (!fields.FlightIdentification || typeof fields.FlightIdentification !== 'object') {
    const parts = splitBySlash(fields.FlightIdentificationLine || '');
    fields.FlightIdentification = {
      MessageFunctionCode: parts[0] || '',
      CarrierFlightNumber: parts[1] || '',
      DayMonthTime: parts[2] || '',
      BoardPoint: parts[3] || '',
      AircraftRegistration: parts[4] || '',
    };
  }

  // Canonical Routes array.
  if (!Array.isArray(fields.Routes)) {
    const lines = String(fields.RouteLine || '').split('\n').filter(Boolean);
    fields.Routes = lines.map((line) => {
      const directMatch = line.match(/^([A-Z]{3})\/\/([^\/]*)$/);
      if (directMatch) {
        return {
          AirportCode: directMatch[1],
          RouteKind: 'Direct',
          ScheduledArrivalTime: directMatch[2],
          ScheduledDepartureTime: '',
        };
      }
      const nilMatch = line.match(/^([A-Z]{3})\/NIL(?:\/([^\/]*))?(?:\/([^\/]*))?$/);
      if (nilMatch) {
        return {
          AirportCode: nilMatch[1],
          RouteKind: 'TransitNIL',
          ScheduledArrivalTime: nilMatch[2] || '',
          ScheduledDepartureTime: nilMatch[3] || '',
        };
      }
      return {
        AirportCode: line,
        RouteKind: 'DestinationOnly',
        ScheduledArrivalTime: '',
        ScheduledDepartureTime: '',
      };
    });
  }

  // Remove redundant raw line fields when decomposed fields exist.
  if (fields.ULDs && typeof fields.ULDs === 'object') {
    for (const uld of Object.values(fields.ULDs)) {
      if (!uld || !Array.isArray(uld.AWBs)) continue;
      for (const awb of uld.AWBs) {
        if (awb && typeof awb === 'object') delete awb.AirWaybillLine;
      }
    }
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
        routing.push({
          AirportCode: point.slice(0, 3),
          CarrierCode: point.slice(3),
        });
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

  delete fields.TotalConsignmentSummary;
  delete fields.FlightBookingsLine;
  delete fields.RoutingLine;
  delete fields.CvdLine;
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

  delete fields.MasterBillLine;
  delete fields.MasterBillSummary;
  delete fields.CvdLine;

  if (Array.isArray(fields.HouseBills)) {
    for (const house of fields.HouseBills) {
      if (house && typeof house === 'object') delete house.HouseBillLine;
    }
  }

  return fields;
}

function normalizeParsedFields(cimpType, fields) {
  if (cimpType === 'ffm') return normalizeFfmFields(fields);
  if (cimpType === 'fwb') return normalizeFwbFields(fields);
  if (cimpType === 'fhl') return normalizeFhlFields(fields);
  return fields;
}

function main() {
  fs.mkdirSync(EMAILS_DIR, { recursive: true });
  const files = fs.readdirSync(EMAILS_DIR).filter(f => f.endsWith('.json'));
  let parsedCount = 0;
  let alreadyParsedCount = 0;
  let skippedMissingFieldsCount = 0;
  let missingParserCount = 0;
  let parserErrorCount = 0;

  for (const file of files) {
    const emailPath = path.join(EMAILS_DIR, file);
    const emailJson = JSON.parse(fs.readFileSync(emailPath, 'utf8'));
    const { uid, mailbox, body, cimpType } = emailJson;
    if (!uid || !mailbox || !body || !cimpType) {
      skippedMissingFieldsCount++;
      continue;
    }
    const parsedFilename = buildParsedFilename(mailbox, uid);
    const parsedPath = path.join(PARSED_EMAILS_DIR, parsedFilename);
    if (fs.existsSync(parsedPath)) {
      alreadyParsedCount++;
      continue;
    }
    const parserBinary = PARSER_BINARIES[cimpType];
    if (!parserBinary || !fs.existsSync(parserBinary)) {
      missingParserCount++;
      continue;
    }
    const result = runParser(parserBinary, body);
    if (result.status !== 'ok') parserErrorCount++;
    // Flatten output: only cimpType and all result fields at top level
    const normalizedFields = result.status === 'ok'
      ? normalizeParsedFields(cimpType, result.fields)
      : result.fields;
    const output = { cimpType, ...result, fields: normalizedFields };
    fs.writeFileSync(parsedPath, JSON.stringify(output, null, 2) + '\n', 'utf8');
    process.stdout.write(`Parsed: ${parsedFilename}\n`);
    parsedCount++;
  }

  log(
    'log',
    `parse summary: total=${files.length}, parsed=${parsedCount}, alreadyParsed=${alreadyParsedCount}, ` +
    `missingFields=${skippedMissingFieldsCount}, missingParser=${missingParserCount}, parseErrors=${parserErrorCount}`
  );
}

main();
