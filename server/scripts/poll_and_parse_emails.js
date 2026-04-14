const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { ImapFlow } = require('imapflow');
const { simpleParser } = require('mailparser');

require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

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
      const sortedUids = (uids || []).sort((a, b) => a - b);

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