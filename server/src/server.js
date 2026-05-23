'use strict';

const app = require('./app');
const { pool } = require('../config/db');

const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || '0.0.0.0';

const server = app.listen(port, host, () => {
  process.stdout.write(`Backend listening on ${host}:${port}\n`);
});

async function shutdown(signal) {
  process.stdout.write(`Received ${signal}; shutting down backend...\n`);
  server.close(async () => {
    try {
      await pool.end();
    } catch (error) {
      process.stderr.write(`Error while closing DB pool: ${error.message}\n`);
    } finally {
      process.exit(0);
    }
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
