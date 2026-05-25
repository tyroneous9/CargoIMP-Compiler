'use strict';

const { requireEnv } = require('./env');

const DEFAULT_IMAP_CONFIG = Object.freeze({
  host: 'imap.qiye.aliyun.com',
  port: 993,
  mailbox: 'INBOX',
});

function getImapConfig() {
  return {
    host: DEFAULT_IMAP_CONFIG.host,
    port: DEFAULT_IMAP_CONFIG.port,
    mailbox: DEFAULT_IMAP_CONFIG.mailbox,
    user: requireEnv('ALIMAIL_NCA_USER'),
    pass: requireEnv('ALIMAIL_NCA_PASS'),
  };
}

module.exports = {
  DEFAULT_IMAP_CONFIG,
  getImapConfig,
};
