'use strict';

const pipelineRepository = require('../repositories/pipeline-repository');

function toPositiveInt(value, fallback) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) return fallback;
  return parsed;
}

async function listRuns(query) {
  const limit = Math.min(toPositiveInt(query.limit, 25), 200);
  const offset = toPositiveInt(query.offset, 0);
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
