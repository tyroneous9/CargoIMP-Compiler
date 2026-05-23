'use strict';

const pipelineRepository = require('../repositories/pipeline-repository');

function toPositiveInt(value, label) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    const error = new Error(`${label} must be a positive integer`);
    error.statusCode = 400;
    throw error;
  }
  return parsed;
}

async function listRuns(query) {
  const limit = Math.min(toPositiveInt(query.limit, 'limit'), 200);
  const offset = Number(query.offset);
  if (!Number.isInteger(offset) || offset < 0) {
    const error = new Error('offset must be a non-negative integer');
    error.statusCode = 400;
    throw error;
  }
  return pipelineRepository.listPipelineRuns(limit, offset);
}

async function getRunWithSteps(id) {
  const run = await pipelineRepository.getPipelineRunById(id);
  if (!run) return null;
  const steps = await pipelineRepository.listPipelineRunSteps(id);
  return { ...run, steps };
}

module.exports = {
  listRuns,
  getRunWithSteps,
};
