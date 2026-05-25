'use strict';

const { SUPPORTED_MESSAGE_TYPES, SUPPORTED_CIMP_MESSAGE_TYPES } = require('../../config/messageTypes');

function firstLine(text) {
  return String(text || '').replace(/\r\n/g, '\n').split('\n')[0].trim().toUpperCase();
}

function detectMessageTypeFromText(text) {
  const header = firstLine(text);
  const cimpMatch = header.match(/^(FFM|FWB|FHL)\/\d+/);
  if (cimpMatch) {
    const format = cimpMatch[1].toLowerCase();
    if (SUPPORTED_CIMP_MESSAGE_TYPES.includes(format)) return format;
  }
  if (header === 'MVT' || header.startsWith('MVT ')) return SUPPORTED_MESSAGE_TYPES.MVT;
  return null;
}

function detectMessageTypeFromSubject(subject) {
  return detectMessageTypeFromText(subject);
}

function detectMessageTypeFromBody(body) {
  return detectMessageTypeFromText(body);
}

function messageTypeToDbEnum(messageType) {
  if (messageType === SUPPORTED_MESSAGE_TYPES.FFM) return 'FFM';
  if (messageType === SUPPORTED_MESSAGE_TYPES.FWB) return 'FWB';
  if (messageType === SUPPORTED_MESSAGE_TYPES.FHL) return 'FHL';
  if (messageType === SUPPORTED_MESSAGE_TYPES.MVT) return 'MVT';
  return null;
}

module.exports = {
  detectMessageTypeFromBody,
  detectMessageTypeFromSubject,
  firstLine,
  messageTypeToDbEnum,
};
