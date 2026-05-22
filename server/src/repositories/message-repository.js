'use strict';

const { pool } = require('../../config/db');

function normalizeMessageTypeFilter(value) {
  if (!value) return null;
  const upper = String(value).toUpperCase();
  if (upper === 'FFM' || upper === 'FWB' || upper === 'FHL' || upper === 'MVT') return upper;
  return null;
}

function normalizeStatusFilter(value) {
  if (!value) return null;
  const lower = String(value).toLowerCase();
  if (lower === 'ok' || lower === 'error') return lower;
  return null;
}

async function listParsedMessages(filters) {
  const where = [];
  const values = [];

  const messageType = normalizeMessageTypeFilter(filters.messageType);
  if (messageType) {
    values.push(messageType);
    where.push(`mp.message_type = $${values.length}`);
  }

  const status = normalizeStatusFilter(filters.status);
  if (status) {
    values.push(status);
    where.push(`mp.status = $${values.length}`);
  }

  const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

  values.push(filters.limit, filters.offset);

  const result = await pool.query(
    `
      SELECT
        mp.id,
        mp.email_id,
        mp.message_type,
        mp.status,
        mp.parsed_at,
        mp.stderr,
        er.mailbox,
        er.uid,
        er.subject,
        er.sender,
        er.received_at
      FROM messages_parsed mp
      JOIN emails_raw er ON er.id = mp.email_id
      ${whereClause}
      ORDER BY mp.parsed_at DESC, mp.id DESC
      LIMIT $${values.length - 1} OFFSET $${values.length}
    `,
    values
  );

  return result.rows;
}

async function getParsedMessageById(id) {
  const result = await pool.query(
    `
      SELECT
        mp.id,
        mp.email_id,
        mp.parser_name,
        mp.parser_version,
        mp.message_type,
        mp.status,
        mp.parsed_at,
        mp.stderr,
        mp.stdout,
        mp.result_json,
        mp.payload_json,
        er.mailbox,
        er.uid,
        er.subject,
        er.sender,
        er.received_at,
        er.body,
        er.raw_json
      FROM messages_parsed mp
      JOIN emails_raw er ON er.id = mp.email_id
      WHERE mp.id = $1
    `,
    [id]
  );

  return result.rows[0] || null;
}

module.exports = {
  listParsedMessages,
  getParsedMessageById,
};
