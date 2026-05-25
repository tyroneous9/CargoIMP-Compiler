'use strict';
const { imap: credentials } = require('./env');

module.exports = {
  // ── Connection settings ───────────────────────────────────────────────────
  host:    'imap.mxhichina.com',
  port:    993,
  mailbox: 'INBOX',

  // ── Credentials (from .env) ───────────────────────────────────────────────
  get user() { return credentials.user; },
  get pass() { return credentials.pass; },

  // ── Extraction settings ───────────────────────────────────────────────────
  // Maximum emails to extract per pipeline run; -1 = unlimited.
  extractLimit: 200,
};
