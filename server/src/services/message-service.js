'use strict';

const messageRepository = require('../repositories/message-repository');

function toPositiveInt(value, label) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    const error = new Error(`${label} must be a positive integer`);
    error.statusCode = 400;
    throw error;
  }
  return parsed;
}

async function listMessages(query) {
  const offset = Number(query.offset);
  if (!Number.isInteger(offset) || offset < 0) {
    const error = new Error('offset must be a non-negative integer');
    error.statusCode = 400;
    throw error;
  }

  const filters = {
    messageType: query.type,
    status: query.status,
    limit: Math.min(toPositiveInt(query.limit, 'limit'), 200),
    offset,
  };
  return messageRepository.listParsedMessages(filters);
}

async function getMessage(id) {
  return messageRepository.getParsedMessageById(id);
}

module.exports = {
  listMessages,
  getMessage,
};
