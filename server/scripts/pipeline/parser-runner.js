'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

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
  runParser,
};
