'use strict';

const { SUPPORTED_MESSAGE_TYPES, SUPPORTED_CIMP_MESSAGE_TYPES } = require('../../config/messageTypes');

function firstLine(text) {
  return String(text || '').replace(/\r\n/g, '\n').split('\n')[0].trim().toUpperCase();
}

function detectMessageTypeFromSubject(subject) {
  const header = firstLine(subject);
  const cimpMatch = header.match(/^(FFM|FWB|FHL)\/\d+/);
  if (cimpMatch) {
    const format = cimpMatch[1].toLowerCase();
    if (SUPPORTED_CIMP_MESSAGE_TYPES.includes(format)) return format;
  }

  if (/^SENT-FROM-MOVEMENTMANAGER:?/.test(header)) {
    return SUPPORTED_MESSAGE_TYPES.MVT;
  }

  if (header === 'MVT' || header.startsWith('MVT ')) return SUPPORTED_MESSAGE_TYPES.MVT;
  return null;
}

function detectNotificationSubject(subject) {
  const header = firstLine(subject);
  const patterns = [
    { eventType: 'rcf', regex: /^RCF[_\s-]+(.+)$/ },
    { eventType: 'delivery_complete', regex: /^DELIVERY\s+COMPLETE[_\s-]+(.+)$/ },
    { eventType: 'ready_for_pick_up', regex: /^READY\s+FOR\s+PICK\s+UP[_\s-]+(.+)$/ },
    { eventType: 'dlv', regex: /^DLV[_\s-]+(.+)$/ },
    { eventType: 'nfd', regex: /^NFD[_\s-]+(.+)$/ },
  ];

  for (const pattern of patterns) {
    const match = header.match(pattern.regex);
    if (!match) continue;

    const mawb = String(match[1] || '').trim();
    return {
      eventType: pattern.eventType,
      mawb: mawb || null,
    };
  }

  return null;
}

function messageTypeToDbEnum(messageType) {
  if (messageType === SUPPORTED_MESSAGE_TYPES.FFM) return 'FFM';
  if (messageType === SUPPORTED_MESSAGE_TYPES.FWB) return 'FWB';
  if (messageType === SUPPORTED_MESSAGE_TYPES.FHL) return 'FHL';
  if (messageType === SUPPORTED_MESSAGE_TYPES.MVT) return 'MVT';
  return null;
}

module.exports = {
  detectNotificationSubject,
  detectMessageTypeFromSubject,
  firstLine,
  messageTypeToDbEnum,
};
