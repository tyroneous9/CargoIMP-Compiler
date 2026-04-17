// Script to parse extracted emails using C++ parsers
// Reads email JSONs from server/data/outputs/emails/INBOX-uid-<UID>.json
// Uses cimpType field to select parser
// Outputs to server/data/outputs/parsed/parsed-INBOX-uid-<UID>.json

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const paths = require('../config/paths');

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

function main() {
  const files = fs.readdirSync(EMAILS_DIR).filter(f => f.endsWith('.json'));
  for (const file of files) {
    const emailPath = path.join(EMAILS_DIR, file);
    const emailJson = JSON.parse(fs.readFileSync(emailPath, 'utf8'));
    const { uid, mailbox, body, cimpType } = emailJson;
    if (!uid || !mailbox || !body || !cimpType) {
      process.stderr.write(`Skipping ${file}: missing uid, mailbox, body, or cimpType\n`);
      continue;
    }
    const parsedFilename = buildParsedFilename(mailbox, uid);
    const parsedPath = path.join(PARSED_EMAILS_DIR, parsedFilename);
    if (fs.existsSync(parsedPath)) {
      process.stderr.write(`Already parsed: ${parsedFilename}\n`);
      continue;
    }
    const parserBinary = PARSER_BINARIES[cimpType];
    if (!parserBinary || !fs.existsSync(parserBinary)) {
      process.stderr.write(`No parser for type ${cimpType} or binary missing for ${file}\n`);
      continue;
    }
    const result = runParser(parserBinary, body);
    // Flatten output: only cimpType and all result fields at top level
    const output = { cimpType, ...result };
    fs.writeFileSync(parsedPath, JSON.stringify(output, null, 2) + '\n', 'utf8');
    process.stdout.write(`Parsed: ${parsedFilename}\n`);
  }
}

main();
