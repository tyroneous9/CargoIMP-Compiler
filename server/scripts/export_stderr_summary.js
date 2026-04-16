const fs = require('fs');
const path = require('path');
const paths = require('../config/paths');

function listOutputFiles(outputsDir) {
  if (!fs.existsSync(outputsDir)) {
    return [];
  }

  return fs
    .readdirSync(outputsDir)
    .filter((name) => name.endsWith('.json'))
    .sort();
}

function buildSummaryRecord(envelope, fileName) {
  return {
    uid: envelope?.email?.uid ?? null,
    date: envelope?.email?.date ?? null,
    from: envelope?.email?.from ?? null,
    subject: envelope?.email?.subject ?? null,
    format: envelope?.parsing?.format ?? null,
    envelopePath: `data/outputs/${fileName}`,
    stderr: envelope?.parsing?.stderr ?? '',
  };
}

function main() {
  const outputFiles = listOutputFiles(paths.OUTPUTS_DIR);
  const summaryRecords = [];

  for (const fileName of outputFiles) {
    const filePath = path.join(paths.OUTPUTS_DIR, fileName);

    let envelope;
    try {
      envelope = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (_error) {
      continue;
    }

    const stderr = envelope?.parsing?.stderr;
    if (typeof stderr === 'string' && stderr.trim() !== '') {
      summaryRecords.push(buildSummaryRecord(envelope, fileName));
    }
  }

  fs.mkdirSync(paths.DATA_DIR, { recursive: true });
  const reportPath = path.join(paths.DATA_DIR, 'stderr-summary.ndjson');

  const ndjson = summaryRecords.map((record) => JSON.stringify(record)).join('\n');
  fs.writeFileSync(reportPath, ndjson ? `${ndjson}\n` : '', 'utf8');

  console.log(`Scanned output envelopes: ${outputFiles.length}`);
  console.log(`Envelopes with stderr: ${summaryRecords.length}`);
  console.log(`Wrote report: ${reportPath}`);
}

main();
