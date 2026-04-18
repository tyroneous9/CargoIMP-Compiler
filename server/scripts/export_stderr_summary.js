const fs = require('fs');
const path = require('path');
const paths = require('../config/paths');

function loadJsonFile(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (_) {
    return null;
  }
}

function main() {
  const emailFiles = fs.existsSync(paths.EMAILS_DIR)
    ? fs.readdirSync(paths.EMAILS_DIR).filter((f) => f.endsWith('.json')).sort()
    : [];

  const parsedFiles = fs.existsSync(paths.PARSED_EMAILS_DIR)
    ? new Set(fs.readdirSync(paths.PARSED_EMAILS_DIR).filter((f) => f.endsWith('.json')))
    : new Set();

  const summaryRecords = [];

  for (const emailFile of emailFiles) {
    const email = loadJsonFile(path.join(paths.EMAILS_DIR, emailFile));
    if (!email) continue;

    // Derive the parsed output filename from the email filename
    // emails: INBOX-uid-<N>.json → parsed: parsed-INBOX-uid-<N>.json
    const parsedFile = `parsed-${emailFile}`;
    const parsed = parsedFiles.has(parsedFile)
      ? loadJsonFile(path.join(paths.PARSED_EMAILS_DIR, parsedFile))
      : null;

    const stderr = parsed?.stderr ?? '';
    if (typeof stderr !== 'string' || stderr.trim() === '') continue;

    summaryRecords.push({
      uid: email.uid ?? null,
      date: email.date ?? null,
      from: email.from ?? null,
      subject: email.subject ?? null,
      cimpType: email.cimpType ?? null,
      status: parsed?.status ?? null,
      envelopePath: `data/outputs/emails/${emailFile}`,
      parsedPath: `data/outputs/parsed/${parsedFile}`,
      stderr,
    });
  }

  fs.mkdirSync(paths.OUTPUTS_DIR, { recursive: true });
  const reportPath = path.join(paths.OUTPUTS_DIR, 'stderr-summary.ndjson');

  const ndjson = summaryRecords.map((r) => JSON.stringify(r)).join('\n');
  fs.writeFileSync(reportPath, ndjson ? `${ndjson}\n` : '', 'utf8');

  console.log(`Scanned email files:     ${emailFiles.length}`);
  console.log(`With stderr output:      ${summaryRecords.length}`);
  console.log(`Wrote report:            ${reportPath}`);
}

main();
