'use strict';

const pipelineService = require('../services/pipeline-service');

async function listRuns(req, res, next) {
  try {
    const runs = await pipelineService.listRuns(req.query);
    res.json({ items: runs });
  } catch (error) {
    next(error);
  }
}

async function getRunById(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'BAD_REQUEST', message: 'Invalid run id' });
    }

    const run = await pipelineService.getRunWithSteps(id);
    if (!run) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'Pipeline run not found' });
    }

    return res.json(run);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listRuns,
  getRunById,
};
