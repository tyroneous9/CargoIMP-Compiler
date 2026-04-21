#!/usr/bin/env node
/**
 * run_pipeline.js
 *
 * Full polling pipeline:
 *   1. extract_emails.js         — fetch new emails from IMAP
 *   2. parse_extracted_emails.js — run C++ parsers on new email files
 *   3. build_cfs_csv_mawb.js     — rebuild MAWB CSV from all parsed data
 *   4. build_cfs_csv_uld.js      — rebuild ULD CSV from all parsed data
 *   5. build_cfs_csv_hawb.js     — rebuild HAWB CSV from all parsed data
 *   6. upload_tables_to_sheets.js — push all CSVs to Google Sheets
 *
 * Steps 3–6 are skipped when steps 1–2 produced no new output, avoiding
 * unnecessary Sheets API calls and rate-limit consumption.
 *
 * Usage:
 *   node scripts/run_pipeline.js          # run once immediately, then poll
 *   node scripts/run_pipeline.js --once   # run exactly once and exit
 *   node scripts/run_pipeline.js --force  # run steps 3–6 even with no new data
 *   node scripts/run_pipeline.js --REBUILD # clear cached outputs then run from fresh extraction/parsing
 *   node scripts/run_pipeline.js --once --force  # single run with forced rebuild
 *   node scripts/run_pipeline.js --once --REBUILD --force  # clear cache + full single-shot rebuild
 *
 * Interval is controlled by EMAIL_POLL_INTERVAL_MS in .env.
 */

'use strict';

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const {
  ENV_FILE,
  LOGS_DIR,
  EMAILS_DIR,
  PARSED_EMAILS_DIR,
  PARSED_TABLES_DIR,
  DATA_DIR,
  INDEX_FILE,
} = require('../config/paths');

require('dotenv').config({ path: ENV_FILE });

const SCRIPTS_DIR = __dirname;
const POLL_INTERVAL_MS = parseInt(process.env.EMAIL_POLL_INTERVAL_MS, 10) || 600_000;
const SCRIPT_TIMEOUT_MS = parseInt(process.env.PIPELINE_SCRIPT_TIMEOUT_MS, 10) || 300_000;
const RUN_ONCE = process.argv.includes('--once');
const REBUILD = process.argv.includes('--REBUILD') || process.argv.includes('--rebuild');
const FORCE = process.argv.includes('--force') || REBUILD;
const STDERR_SUMMARY_FILE = path.join(DATA_DIR, 'stderr-summary.ndjson');

// ── Logger ────────────────────────────────────────────────────────────────────

fs.mkdirSync(LOGS_DIR, { recursive: true });

/**
 * Returns a path like server/data/logs/2026-04-17.log (UTC date).
 * As midnight rolls over the pipeline naturally rotates to a new file.
 */
function todayLogPath() {
  const date = new Date().toISOString().slice(0, 10);  // YYYY-MM-DD
  return path.join(LOGS_DIR, `${date}.log`);
}

/**
 * Write a line to the current daily log file AND to stderr.
 * @param {'log'|'warn'|'error'} level
 * @param {string} text
 */
function log(level, text) {
  const ts = new Date().toISOString();
  const line = `${ts} [${level.toUpperCase()}] ${text}`;
  process.stderr.write(line + '\n');
  fs.appendFileSync(todayLogPath(), line + '\n', 'utf8');
}

function clearPath(targetPath, label) {
  if (fs.existsSync(targetPath)) {
    fs.rmSync(targetPath, { recursive: true, force: true });
    log('warn', `[rebuild] cleared ${label}: ${targetPath}`);
  } else {
    log('log', `[rebuild] skipped missing ${label}: ${targetPath}`);
  }
}

function prepareRebuild() {
  log('warn', '[rebuild] REBUILD mode enabled; clearing cached extraction, parse, and table outputs');
  clearPath(EMAILS_DIR, 'emails output directory');
  clearPath(PARSED_EMAILS_DIR, 'parsed emails output directory');
  clearPath(PARSED_TABLES_DIR, 'parsed tables output directory');
  clearPath(INDEX_FILE, 'email index file');
  clearPath(STDERR_SUMMARY_FILE, 'stderr summary file');
}

// ── Step runner ───────────────────────────────────────────────────────────────

/**
 * Run a script as a child process, capturing both stdout and stderr.
 * stdout is returned for signal counting (Extracted:/Parsed: lines).
 * stderr is the script's own diagnostic log — written to the log file and
 * forwarded to our stderr so it appears in the terminal.
 * Throws on spawn failure (e.g. file not found).
 */
function runScript(scriptName, args = []) {
  const scriptPath = path.join(SCRIPTS_DIR, scriptName);
  const label = `[${scriptName}]`;

  log('log', `${label} starting…`);

  const result = spawnSync(process.execPath, [scriptPath, ...args], {
    stdio: ['ignore', 'pipe', 'pipe'],  // capture both stdout and stderr
    encoding: 'utf8',
    timeout: SCRIPT_TIMEOUT_MS,
    killSignal: 'SIGTERM',
  });

  if (result.error) {
    // Timeout should not crash the whole poller process.
    if (result.error.code === 'ETIMEDOUT') {
      log('error', `${label} timed out after ${SCRIPT_TIMEOUT_MS}ms`);
      return { exitCode: 1, stdout: '' };
    }
    throw new Error(`${label} failed to spawn: ${result.error.message}`);
  }

  const stdout = result.stdout || '';
  const stderr = (result.stderr || '').trim();

  // Echo stdout signals (Extracted:/Parsed: lines) to our stderr and log file
  if (stdout) {
    for (const line of stdout.split('\n')) {
      if (line) log('log', `${label} ${line}`);
    }
  }

  // Child scripts use logger.js which writes pre-formatted timestamped lines to
  // stderr. Append them directly to the log file and forward to our stderr.
  if (stderr) {
    process.stderr.write(stderr + '\n');
    fs.appendFileSync(todayLogPath(), stderr + '\n', 'utf8');
  }

  if (result.status !== 0) {
    log('error', `${label} exited with code ${result.status}`);
  } else {
    log('log', `${label} done`);
  }

  return { exitCode: result.status ?? 1, stdout };
}

// ── New-data detection ────────────────────────────────────────────────────────

/**
 * Count lines in stdout that start with "Extracted:" or "Parsed:" —
 * these are emitted by extract_emails.js and parse_extracted_emails.js
 * respectively for each new file written.
 */
function countNewFiles(stdout, marker) {
  return (stdout.match(new RegExp(`^${marker}`, 'gm')) || []).length;
}

// ── Single pipeline run ───────────────────────────────────────────────────────

function runPipeline(runNumber) {
  const label = `[pipeline #${runNumber}]`;
  log('log', `${'─'.repeat(60)}`);
  log('log', `${label} ${new Date().toISOString()}`);

  // ── Step 1: extract emails ─────────────────────────────────────────────────
  const { exitCode: exitExtract, stdout: stdoutExtract } =
    runScript('extract_emails.js');

  let newEmails = 0;
  if (exitExtract !== 0) {
    // IMAP connectivity can fail transiently (e.g. DNS EAI_AGAIN); keep pipeline alive.
    log('warn', `${label} extract_emails failed; continuing to parse existing extracted files`);
  } else {
    newEmails = countNewFiles(stdoutExtract, 'Extracted:');
    log('log', `${label} new emails extracted: ${newEmails}`);
  }

  // ── Step 2: parse new emails ───────────────────────────────────────────────
  const { exitCode: exitParse, stdout: stdoutParse } =
    runScript('parse_extracted_emails.js', FORCE ? ['--force'] : []);

  if (exitParse !== 0) {
    log('error', `${label} aborting: parse_extracted_emails failed`);
    return;
  }

  const newParsed = countNewFiles(stdoutParse, 'Parsed:');
  log('log', `${label} new emails parsed: ${newParsed}`);

  // ── Skip downstream steps if nothing changed (unless --force is set) ──────
  if (newEmails === 0 && newParsed === 0 && !FORCE) {
    log('log', `${label} no new data — skipping CSV rebuild and Sheets upload`);
    return;
  }

  if (FORCE && newEmails === 0 && newParsed === 0) {
    log('log', `${label} --force flag set; forcing CSV rebuild and Sheets upload`);
  }

  // ── Step 3: rebuild MAWB CSV ───────────────────────────────────────────────
  const { exitCode: exitMawb } = runScript('build_cfs_csv_mawb.js');
  if (exitMawb !== 0) {
    log('error', `${label} aborting: build_cfs_csv_mawb failed`);
    return;
  }

  // ── Step 4: rebuild ULD CSV ────────────────────────────────────────────────
  const { exitCode: exitUld } = runScript('build_cfs_csv_uld.js');
  if (exitUld !== 0) {
    log('error', `${label} aborting: build_cfs_csv_uld failed`);
    return;
  }

  // ── Step 5: rebuild HAWB CSV ───────────────────────────────────────────────
  const { exitCode: exitHawb } = runScript('build_cfs_csv_hawb.js');
  if (exitHawb !== 0) {
    log('error', `${label} aborting: build_cfs_csv_hawb failed`);
    return;
  }

  // ── Step 6: upload to Google Sheets ───────────────────────────────────────
  const { exitCode: exitUpload } = runScript('upload_tables_to_sheets.js');
  if (exitUpload !== 0) {
    log('error', `${label} upload_tables_to_sheets failed (CSVs are still up to date locally)`);
    return;
  }

  log('log', `${label} pipeline complete`);
}

// ── Polling loop ──────────────────────────────────────────────────────────────

let runNumber = 0;
let isRunning = false;
let isShuttingDown = false;
let pollTimer = null;

async function tick() {
  if (isRunning) {
    log('warn', '[pipeline] previous run is still active; skipping this tick');
    return;
  }
  if (isShuttingDown) return;

  runNumber++;
  isRunning = true;
  try {
    runPipeline(runNumber);
  } catch (err) {
    log('error', `[pipeline #${runNumber}] unexpected error: ${err.message}`);
  } finally {
    isRunning = false;
    if (isShuttingDown) process.exit(0);
  }
}

function requestShutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;
  if (pollTimer) clearInterval(pollTimer);
  log('warn', `Received ${signal}; shutting down pipeline...`);
  if (!isRunning) process.exit(0);
}

process.on('SIGINT', () => requestShutdown('SIGINT'));
process.on('SIGTERM', () => requestShutdown('SIGTERM'));

if (RUN_ONCE) {
  if (REBUILD) prepareRebuild();
  tick();
} else {
  log('log', `Pipeline polling every ${POLL_INTERVAL_MS / 1000}s. Press Ctrl+C to stop.`);
  if (REBUILD) prepareRebuild();
  tick();  // run immediately on start
  pollTimer = setInterval(tick, POLL_INTERVAL_MS);
}
