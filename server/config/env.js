'use strict';
const paths = require('./paths');
require('dotenv').config({ path: paths.ENV_FILE });

function requireVar(key) {
  const v = (process.env[key] || '').trim();
  if (!v) throw new Error(`Missing required env var: ${key}`);
  return v;
}

/**
 * Secrets loaded from .env.
 * Only credentials belong here; all other config lives in dedicated modules.
 */
const imap = {
  get user() { return requireVar('ALIMAIL_NCA_USER'); },
  get pass() { return requireVar('ALIMAIL_NCA_PASS'); },
};

const db = {
  user:     process.env.DB_USER     || null,
  password: process.env.DB_PASSWORD || null,
};

module.exports = { imap, db };

