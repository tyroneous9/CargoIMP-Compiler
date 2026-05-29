'use strict';

const { requireEnv } = require('./env');

const DEFAULT_IMAP_CONFIG = Object.freeze({
  host: 'imap.qiye.aliyun.com',
  port: 993,
  mailbox: 'INBOX',
  sentMailbox: 'Sent',
});

function getImapConfig() {
  const sentMailbox = String(process.env.ALIMAIL_NCA_SENT_MAILBOX || DEFAULT_IMAP_CONFIG.sentMailbox).trim();

  return {
    host: DEFAULT_IMAP_CONFIG.host,
    port: DEFAULT_IMAP_CONFIG.port,
    mailbox: DEFAULT_IMAP_CONFIG.mailbox,
    sentMailbox: sentMailbox || DEFAULT_IMAP_CONFIG.sentMailbox,
    user: requireEnv('ALIMAIL_NCA_USER'),
    pass: requireEnv('ALIMAIL_NCA_PASS'),
  };
}

module.exports = {
  DEFAULT_IMAP_CONFIG,
  getImapConfig,
};
