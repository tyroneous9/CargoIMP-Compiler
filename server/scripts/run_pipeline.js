#!/usr/bin/env node
'use strict';

/**
 * pipeline orchestrator for NCAParser.
 *
 * - Structured JSON report per run in server/data/logs/pipeline-runs/
 * - Polling mode and one-shot mode
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const {
  LOGS_DIR,
  EMAILS_DIR,
  PARSED_EMAILS_DIR,
  PARSED_TABLES_DIR,
  DATA_DIR,
  INDEX_FILE,
} = require('../config/paths');

const SCRIPTS_DIR = __dirname;
const PIPELINE_RUNS_DIR = path.join(LOGS_DIR, 'pipeline-runs');
const PIPELINE_LOCK_FILE = path.join(LOGS_DIR, 'pipeline.lock.json');
const STDERR_SUMMARY_FILE = path.join(DATA_DIR, 'stderr-summary.ndjson');

const POLL_INTERVAL_MS  = 600_000;   // 10 minutes
const SCRIPT_TIMEOUT_MS = 300_000;   // 5 minutes per step
const STEP_MAX_RETRIES  = 1;

const RUN_ONCE = process.argv.includes('--once');
const REBUILD = process.argv.includes('--REBUILD') || process.argv.includes('--rebuild');
const FORCE = process.argv.includes('--force') || REBUILD;

fs.mkdirSync(LOGS_DIR, { recursive: true });
fs.mkdirSync(PIPELINE_RUNS_DIR, { recursive: true });

function todayLogPath() {
  const date = new Date().toISOString().slice(0, 10);
  return path.join(LOGS_DIR, `${date}.log`);
}

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
    return;
  }
  log('log', `[rebuild] skipped missing ${label}: ${targetPath}`);
}

function prepareRebuild() {
  log('warn', '[rebuild] REBUILD mode enabled; clearing cached extraction, parse, and table outputs');
  clearPath(EMAILS_DIR, 'emails output directory');
  clearPath(PARSED_EMAILS_DIR, 'parsed emails output directory');
  clearPath(PARSED_TABLES_DIR, 'parsed tables output directory');
  clearPath(INDEX_FILE, 'email index file');
  clearPath(STDERR_SUMMARY_FILE, 'stderr summary file');
}

function countSignals(stdout, marker) {
  return (stdout.match(new RegExp(`^${marker}`, 'gm')) || []).length;
}

function safeIsoNow() {
  return new Date().toISOString();
}

function runScriptStep(scriptName, args = []) {
  const scriptPath = path.join(SCRIPTS_DIR, scriptName);
  const label = `[${scriptName}]`;

  log('log', `${label} starting`);

  const result = spawnSync(process.execPath, [scriptPath, ...args], {
    stdio: ['ignore', 'pipe', 'pipe'],
    encoding: 'utf8',
    timeout: SCRIPT_TIMEOUT_MS,
    killSignal: 'SIGTERM',
  });

  if (result.error) {
    if (result.error.code === 'ETIMEDOUT') {
      log('error', `${label} timed out after ${SCRIPT_TIMEOUT_MS}ms`);
      return {
        ok: false,
        exitCode: 1,
        stdout: '',
        stderr: `timeout after ${SCRIPT_TIMEOUT_MS}ms`,
      };
    }

    return {
      ok: false,
      exitCode: 1,
      stdout: '',
      stderr: `spawn failed: ${result.error.message}`,
    };
  }

  const stdout = result.stdout || '';
  const stderr = (result.stderr || '').trim();

  if (stdout) {
    for (const line of stdout.split('\n')) {
      if (line) log('log', `${label} ${line}`);
    }
  }

  if (stderr) {
    process.stderr.write(stderr + '\n');
    fs.appendFileSync(todayLogPath(), stderr + '\n', 'utf8');
  }

  const exitCode = result.status ?? 1;
  const ok = exitCode === 0;

  if (ok) {
    log('log', `${label} done`);
  } else {
    log('error', `${label} exited with code ${exitCode}`);
  }

  return { ok, exitCode, stdout, stderr };
}

function executeWithRetry(stepName, executeFn, maxRetries) {
  let attempt = 0;
  let finalResult = null;

  while (attempt <= maxRetries) {
    attempt += 1;
    const startedAt = Date.now();
    const result = executeFn();
    const durationMs = Date.now() - startedAt;

    finalResult = {
      stepName,
      attempt,
      ok: result.ok,
      exitCode: result.exitCode,
      durationMs,
      stdout: result.stdout,
      stderr: result.stderr,
    };

    if (result.ok) return finalResult;

    if (attempt <= maxRetries) {
      log('warn', `[${stepName}] failed attempt ${attempt}; retrying (${attempt}/${maxRetries + 1})`);
    }
  }

  return finalResult;
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
    rebuild: REBUILD,
    steps: [],
    metrics: {
      newEmails: 0,
      newParsed: 0,
      downstreamExecuted: false,
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

function stepDescriptor(name, scriptName, args) {
  return {
    name,
    scriptName,
    args,
    retries: STEP_MAX_RETRIES,
  };
}

function executePipelineRun(runNumber) {
  const report = createRunContext(runNumber);
  const label = `[pipeline #${runNumber}]`;

  log('log', `${'='.repeat(72)}`);
  log('log', `${label} started at ${report.startedAtIso}`);

  const extractStep = stepDescriptor('extract_emails', 'extract_emails.js', []);
  const extractResult = executeWithRetry(
    extractStep.name,
    () => runScriptStep(extractStep.scriptName, extractStep.args),
    extractStep.retries
  );
  report.steps.push(extractResult);

  if (extractResult.ok) {
    report.metrics.newEmails = countSignals(extractResult.stdout, 'Extracted:');
    log('log', `${label} new emails extracted: ${report.metrics.newEmails}`);
  } else {
    log('warn', `${label} extract failed; continuing to parse existing extracted files`);
  }

  const parseArgs = FORCE ? ['--force'] : [];
  const parseStep = stepDescriptor('parse_extracted_emails', 'parse_extracted_emails.js', parseArgs);
  const parseResult = executeWithRetry(
    parseStep.name,
    () => runScriptStep(parseStep.scriptName, parseStep.args),
    parseStep.retries
  );
  report.steps.push(parseResult);

  if (!parseResult.ok) {
    report.status = 'failed';
    report.finishedAtIso = safeIsoNow();
    const reportPath = writeRunReport(report);
    log('error', `${label} aborted: parse_extracted_emails failed`);
    log('error', `${label} report: ${reportPath}`);
    return;
  }

  report.metrics.newParsed = countSignals(parseResult.stdout, 'Parsed:');
  log('log', `${label} new emails parsed: ${report.metrics.newParsed}`);

  const shouldRunDownstream = FORCE || report.metrics.newEmails > 0 || report.metrics.newParsed > 0;

  if (!shouldRunDownstream) {
    report.status = 'success';
    report.finishedAtIso = safeIsoNow();
    const reportPath = writeRunReport(report);
    log('log', `${label} no new data; skipping build/upload steps`);
    log('log', `${label} report: ${reportPath}`);
    return;
  }

  if (FORCE && report.metrics.newEmails === 0 && report.metrics.newParsed === 0) {
    log('log', `${label} force mode enabled; running downstream steps`);
  }

  report.metrics.downstreamExecuted = true;

  const downstreamSteps = [
    stepDescriptor('build_mawb_csv', 'build_cfs_csv_mawb.js', []),
    stepDescriptor('build_uld_csv', 'build_cfs_csv_uld.js', []),
    stepDescriptor('build_hawb_csv', 'build_cfs_csv_hawb.js', []),
    stepDescriptor('upload_tables_to_sheets', 'upload_tables_to_sheets.js', []),
  ];

  for (const step of downstreamSteps) {
    const result = executeWithRetry(
      step.name,
      () => runScriptStep(step.scriptName, step.args),
      step.retries
    );

    report.steps.push(result);

    if (!result.ok) {
      report.status = 'failed';
      report.finishedAtIso = safeIsoNow();
      const reportPath = writeRunReport(report);
      log('error', `${label} failed at step ${step.name}`);
      log('error', `${label} report: ${reportPath}`);
      return;
    }
  }

  report.status = 'success';
  report.finishedAtIso = safeIsoNow();
  const reportPath = writeRunReport(report);
  log('log', `${label} complete`);
  log('log', `${label} report: ${reportPath}`);
}

let runNumber = 0;
let isRunning = false;
let isShuttingDown = false;
let timer = null;

function tick() {
  if (isRunning) {
    log('warn', '[pipeline] previous run still active; skipping this tick');
    return;
  }
  if (isShuttingDown) return;

  runNumber += 1;
  isRunning = true;

  try {
    executePipelineRun(runNumber);
  } catch (err) {
    log('error', `[pipeline #${runNumber}] unexpected error: ${err.message}`);
  } finally {
    isRunning = false;
    if (isShuttingDown) {
      releaseLock();
      process.exit(0);
    }
  }
}

function requestShutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;
  if (timer) clearInterval(timer);
  log('warn', `[pipeline] received ${signal}; shutting down`);
  if (!isRunning) {
    releaseLock();
    process.exit(0);
  }
}

process.on('SIGINT', () => requestShutdown('SIGINT'));
process.on('SIGTERM', () => requestShutdown('SIGTERM'));
process.on('exit', () => releaseLock());

acquireLockOrExit();

if (REBUILD) {
  prepareRebuild();
}

if (RUN_ONCE) {
  tick();
} else {
  log('log', `[pipeline] polling every ${Math.floor(POLL_INTERVAL_MS / 1000)}s`);
  tick();
  timer = setInterval(tick, POLL_INTERVAL_MS);
}
