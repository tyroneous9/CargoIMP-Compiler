'use strict';

const { Client } = require('pg');
const { buildPoolConfig } = require('../config/db');

const BASELINE_MIGRATION = '1714000000000_initial_schema';

function toClientConfig() {
  const config = buildPoolConfig();
  return {
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
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
