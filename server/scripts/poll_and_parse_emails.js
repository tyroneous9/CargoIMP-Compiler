const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { ImapFlow } = require('imapflow');
const { simpleParser } = require('mailparser');

require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

// Configure: max emails to process per polling run (reads newest first).
// Set to -1 for no limit (process all new emails).
const MAX_EMAILS_PER_RUN = 500;

// Read a required environment variable and fail fast if it is missing.
function requireEnv(key) {
  const value = process.env[key];
  if (!value || value.trim() === '') {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value.trim();
}

// Normalize email addresses for case-insensitive allowlist matching.
function normalizeAddress(raw) {
  return String(raw || '').trim().toLowerCase();
}

// Extract all sender addresses from the parsed From header.
function getSenderAddresses(parsedFrom) {
  if (!parsedFrom || !Array.isArray(parsedFrom.value)) {
    return [];
  }

  const addresses = [];
  for (const entry of parsedFrom.value) {
    if (entry && entry.address) {
      addresses.push(normalizeAddress(entry.address));
    }
  }
  return addresses;
}

// Resolve the on-disk UID checkpoint used for incremental polling.
function getCheckpointPath() {
  return path.resolve(__dirname, '..', 'data', 'imap_last_uid.txt');
}

// Read the last processed UID; default to 0 if no checkpoint exists yet.
function readLastUid(checkpointFile) {
  try {
    const text = fs.readFileSync(checkpointFile, 'utf8').trim();
    const uid = Number(text);
    return Number.isFinite(uid) && uid > 0 ? uid : 0;
  } catch (_) {
    return 0;
  }
}

// Persist the latest processed UID so future runs only read newer messages.
function writeLastUid(checkpointFile, uid) {
  fs.mkdirSync(path.dirname(checkpointFile), { recursive: true });
  fs.writeFileSync(checkpointFile, `${uid}\n`, 'utf8');
}

// Read an optional positive integer env var, or use the provided fallback.
function readOptionalPositiveIntEnv(key, fallback) {
  const raw = process.env[key];
  if (!raw || raw.trim() === '') {
    return fallback;
  }

  const value = Number(raw);
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${key} must be a positive integer`);
  }
  return value;
}

// Prefer plain text body; fall back to HTML text when plain text is missing.
function normalizeBody(parsedEmail) {
  const textBody = (parsedEmail.text || '').replace(/\r\n/g, '\n').trim();
  if (textBody) {
    return textBody;
  }

  const htmlBody = (parsedEmail.html || '').toString().replace(/\r\n/g, '\n').trim();
  return htmlBody;
}

// Get the first body line, normalized for message-type detection.
function firstBodyLine(body) {
  return String(body || '')
    .replace(/\r\n/g, '\n')
    .split('\n')[0]
    .trim()
    .toUpperCase();
}

// Choose exactly one parser binary from the CIMP message type in line 1.
function chooseParserByMessageType(body) {
  const repoRoot = path.resolve(__dirname, '..', '..');
  const header = firstBodyLine(body);

  if (header.startsWith('FFM/8')) {
    return {
      format: 'ffm8',
      binary: path.resolve(repoRoot, 'cpp', 'build', 'parser_ffm_json'),
    };
  }

  if (header.startsWith('FWB/17')) {
    return {
      format: 'fwb17',
      binary: path.resolve(repoRoot, 'cpp', 'build', 'parser_fwb17_json'),
    };
  }

  if (header.startsWith('FHL/4')) {
    return {
      format: 'fhl4',
      binary: path.resolve(repoRoot, 'cpp', 'build', 'parser_fhl4_json'),
    };
  }

  return null;
}

// Run the selected parser against the email body and normalize success/error shape.
function runSingleParser(parserConfig, body) {
  if (!parserConfig) {
    return {
      status: 'error',
      format: null,
      fields: null,
      stderr: '',
      error: 'Unsupported CIMP message type in first body line',
    };
  }

  if (!fs.existsSync(parserConfig.binary)) {
    return {
      status: 'error',
      format: parserConfig.format,
      fields: null,
      stderr: '',
      error: `Parser binary not found: ${parserConfig.binary}`,
    };
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ncaparser-poller-'));
  const inputFile = path.join(tmpDir, 'email_body.txt');

  try {
    fs.writeFileSync(inputFile, body, 'utf8');
    const result = spawnSync(parserConfig.binary, ['-file', inputFile], {
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024,
    });

    const stdoutText = (result.stdout || '').trim();
    const stderrText = (result.stderr || '').trim();

    if (result.status !== 0) {
      return {
        status: 'error',
        format: parserConfig.format,
        fields: null,
        stderr: stderrText || stdoutText,
        error: `Parser exited with status ${result.status}`,
      };
    }

    try {
      return {
        status: 'ok',
        format: parserConfig.format,
        fields: JSON.parse(stdoutText),
        stderr: stderrText,
      };
    } catch (error) {
      return {
        status: 'error',
        format: parserConfig.format,
        fields: null,
        stderr: stderrText || stdoutText,
        error: `Parser output was not valid JSON: ${error.message}`,
      };
    }
  } catch (error) {
    return {
      status: 'error',
      format: parserConfig.format,
      fields: null,
      stderr: '',
      error: error.message,
    };
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

// Build the final stdout envelope containing source email data and parse result.
function buildOutputEnvelope(message, parsedEmail, body, parsing) {
  const output = {
    email: {
      uid: message.uid,
      date: message.internalDate ? message.internalDate.toISOString() : null,
      subject: parsedEmail.subject || '(no subject)',
      from: parsedEmail.from ? parsedEmail.from.text : '(unknown sender)',
      body,
    },
    parsing,
  };

  return output;
}

// Return the root directory where local review artifacts are stored.
function getOutputsRoot() {
  return path.resolve(__dirname, '..', 'outputs');
}

// Convert free-form text into a short filename-safe token.
function toPathToken(value, fallback = 'na') {
  const normalized = String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!normalized) {
    return fallback;
  }
  return normalized.slice(0, 48);
}

// Build a readable and mostly-stable filename stem for one email artifact.
function buildArtifactNameStem(envelope) {
  const dateToken = envelope.email.date
    ? envelope.email.date.replace(/[:.]/g, '-').replace('T', '_').replace('Z', 'Z')
    : 'unknown-date';
  const uidToken = Number.isFinite(envelope.email.uid) ? String(envelope.email.uid) : 'unknown-uid';
  const fromToken = toPathToken(envelope.email.from, 'unknown-from');
  const subjectToken = toPathToken(envelope.email.subject, 'no-subject');
  return `${dateToken}__uid-${uidToken}__from-${fromToken}__subj-${subjectToken}`;
}

// Ensure each envelope file path is unique to avoid accidental overwrites.
function createUniqueEnvelopePath(outputsRoot, baseStem) {
  let candidate = path.join(outputsRoot, `${baseStem}.json`);
  let suffix = 1;
  while (fs.existsSync(candidate)) {
    suffix += 1;
    candidate = path.join(outputsRoot, `${baseStem}__${suffix}.json`);
  }
  return candidate;
}

// Store one envelope artifact locally and append one lookup record to data/index.ndjson.
function persistOutputArtifacts(mailbox, envelope) {
  const serverRoot = path.resolve(__dirname, '..');
  const outputsRoot = getOutputsRoot();
  fs.mkdirSync(outputsRoot, { recursive: true });

  const envelopePath = createUniqueEnvelopePath(outputsRoot, buildArtifactNameStem(envelope));

  fs.writeFileSync(envelopePath, `${JSON.stringify(envelope, null, 2)}\n`, 'utf8');

  const toRelative = (absolutePath) => path.relative(serverRoot, absolutePath).replace(/\\/g, '/');
  const referenceRecord = {
    indexedAt: new Date().toISOString(),
    mailbox,
    uid: envelope.email.uid,
    date: envelope.email.date,
    from: envelope.email.from,
    subject: envelope.email.subject,
    parserFormat: envelope.parsing.format,
    parseStatus: envelope.parsing.status,
    envelopePath: toRelative(envelopePath),
  };

  const referenceFile = path.join(serverRoot, 'data', 'index.ndjson');
  fs.mkdirSync(path.dirname(referenceFile), { recursive: true });
  fs.appendFileSync(referenceFile, `${JSON.stringify(referenceRecord)}\n`, 'utf8');
}

// Execute one polling pass: fetch new emails, filter senders, parse, and emit JSON lines.
async function main() {
  const host = requireEnv('ALIMAIL_NCA_HOST');
  const user = requireEnv('ALIMAIL_NCA_USER');
  const pass = requireEnv('ALIMAIL_NCA_PASS');
  const port = Number(requireEnv('ALIMAIL_NCA_PORT'));
  const mailbox = requireEnv('ALIMAIL_NCA_MAILBOX');

  const targetSender1 = normalizeAddress(requireEnv('TARGET_SENDER_ADDRESS_1'));
  const targetSender2 = normalizeAddress(requireEnv('TARGET_SENDER_ADDRESS_2'));

  if (!Number.isFinite(port) || port <= 0) {
    throw new Error('ALIMAIL_NCA_PORT must be a positive number');
  }

  const senderAllowlist = new Set([targetSender1, targetSender2]);
  const checkpointFile = getCheckpointPath();
  const lastUid = readLastUid(checkpointFile);

  const client = new ImapFlow({
    host,
    port,
    secure: true,
    auth: { user, pass },
    logger: false,
  });

  try {
    await client.connect();
    const lock = await client.getMailboxLock(mailbox);

    try {
      const uids = await client.search({ uid: `${lastUid + 1}:*` }, { uid: true });
      const newestFirst = (uids || []).sort((a, b) => b - a);
      const limitedNewest = MAX_EMAILS_PER_RUN === -1 ? newestFirst : newestFirst.slice(0, MAX_EMAILS_PER_RUN);
      const sortedUids = limitedNewest.sort((a, b) => a - b);

      let maxSeenUid = lastUid;

      for (const uid of sortedUids) {
        const message = await client.fetchOne(
          uid,
          {
            uid: true,
            internalDate: true,
            source: true,
          },
          { uid: true }
        );

        if (!message) {
          continue;
        }

        maxSeenUid = Math.max(maxSeenUid, message.uid);

        const parsedEmail = await simpleParser(message.source);
        const senderAddresses = getSenderAddresses(parsedEmail.from);
        const isAllowedSender = senderAddresses.some((addr) => senderAllowlist.has(addr));

        if (!isAllowedSender) {
          continue;
        }

        const body = normalizeBody(parsedEmail);
        const parserConfig = chooseParserByMessageType(body);
        const parsing = runSingleParser(parserConfig, body);

        const envelope = buildOutputEnvelope(message, parsedEmail, body, parsing);
        persistOutputArtifacts(mailbox, envelope);
        process.stdout.write(`${JSON.stringify(envelope)}\n`);
      }

      if (maxSeenUid > lastUid) {
        writeLastUid(checkpointFile, maxSeenUid);
      }
    } finally {
      lock.release();
    }
  } finally {
    await client.logout().catch(() => {});
  }
}

main().catch((error) => {
  console.error(`poller failed: ${error.message}`);
  process.exitCode = 1;
});