'use strict';

const { Pool } = require('pg');
const paths = require('./paths');

require('dotenv').config({ path: paths.ENV_FILE });

const DB_HOST = '127.0.0.1';
const DB_PORT = 5432;
const DB_NAME = 'nca_cargo';
const DB_POOL_MAX = 10;
const DB_IDLE_TIMEOUT_MS = 30000;
const DB_SSL = false;

function requireEnv(name) {
  const value = process.env[name];
  if (value === undefined || value === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function buildPoolConfig() {
  const sslEnabled = DB_SSL;

  return {
    host: DB_HOST,
    port: DB_PORT,
    user: requireEnv('DB_USER'),
    password: requireEnv('DB_PASSWORD'),
    database: DB_NAME,
    max: DB_POOL_MAX,
    idleTimeoutMillis: DB_IDLE_TIMEOUT_MS,
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
