'use strict';

const DEFAULT_PIPELINE_CONFIG = Object.freeze({
  pollIntervalMs: 300000,
  stepMaxRetries: 1,
  parseBatchLimit: 2000,
  extractEmailLimit: 100,
});

function parsePositiveIntEnv(key, fallback) {
  const raw = process.env[key];
  if (!raw || raw.trim() === '') return fallback;

  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Invalid ${key}: expected a positive integer`);
  }
  return parsed;
}

function parsePositiveIntOrUnlimitedEnv(key, fallback) {
  const raw = process.env[key];
  if (!raw || raw.trim() === '') return fallback;

  const parsed = Number(raw);
  if (parsed === -1) return -1;
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Invalid ${key}: expected a positive integer or -1`);
  }
  return parsed;
}

function getPipelineConfig() {
  return {
    pollIntervalMs: parsePositiveIntEnv('EMAIL_POLL_INTERVAL_MS', DEFAULT_PIPELINE_CONFIG.pollIntervalMs),
    stepMaxRetries: parsePositiveIntEnv('PIPELINE_STEP_MAX_RETRIES', DEFAULT_PIPELINE_CONFIG.stepMaxRetries),
    parseBatchLimit: parsePositiveIntEnv('PARSE_BATCH_LIMIT', DEFAULT_PIPELINE_CONFIG.parseBatchLimit),
  };
}

function getExtractEmailLimit() {
  return parsePositiveIntOrUnlimitedEnv('EXTRACT_EMAIL_LIMIT', DEFAULT_PIPELINE_CONFIG.extractEmailLimit);
}

module.exports = {
  DEFAULT_PIPELINE_CONFIG,
  getPipelineConfig,
  getExtractEmailLimit,
};
