'use strict';

const messageRepository = require('../repositories/message-repository');

function toPositiveInt(value, fallback) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) return fallback;
  return parsed;
}

async function listMessages(query) {
  const filters = {
    messageType: query.type,
    status: query.status,
    limit: Math.min(toPositiveInt(query.limit, 25), 200),
    offset: toPositiveInt(query.offset, 0),
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
