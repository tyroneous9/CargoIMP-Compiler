'use strict';

const DEFAULT_PIPELINE_CONFIG = Object.freeze({
  pollIntervalMs: 300000,
  stepMaxRetries: 1,
  parseBatchLimit: 2000,
  extractEmailLimit: 100,
});

function getPipelineConfig() {
  return {
    pollIntervalMs: DEFAULT_PIPELINE_CONFIG.pollIntervalMs,
    stepMaxRetries: DEFAULT_PIPELINE_CONFIG.stepMaxRetries,
    parseBatchLimit: DEFAULT_PIPELINE_CONFIG.parseBatchLimit,
  };
}

function getExtractEmailLimit() {
  return DEFAULT_PIPELINE_CONFIG.extractEmailLimit;
}

module.exports = {
  DEFAULT_PIPELINE_CONFIG,
  getPipelineConfig,
  getExtractEmailLimit,
};
