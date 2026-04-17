'use strict';

/**
 * Shared logger for NCAParser pipeline scripts.
 *
 * Writes timestamped, leveled lines to stderr.
 *   - When run as a pipeline step via run_pipeline.js, stderr is captured
 *     and persisted to the daily log file by the pipeline orchestrator.
 *   - When run standalone, output goes directly to the terminal.
 *
 * Usage:
 *   const { log } = require('../config/logger');
 *   log('log',   'Processing 42 files…');
 *   log('warn',  'No FFM data found for MAWB 123-45678901');
 *   log('error', 'Parser binary not found: /cpp/build/parser_ffm_json');
 */

function log(level, text) {
  const ts = new Date().toISOString();
  process.stderr.write(`${ts} [${level.toUpperCase()}] ${text}\n`);
}

module.exports = { log };
