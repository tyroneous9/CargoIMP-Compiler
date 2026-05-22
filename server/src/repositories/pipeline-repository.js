'use strict';

const { pool } = require('../../config/db');

async function listPipelineRuns(limit, offset) {
  const result = await pool.query(
    `
      SELECT id, run_id, run_number, status, started_at, finished_at, force_run, metrics_json
      FROM pipeline_runs
      ORDER BY started_at DESC
      LIMIT $1 OFFSET $2
    `,
    [limit, offset]
  );
  return result.rows;
}

async function getPipelineRunById(id) {
  const result = await pool.query(
    `
      SELECT id, run_id, run_number, status, started_at, finished_at, force_run, metrics_json
      FROM pipeline_runs
      WHERE id = $1
    `,
    [id]
  );
  return result.rows[0] || null;
}

async function listPipelineRunSteps(runId) {
  const result = await pool.query(
    `
      SELECT id, step_name, status, detail_json, started_at, finished_at
      FROM pipeline_run_steps
      WHERE pipeline_run_id = $1
      ORDER BY id ASC
    `,
    [runId]
  );
  return result.rows;
}

module.exports = {
  listPipelineRuns,
  getPipelineRunById,
  listPipelineRunSteps,
};
