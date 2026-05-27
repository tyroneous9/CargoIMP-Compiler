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

function detectSubjectClassification(subject) {
  const header = firstLine(subject);
  const firstToken = header.split(/\s+/)[0] || '';

  let messageType = null;

  if (firstToken === 'FFM') messageType = BODY_PARSE_MESSAGE_TYPES.FFM;
  if (firstToken === 'FWB') messageType = BODY_PARSE_MESSAGE_TYPES.FWB;
  if (firstToken === 'FHL') messageType = BODY_PARSE_MESSAGE_TYPES.FHL;
  if (firstToken === 'MVT') messageType = BODY_PARSE_MESSAGE_TYPES.MVT;

  if (!messageType && /^SENT-FROM-MOVEMENTMANAGER:?/.test(header)) {
    messageType = BODY_PARSE_MESSAGE_TYPES.MVT;
  }

  let notificationSubject = null;

  for (const pattern of NOTIFICATION_REGEX_PATTERNS) {
    const match = header.match(pattern.regex);
    if (!match) continue;

    const mawb = String(match[1] || '').trim();
    notificationSubject = {
      eventType: pattern.eventType,
      mawb: mawb || null,
    };
    break;
  }

  return {
    messageType,
    notificationSubject,
  };
}

module.exports = {
  detectSubjectClassification,
  firstLine,
  messageTypeToDbEnum,
};
