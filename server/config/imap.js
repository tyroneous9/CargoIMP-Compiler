'use strict';

const DEFAULT_IMAP_CONFIG = Object.freeze({
  host: 'imap.qiye.aliyun.com',
  port: 993,
  mailbox: 'INBOX',
});

function requireSecretEnv(key) {
  const value = process.env[key];
  if (!value || value.trim() === '') {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value.trim();
}

function parsePort(raw, fallback) {
  if (!raw || raw.trim() === '') return fallback;
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error('Invalid ALIMAIL_NCA_PORT: expected a positive integer');
  }
  return parsed;
}

function getImapConfig() {
  return {
    host: (process.env.ALIMAIL_NCA_HOST || DEFAULT_IMAP_CONFIG.host).trim(),
    port: parsePort(process.env.ALIMAIL_NCA_PORT, DEFAULT_IMAP_CONFIG.port),
    mailbox: (process.env.ALIMAIL_NCA_MAILBOX || DEFAULT_IMAP_CONFIG.mailbox).trim(),
    user: requireSecretEnv('ALIMAIL_NCA_USER'),
    pass: requireSecretEnv('ALIMAIL_NCA_PASS'),
  };
}

module.exports = {
  DEFAULT_IMAP_CONFIG,
  getImapConfig,
};
