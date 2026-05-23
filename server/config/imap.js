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

function getImapConfig() {
  return {
    host: DEFAULT_IMAP_CONFIG.host,
    port: DEFAULT_IMAP_CONFIG.port,
    mailbox: DEFAULT_IMAP_CONFIG.mailbox,
    user: requireSecretEnv('ALIMAIL_NCA_USER'),
    pass: requireSecretEnv('ALIMAIL_NCA_PASS'),
  };
}

module.exports = {
  DEFAULT_IMAP_CONFIG,
  getImapConfig,
};
