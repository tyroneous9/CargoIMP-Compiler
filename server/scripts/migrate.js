'use strict';

const path = require('path');
const { runner } = require('node-pg-migrate');
const paths = require('../config/paths');

require('dotenv').config({ path: paths.ENV_FILE });

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function toDatabaseUrl() {
  const user = encodeURIComponent(requireEnv('DB_USER'));
  const password = encodeURIComponent(requireEnv('DB_PASSWORD'));
  const host = process.env.DB_HOST || '127.0.0.1';
  const port = process.env.DB_PORT || '5432';
  const database = process.env.DB_NAME || 'nca_cargo';
  return `postgres://${user}:${password}@${host}:${port}/${database}`;
}

function parseDirection(value) {
  if (value === 'up' || value === 'down') {
    return value;
  }
  throw new Error('Usage: node scripts/migrate.js <up|down> [count]');
}

function parseCount(value) {
  if (value === undefined) {
    return Infinity;
  }

  const count = Number(value);
  if (!Number.isInteger(count) || count <= 0) {
    throw new Error('count must be a positive integer when provided');
  }
  return count;
}

async function main() {
  const direction = parseDirection(process.argv[2]);
  const count = parseCount(process.argv[3]);

  await runner({
    databaseUrl: toDatabaseUrl(),
    dir: path.join(__dirname, '..', 'migrations'),
    direction,
    count,
    migrationsTable: 'schema_migrations',
    checkOrder: true,
    verbose: true,
    decamelize: false,
  });

  process.stdout.write(`Migrations completed: ${direction}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
});
