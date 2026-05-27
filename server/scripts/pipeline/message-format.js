'use strict';

const {
  BODY_PARSE_MESSAGE_TYPES,
  NOTIFICATION_SUBJECT_PATTERNS,
  messageTypeToDbEnum,
} = require('../../config/messageTypes');

const MAWB_PATTERN = '([0-9]{3}-[0-9]{8})';
const NOTIFICATION_REGEX_PATTERNS = NOTIFICATION_SUBJECT_PATTERNS.map((pattern) => ({
  eventType: pattern.eventType,
  regex: new RegExp(`^${pattern.subjectPrefixPattern}[_\\s-]+${MAWB_PATTERN}$`),
}));

function firstLine(text) {
  return String(text || '').replace(/\r\n/g, '\n').split('\n')[0].trim().toUpperCase();
}

function detectMessageTypeFromSubject(subject) {
  const header = firstLine(subject);
  const cimpMatch = header.match(/^(FFM|FWB|FHL)\/\d+/);
  if (cimpMatch) {
    return cimpMatch[1].toLowerCase();
  }

  if (/^SENT-FROM-MOVEMENTMANAGER:?/.test(header)) {
    return BODY_PARSE_MESSAGE_TYPES.MVT;
  }

  if (header === 'MVT' || header.startsWith('MVT ')) return BODY_PARSE_MESSAGE_TYPES.MVT;
  return null;
}

function detectNotificationSubject(subject) {
  const header = firstLine(subject);

  for (const pattern of NOTIFICATION_REGEX_PATTERNS) {
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

module.exports = {
  detectNotificationSubject,
  detectMessageTypeFromSubject,
  firstLine,
  messageTypeToDbEnum,
};
