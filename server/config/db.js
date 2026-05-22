'use strict';

const { Pool } = require('pg');
const paths = require('./paths');

require('dotenv').config({ path: paths.ENV_FILE });

function buildPoolConfig() {
  const sslEnabled = process.env.DB_SSL === 'true';

  return {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    max: Number(process.env.DB_POOL_MAX),
    idleTimeoutMillis: Number(process.env.DB_IDLE_TIMEOUT_MS),
    ssl: sslEnabled ? { rejectUnauthorized: false } : undefined,
  };
}

const pool = new Pool(buildPoolConfig());

async function withDbClient(handler) {
  const client = await pool.connect();
  try {
    return await handler(client);
  } finally {
    client.release();
  }
}

module.exports = {
  pool,
  withDbClient,
};
