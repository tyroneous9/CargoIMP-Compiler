'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { SUPPORTED_MESSAGE_TYPES, SUPPORTED_CIMP_MESSAGE_TYPES } = require('../../config/messageTypes');

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

module.exports = {
  detectMessageFormat,
  messageTypeToDbEnum,
  normalizeBody,
  runParser,
};