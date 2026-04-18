const fs = require('fs');
const path = require('path');
const paths = require('../config/paths');
const { log } = require('../config/logger');

const TEMP_INDEX_FILE = path.join(paths.OUTPUTS_DIR, 'mvt-index.tmp.ndjson');

function firstBodyLine(body) {
  return String(body || '')
    .replace(/\r\n/g, '\n')
    .split('\n')[0]
    .trim()
    .toUpperCase();
}

function main() {
  fs.mkdirSync(paths.OUTPUTS_DIR, { recursive: true });

  const emailFiles = fs.existsSync(paths.EMAILS_DIR)
    ? fs.readdirSync(paths.EMAILS_DIR).filter((f) => f.endsWith('.json')).sort()
    : [];

  const records = [];
  let skippedInvalidJson = 0;

  for (const emailFile of emailFiles) {
    const emailPath = path.join(paths.EMAILS_DIR, emailFile);

    let email;
    try {
      email = JSON.parse(fs.readFileSync(emailPath, 'utf8'));
    } catch (error) {
      skippedInvalidJson++;
      log('warn', `skipping invalid JSON: ${emailFile} (${error.message})`);
      continue;
    }

    if (firstBodyLine(email.body) !== 'MVT') continue;

    records.push({
      uid: email.uid ?? null,
      mailbox: email.mailbox ?? null,
      date: email.date ?? null,
      subject: email.subject ?? null,
      from: email.from ?? null,
      to: email.to ?? null,
      messageType: email.messageType ?? null,
      emailFile,
      emailPath: `data/outputs/emails/${emailFile}`,
    });
  }

  const ndjson = records.map((r) => JSON.stringify(r)).join('\n');
  fs.writeFileSync(TEMP_INDEX_FILE, ndjson ? `${ndjson}\n` : '', 'utf8');

  log('log', `scanned email files: ${emailFiles.length}`);
  log('log', `matched MVT first-line body: ${records.length}`);
  if (skippedInvalidJson > 0) {
    log('warn', `skipped invalid JSON files: ${skippedInvalidJson}`);
  }
  log('log', `wrote temporary index: ${TEMP_INDEX_FILE}`);
}

main();
