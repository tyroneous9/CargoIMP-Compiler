'use strict';

const paths = require('./paths');

require('dotenv').config({ path: paths.ENV_FILE });

function readEnv(name) {
  return process.env[name];
}

function requireEnv(name) {
  const value = readEnv(name);
  if (value === undefined || value === null || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value.trim();
}

module.exports = {
  readEnv,
  requireEnv,
};
