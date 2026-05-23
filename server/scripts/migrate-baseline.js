'use strict';

const { Client } = require('pg');
const paths = require('../config/paths');

require('dotenv').config({ path: paths.ENV_FILE });

const BASELINE_MIGRATION = '1714000000000_initial_schema';

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function toClientConfig() {
  return {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || '5432'),
    user: requireEnv('DB_USER'),
    password: requireEnv('DB_PASSWORD'),
    database: process.env.DB_NAME || 'nca_cargo',
  };
}

async function main() {
  const client = new Client(toClientConfig());
  await client.connect();

  try {
    await client.query(
      `
        CREATE TABLE IF NOT EXISTS schema_migrations (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL UNIQUE,
          run_on TIMESTAMP NOT NULL
        )
      `
    );

    await client.query(
      `
        INSERT INTO schema_migrations (name, run_on)
        SELECT $1::varchar, NOW()
        WHERE NOT EXISTS (
          SELECT 1
          FROM schema_migrations
          WHERE name = $1::varchar
        )
      `,
      [BASELINE_MIGRATION]
    );

    process.stdout.write(`Baseline marked: ${BASELINE_MIGRATION}\n`);
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
});
