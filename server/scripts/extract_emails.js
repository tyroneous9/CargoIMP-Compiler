// Email extractor script for NCAParser
// Extracts email body and metadata, outputs one JSON per email as INBOX-uid-<UID>.json
// Output directory: server/data/outputs/emails
// Includes message type (if a supported format is detected)

const fs = require('fs');
const path = require('path');
const { ImapFlow } = require('imapflow');
const { simpleParser } = require('mailparser');
const paths = require('../config/paths');
const { SUPPORTED_MESSAGE_TYPES, SUPPORTED_CIMP_MESSAGE_TYPES } = require('../config/messageTypes');
const { log } = require('../config/logger');

require('dotenv').config({ path: paths.ENV_FILE });

const OUTPUT_DIR = path.join(paths.SERVER_ROOT, 'data', 'outputs', 'emails');

function requireEnv(key) {
  const value = process.env[key];
  if (!value || value.trim() === '') {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value.trim();
}

function optionalPositiveIntEnv(key) {
  const raw = process.env[key];
  if (!raw || raw.trim() === '') return null;
  const value = Number(raw);
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`Invalid ${key}: expected a positive integer`);
  }
  return value;
}

function normalizeAddress(raw) {
  return String(raw || '').trim().toLowerCase();
}

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

function normalizeBody(parsedEmail) {
  const textBody = (parsedEmail.text || '').replace(/\r\n/g, '\n').trim();
  if (textBody) {
    return textBody;
  }
  const htmlBody = (parsedEmail.html || '').toString().replace(/\r\n/g, '\n').trim();
  return htmlBody;
}

function firstBodyLine(body) {
  return String(body || '')
    .replace(/\r\n/g, '\n')
    .split('\n')[0]
    .trim()
    .toUpperCase();
}

// Inspects the first body line and returns a supported message type string
// (e.g. 'ffm', 'fwb', 'fhl', 'mvt'), or null if the body does not begin with
// a recognised format header.
//
// CIMP cargo formats (FFM, FWB, FHL) use the header pattern FORMAT/DIGIT.
// MVT movement messages use the bare header "MVT".
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

function buildEmailFilename(mailbox, uid) {
  return `${mailbox}-uid-${uid}.json`;
}

async function main() {
  const host = requireEnv('ALIMAIL_NCA_HOST');
  const user = requireEnv('ALIMAIL_NCA_USER');
  const pass = requireEnv('ALIMAIL_NCA_PASS');
  const port = Number(requireEnv('ALIMAIL_NCA_PORT'));
  const mailbox = requireEnv('ALIMAIL_NCA_MAILBOX');
  const extractLimit = optionalPositiveIntEnv('EXTRACT_EMAIL_LIMIT');

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

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
      // Fetch all UIDs, then process newest-to-oldest for deterministic order.
      const uids = await client.search({ uid: '1:*' }, { uid: true });
      uids.sort((a, b) => b - a);

      let extractedCount = 0;
      for (const uid of uids) {
        // Only extract up to the configured limit per run, or unlimited if not set or set to -1.
        if (extractLimit != null && extractLimit !== -1 && extractedCount >= extractLimit) {
          log('log', `reached EXTRACT_EMAIL_LIMIT=${extractLimit}; stopping this run`);
          break;
        }

        const filename = buildEmailFilename(mailbox, uid);
        const outPath = path.join(OUTPUT_DIR, filename);
        if (fs.existsSync(outPath)) continue; // Skip if already extracted
        const message = await client.fetchOne(
          uid,
          {
            uid: true,
            internalDate: true,
            source: true,
          },
          { uid: true }
        );
        if (!message) continue;
        const parsedEmail = await simpleParser(message.source);
        const body = normalizeBody(parsedEmail);
        const messageType = detectMessageFormat(body);
        const emailJson = {
          uid: message.uid,
          mailbox,
          date: message.internalDate ? message.internalDate.toISOString() : null,
          subject: parsedEmail.subject || '(no subject)',
          from: parsedEmail.from ? parsedEmail.from.text : '(unknown sender)',
          to: parsedEmail.to ? parsedEmail.to.text : undefined,
          body,
          messageType,
        };
        fs.writeFileSync(outPath, JSON.stringify(emailJson, null, 2) + '\n', 'utf8');
        process.stdout.write(`Extracted: ${filename}\n`);
        extractedCount++;
      }

      log('log', `extracted ${extractedCount} email(s) this run`);
    } finally {
      lock.release();
    }
  } finally {
    await client.logout().catch(() => {});
    log('log', 'extraction finished');
  }
}

main().catch((error) => {
  log('error', `extractor failed: ${error.message}`);
  process.exitCode = 1;
});
