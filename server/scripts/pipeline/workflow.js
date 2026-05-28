'use strict';

const fs = require('fs');
const path = require('path');
const { ImapFlow } = require('imapflow');
const { simpleParser } = require('mailparser');
const {
  LOGS_DIR,
  PARSER_BINARIES,
} = require('../../config/paths');
const { isSupportedMessageType } = require('../../config/messageTypes');
const { withDbClient, pool } = require('../../config/db');
const { getPipelineConfig, getExtractEmailLimit } = require('../../config/pipeline');
const { getImapConfig } = require('../../config/imap');
const { getParserConfig } = require('../../config/parser');
const {
  normalizeBody,
} = require('./normalizers');
const {
  detectSubjectClassification,
  messageTypeToDbEnum,
} = require('./message-format');
const { runParser } = require('./parser-runner');
const {
  persistNormalized,
} = require('./persistence');

const PIPELINE_RUNS_DIR = path.join(LOGS_DIR, 'pipeline-runs');
const PIPELINE_LOCK_FILE = path.join(LOGS_DIR, 'pipeline.lock.json');

const pipelineConfig = getPipelineConfig();
const parserConfig = getParserConfig();

const POLL_INTERVAL_MS = pipelineConfig.pollIntervalMs;
const STEP_MAX_RETRIES = pipelineConfig.stepMaxRetries;
const PARSE_BATCH_LIMIT = pipelineConfig.parseBatchLimit;

const RUN_ONCE = process.argv.includes('--once');
const FORCE = process.argv.includes('--force');

fs.mkdirSync(LOGS_DIR, { recursive: true });
fs.mkdirSync(PIPELINE_RUNS_DIR, { recursive: true });

function log(level, text) {
  const ts = new Date().toISOString();
  const line = `${ts} [${level.toUpperCase()}] ${text}`;
  process.stderr.write(line + '\n');
}

function safeIsoNow() {
  return new Date().toISOString();
}

function toAddressText(addresses) {
  if (!Array.isArray(addresses) || addresses.length === 0) return null;

  return addresses
    .map((entry) => {
      if (!entry) return null;
      const name = entry.name ? String(entry.name).trim() : '';
      const address = entry.address ? String(entry.address).trim() : '';
      if (name && address) return `${name} <${address}>`;
      return address || name || null;
    })
    .filter(Boolean)
    .join(', ');
}

async function upsertRawEmail(client, email) {
  const query = `
    INSERT INTO emails_raw (
      mailbox, uid, message_type, subject, sender, received_at, body, raw_json
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    ON CONFLICT (mailbox, uid) DO UPDATE SET
      message_type = EXCLUDED.message_type,
      subject = EXCLUDED.subject,
      sender = EXCLUDED.sender,
      received_at = EXCLUDED.received_at,
      body = EXCLUDED.body,
      raw_json = EXCLUDED.raw_json
    RETURNING id
  `;

  const values = [
    email.mailbox,
    email.uid,
    messageTypeToDbEnum(email.messageType),
    email.subject,
    email.sender,
    email.receivedAt,
    email.body,
    email.rawJson,
  ];

  const result = await client.query(query, values);
  return result.rows[0].id;
}

async function insertParsedResult(client, payload) {
  const query = `
    INSERT INTO messages_parsed (
      email_id, parser_name, parser_version, message_type, status, stderr, stdout, result_json, payload_json
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING id
  `;

  const values = [
    payload.emailId,
    payload.parserName,
    payload.parserVersion,
    payload.messageType,
    payload.status,
    payload.stderr,
    payload.stdout,
    payload.resultJson,
    payload.payloadJson,
  ];

  const result = await client.query(query, values);
  return result.rows[0].id;
}

async function getLatestFetchedUidForMailbox(client, mailbox) {
  const result = await client.query(
    `
      SELECT COALESCE(MAX(uid), 0) AS latest_uid
      FROM emails_raw
      WHERE mailbox = $1
    `,
    [mailbox]
  );

  const raw = result.rows[0] ? result.rows[0].latest_uid : 0;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

async function extractEmailsToDb() {
  const { host, user, pass, port, mailbox } = getImapConfig();
  const extractLimit = getExtractEmailLimit();

  const latestFetchedUid = await withDbClient((dbClient) =>
    getLatestFetchedUidForMailbox(dbClient, mailbox)
  );

  const client = new ImapFlow({
    host,
    port,
    secure: true,
    auth: { user, pass },
    // Default socket timeout is 5 minutes; extraction can exceed that on large batches.
    socketTimeout: 15 * 60 * 1000,
    logger: false,
  });

  let extractedCount = 0;
  let skippedUnrecognizedCount = 0;

  try {
    log('log', `[extract] connecting to IMAP host=${host} mailbox=${mailbox}`);
    await client.connect();
    const lock = await client.getMailboxLock(mailbox);

    try {
      const searchStartUid = latestFetchedUid > 0 ? latestFetchedUid + 1 : 1;
      const hasCheckpoint = latestFetchedUid > 0;
      const processNewestFirst = !hasCheckpoint;
      log('log', `[extract] searching uid range ${searchStartUid}:*`);
      const uids = await client.search({ uid: `${searchStartUid}:*` }, { uid: true });
      uids.sort((a, b) => a - b);

      let candidateUids;
      if (extractLimit === -1) {
        candidateUids = processNewestFirst ? [...uids].reverse() : uids;
      } else if (processNewestFirst) {
        candidateUids = uids.slice(-extractLimit).reverse();
      } else {
        candidateUids = uids.slice(0, extractLimit);
      }

      log(
        'log',
        `[extract] latestFetchedUid=${latestFetchedUid} matched=${uids.length} candidate=${candidateUids.length} limit=${extractLimit} newestFirst=${processNewestFirst}`
      );

      if (candidateUids.length === 0) {
        return { extractedCount, skippedUnrecognizedCount };
      }

      await withDbClient(async (dbClient) => {
        const headers = [];
        for await (const messageHeader of client.fetch(
          candidateUids,
          { uid: true, internalDate: true, envelope: true },
          { uid: true }
        )) {
          headers.push(messageHeader);
        }

        headers.sort((a, b) => {
          const aUid = Number(a?.uid || 0);
          const bUid = Number(b?.uid || 0);
          return processNewestFirst ? bUid - aUid : aUid - bUid;
        });

        for (const messageHeader of headers) {
          const uid = Number(messageHeader.uid);
          if (!Number.isFinite(uid) || uid <= 0) continue;

          const envelope = messageHeader.envelope || {};
          const subject = envelope.subject || '(no subject)';
          const { messageType, notificationSubject } = detectSubjectClassification(subject);
          const isParserEligible = Boolean(messageType && isSupportedMessageType(messageType));

          let body = null;
          let sender = toAddressText(envelope.from) || '(unknown sender)';
          let recipients = toAddressText(envelope.to);

          if (isParserEligible) {
            const sourceMessage = await client.fetchOne(
              uid,
              { uid: true, source: true },
              { uid: true }
            );

            if (!sourceMessage || !sourceMessage.source) {
              skippedUnrecognizedCount += 1;
              continue;
            }

            const parsedEmail = await simpleParser(sourceMessage.source);
            body = normalizeBody(parsedEmail);
            sender = parsedEmail.from ? parsedEmail.from.text : sender;
            recipients = parsedEmail.to ? parsedEmail.to.text : recipients;
          } else {
            skippedUnrecognizedCount += 1;
          }

          const rawJson = {
            uid,
            mailbox,
            date: messageHeader.internalDate ? messageHeader.internalDate.toISOString() : null,
            subject,
            from: sender,
            to: recipients,
            body,
            subjectMessageType: messageType,
            recognizedNotification: notificationSubject,
          };

          const persistedBody = typeof body === 'string' ? body : '';

          await upsertRawEmail(dbClient, {
            mailbox,
            uid,
            messageType: isParserEligible ? messageType : null,
            subject,
            sender,
            receivedAt: rawJson.date,
            body: persistedBody,
            rawJson,
          });

          extractedCount += 1;
        }
      });
    } finally {
      lock.release();
    }
  } catch (error) {
    throw error;
  } finally {
    await client.logout().catch(() => {});
  }

  return { extractedCount, skippedUnrecognizedCount };
}

async function fetchEmailsToParse(dbClient, force) {
  if (force) {
    const result = await dbClient.query(
      `
        SELECT id, mailbox, uid, message_type, subject, body
        FROM emails_raw
        WHERE message_type IS NOT NULL
        ORDER BY uid ASC
        LIMIT $1
      `,
      [PARSE_BATCH_LIMIT]
    );
    return result.rows;
  }

  const result = await dbClient.query(
    `
      SELECT er.id, er.mailbox, er.uid, er.message_type, er.subject, er.body
      FROM emails_raw er
      WHERE NOT EXISTS (
        SELECT 1
        FROM messages_parsed mp
        WHERE mp.email_id = er.id
      )
        AND er.message_type IS NOT NULL
      ORDER BY er.uid ASC
      LIMIT $1
    `,
    [PARSE_BATCH_LIMIT]
  );
  return result.rows;
}

async function parseEmailsFromDb(force) {
  let parsedCount = 0;
  let errorCount = 0;
  let selectedCount = 0;

  log(
    'log',
    `[parse] starting parse_to_db force=${force} batch_limit=${PARSE_BATCH_LIMIT} parser_version=${parserConfig.version}`
  );

  await withDbClient(async (dbClient) => {
    const rows = await fetchEmailsToParse(dbClient, force);
    selectedCount = rows.length;

    log('log', `[parse] selected ${selectedCount} candidate emails`);

    for (const row of rows) {
      const dbMessageType = row.message_type ? String(row.message_type).toUpperCase() : null;
      const localMessageType = dbMessageType ? dbMessageType.toLowerCase() : null;

      if (!dbMessageType || !localMessageType || !isSupportedMessageType(localMessageType)) {
        errorCount += 1;
        log('warn', `[parse] skipped unsupported email_id=${row.id} uid=${row.uid} subject=${row.subject || '(no subject)'}`);
        continue;
      }
      const parserBinary = localMessageType && PARSER_BINARIES[localMessageType] ? PARSER_BINARIES[localMessageType] : null;

      const baseResult = {
        messageType: dbMessageType,
        status: 'error',
        stderr: null,
        stdout: null,
        fields: null,
      };

      let parserResult = null;

      if (!parserBinary || !fs.existsSync(parserBinary)) {
        parserResult = {
          ...baseResult,
          status: 'error',
          stderr: `Parser binary missing for type ${localMessageType}`,
        };
      } else {
        const parsed = runParser(parserBinary, row.body || '');
        parserResult = {
          ...baseResult,
          status: parsed.status,
          stderr: parsed.stderr || null,
          stdout: parsed.stdout || null,
          fields: parsed.status === 'ok' ? parsed.fields : null,
        };
      }

      await dbClient.query('BEGIN');
      try {
        const parsedMessageId = await insertParsedResult(dbClient, {
          emailId: row.id,
          parserName: localMessageType ? `parser_${localMessageType}_json` : 'parser_unknown',
          parserVersion: parserConfig.version,
          messageType: dbMessageType,
          status: parserResult.status,
          stderr: parserResult.stderr,
          stdout: parserResult.stdout,
          resultJson: parserResult,
          payloadJson: parserResult.fields,
        });

        if (parserResult.status === 'ok' && parserResult.fields) {
          await persistNormalized(dbClient, dbMessageType, parsedMessageId, parserResult.fields);
          parsedCount += 1;
        } else {
          errorCount += 1;
          log('error', `[parse] email_id=${row.id} uid=${row.uid} subject=${row.subject || '(no subject)'}: ${parserResult.stderr || 'unknown parse failure'}`);
        }

        await dbClient.query('COMMIT');
      } catch (error) {
        await dbClient.query('ROLLBACK');
        errorCount += 1;
        log('error', `[parse] failed email_id=${row.id} uid=${row.uid}: ${error.message}`);
      }
    }
  });

  log('log', `[parse] finished parsed_ok=${parsedCount} parsed_error=${errorCount} selected=${selectedCount}`);

  return { parsedCount, errorCount, selectedCount };
}

async function createRunRow(client, runId, runNumber) {
  try {
    const result = await client.query(
      `
        INSERT INTO pipeline_runs (run_id, run_number, status, started_at, force_run)
        VALUES ($1, $2, 'running', NOW(), $3)
        RETURNING id
      `,
      [runId, runNumber, FORCE]
    );
    return result.rows[0].id;
  } catch (_error) {
    return null;
  }
}

async function insertRunStep(client, pipelineRunId, stepName, status, detail) {
  if (!pipelineRunId) return;
  await client.query(
    `
      INSERT INTO pipeline_run_steps (pipeline_run_id, step_name, status, detail_json, started_at, finished_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
    `,
    [pipelineRunId, stepName, status, detail || {}]
  );
}

async function finalizeRunRow(client, pipelineRunId, status, metrics) {
  if (!pipelineRunId) return;
  await client.query(
    `
      UPDATE pipeline_runs
      SET status = $2,
          metrics_json = $3,
          finished_at = NOW()
      WHERE id = $1
    `,
    [pipelineRunId, status, metrics || {}]
  );
}

function createRunContext(runNumber) {
  const startedAtIso = safeIsoNow();
  const runId = `${startedAtIso.replace(/[:.]/g, '-')}-#${runNumber}`;

  return {
    runId,
    runNumber,
    startedAtIso,
    finishedAtIso: null,
    status: 'running',
    force: FORCE,
    steps: [],
    metrics: {
      extracted: 0,
      parsedOk: 0,
      parsedError: 0,
    },
  };
}

function writeRunReport(report) {
  const safeRunId = report.runId.replace(/[^a-zA-Z0-9-_]/g, '_');
  const reportPath = path.join(PIPELINE_RUNS_DIR, `${safeRunId}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n', 'utf8');
  return reportPath;
}

function acquireLockOrExit() {
  const currentPid = process.pid;
  const nowIso = safeIsoNow();

  if (fs.existsSync(PIPELINE_LOCK_FILE)) {
    try {
      const payload = JSON.parse(fs.readFileSync(PIPELINE_LOCK_FILE, 'utf8'));
      const pid = payload && payload.pid;
      if (pid && Number.isInteger(pid)) {
        try {
          process.kill(pid, 0);
          log('error', `[pipeline] another pipeline runner is active (pid=${pid}); exiting`);
          process.exit(1);
        } catch (_err) {
          log('warn', `[pipeline] found stale lock for dead pid=${pid}; replacing lock`);
        }
      }
    } catch (_err) {
      log('warn', '[pipeline] lock file unreadable; replacing lock');
    }
  }

  const lockPayload = {
    pid: currentPid,
    startedAt: nowIso,
    cwd: process.cwd(),
    mode: RUN_ONCE ? 'once' : 'polling',
  };

  fs.writeFileSync(PIPELINE_LOCK_FILE, JSON.stringify(lockPayload, null, 2) + '\n', 'utf8');
}

function releaseLock() {
  try {
    if (fs.existsSync(PIPELINE_LOCK_FILE)) {
      const payload = JSON.parse(fs.readFileSync(PIPELINE_LOCK_FILE, 'utf8'));
      if (payload && payload.pid === process.pid) {
        fs.rmSync(PIPELINE_LOCK_FILE, { force: true });
      }
    }
  } catch (_err) {
    fs.rmSync(PIPELINE_LOCK_FILE, { force: true });
  }
}

async function executeWithRetry(stepName, fn, maxRetries) {
  let attempt = 0;
  let final = null;

  while (attempt <= maxRetries) {
    attempt += 1;
    const startedAt = Date.now();

    try {
      const detail = await fn();
      final = {
        stepName,
        attempt,
        ok: true,
        durationMs: Date.now() - startedAt,
        detail,
      };
      return final;
    } catch (error) {
      final = {
        stepName,
        attempt,
        ok: false,
        durationMs: Date.now() - startedAt,
        detail: { error: error.message },
      };

      if (attempt <= maxRetries) {
        log('warn', `[${stepName}] attempt ${attempt} failed, retrying`);
      }
    }
  }

  return final;
}

async function executePipelineRun(runNumber) {
  const report = createRunContext(runNumber);
  const label = `[pipeline #${runNumber}]`;

  log('log', `${'='.repeat(72)}`);
  log('log', `${label} started at ${report.startedAtIso}`);

  let pipelineRunId = null;
  await withDbClient(async (dbClient) => {
    pipelineRunId = await createRunRow(dbClient, report.runId, report.runNumber);
  });

  const extractResult = await executeWithRetry('extract_to_db', () => extractEmailsToDb(), STEP_MAX_RETRIES);
  report.steps.push(extractResult);
  report.metrics.extracted = extractResult.ok ? extractResult.detail.extractedCount : 0;

  await withDbClient(async (dbClient) => {
    await insertRunStep(dbClient, pipelineRunId, 'extract_to_db', extractResult.ok ? 'success' : 'failed', extractResult.detail);
  });

  if (!extractResult.ok) {
    report.status = 'failed';
    report.finishedAtIso = safeIsoNow();
    await withDbClient(async (dbClient) => {
      await finalizeRunRow(dbClient, pipelineRunId, 'failed', report.metrics);
    });
    const reportPath = writeRunReport(report);
    log('error', `${label} extract step failed`);
    log('error', `${label} report: ${reportPath}`);
    return;
  }

  log(
    'log',
    `${label} entering parse stage force=${FORCE} parse_batch_limit=${PARSE_BATCH_LIMIT} parser_version=${parserConfig.version}`
  );

  const parseResult = await executeWithRetry('parse_to_db', () => parseEmailsFromDb(FORCE), STEP_MAX_RETRIES);
  report.steps.push(parseResult);
  if (parseResult.ok) {
    report.metrics.parsedOk = parseResult.detail.parsedCount;
    report.metrics.parsedError = parseResult.detail.errorCount;
  }

  await withDbClient(async (dbClient) => {
    await insertRunStep(dbClient, pipelineRunId, 'parse_to_db', parseResult.ok ? 'success' : 'failed', parseResult.detail);
  });

  report.status = parseResult.ok ? 'success' : 'failed';
  report.finishedAtIso = safeIsoNow();

  await withDbClient(async (dbClient) => {
    await finalizeRunRow(dbClient, pipelineRunId, report.status, report.metrics);
  });

  const reportPath = writeRunReport(report);
  if (report.status === 'success') {
    log('log', `${label} complete: extracted=${report.metrics.extracted} parsed_ok=${report.metrics.parsedOk} parsed_error=${report.metrics.parsedError}`);
    log('log', `${label} report: ${reportPath}`);
  } else {
    log('error', `${label} failed`);
    log('error', `${label} report: ${reportPath}`);
  }
}

async function startPipeline() {
  let runNumber = 0;
  let isRunning = false;
  let isShuttingDown = false;
  let timer = null;

  function requestShutdown(signal) {
    if (isShuttingDown) return;
    isShuttingDown = true;
    if (timer) clearInterval(timer);
    log('warn', `[pipeline] received ${signal}; shutting down`);
    if (!isRunning) {
      releaseLock();
      pool.end().catch(() => {}).finally(() => process.exit(0));
    }
  }

  async function tick() {
    if (isRunning) {
      log('warn', '[pipeline] previous run still active; skipping this tick');
      return;
    }
    if (isShuttingDown) return;

    runNumber += 1;
    isRunning = true;

    try {
      await executePipelineRun(runNumber);
    } catch (err) {
      log('error', `[pipeline #${runNumber}] unexpected error: ${err.message}`);
    } finally {
      isRunning = false;
      if (isShuttingDown) {
        releaseLock();
        await pool.end().catch(() => {});
        process.exit(0);
      }
    }
  }

  process.on('SIGINT', () => requestShutdown('SIGINT'));
  process.on('SIGTERM', () => requestShutdown('SIGTERM'));
  process.on('exit', () => releaseLock());

  acquireLockOrExit();

  if (RUN_ONCE) {
    await tick();
    return;
  }

  log('log', `[pipeline] polling every ${Math.floor(POLL_INTERVAL_MS / 1000)}s`);
  await tick();
  timer = setInterval(() => {
    tick().catch((err) => {
      log('error', `[pipeline] tick failed: ${err.message}`);
    });
  }, POLL_INTERVAL_MS);
}

module.exports = {
  startPipeline,
};