// testing: npm run test:imap

const path = require('path');
const { ImapFlow } = require('imapflow');
const { simpleParser } = require('mailparser');
const imapConfig = require('../config/imap');

async function main() {
  const host = imapConfig.host;
  const user = imapConfig.user;
  const pass = imapConfig.pass;
  const port = imapConfig.port;
  const mailbox = imapConfig.mailbox;

  if (!Number.isFinite(port) || port <= 0) {
    throw new Error('ALIMAIL_NCA_PORT must be a positive number');
  }

  const client = new ImapFlow({
    host,
    port,
    secure: true,
    auth: { user, pass },
    logger: false,
  });

  try {
    console.log('Connecting to IMAP server...');
    await client.connect();
    console.log('Connected.');

    const mailboxLock = await client.getMailboxLock(mailbox);
    try {
      const allUids = await client.search({ all: true }, { uid: true });
      if (!allUids || allUids.length === 0) {
        console.log(`Mailbox ${mailbox} is empty.`);
        return;
      }

      const latestUid = Math.max(...allUids);
      const message = await client.fetchOne(
        latestUid,
        {
          uid: true,
          envelope: true,
          internalDate: true,
          source: true,
        },
        { uid: true }
      );

      const parsed = await simpleParser(message.source);
      const plainText = (parsed.text || '').replace(/\r\n/g, '\n').trim();

      console.log('--- Latest Email ---');
      console.log(`Mailbox: ${mailbox}`);
      console.log(`UID: ${message.uid}`);
      console.log(`Date: ${message.internalDate ? message.internalDate.toISOString() : 'N/A'}`);
      console.log(`Subject: ${parsed.subject || '(no subject)'}`);
      console.log(`From: ${parsed.from ? parsed.from.text : '(unknown sender)'}`);
      console.log('Body:');
      console.log(plainText || '(no plain-text body found)');
    } finally {
      mailboxLock.release();
    }
  } finally {
    await client.logout().catch(() => {});
  }
}

main().catch((error) => {
  console.error('IMAP test failed:', error.message);
  process.exitCode = 1;
});
