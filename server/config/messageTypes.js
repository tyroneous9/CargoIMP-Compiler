const BODY_PARSE_MESSAGE_TYPES = Object.freeze({
  FFM: 'ffm',
  FWB: 'fwb',
  FHL: 'fhl',
  MVT: 'mvt',
});

const SUBJECT_PARSE_MESSAGE_TYPES = Object.freeze({
  RCF: 'rcf',
  ARRIVAL_NOTICE: 'arrival_notice',
  DELIVERY_COMPLETE: 'delivery_complete',
  READY_FOR_PICK_UP: 'ready_for_pick_up',
  DLV: 'dlv',
  NFD: 'nfd',
});

const BODY_PARSE_MESSAGE_TYPE_VALUES = Object.freeze(Object.values(BODY_PARSE_MESSAGE_TYPES));
const SUBJECT_PARSE_MESSAGE_TYPE_VALUES = Object.freeze(
  Object.values(SUBJECT_PARSE_MESSAGE_TYPES)
);

const NOTIFICATION_SUBJECT_PATTERNS = Object.freeze([
  Object.freeze({
    eventType: SUBJECT_PARSE_MESSAGE_TYPES.RCF,
    subjectPrefixPattern: 'RCF',
  }),
  Object.freeze({
    eventType: SUBJECT_PARSE_MESSAGE_TYPES.ARRIVAL_NOTICE,
    subjectPrefixPattern: 'ARRIVAL\\s+NOTICE',
  }),
  Object.freeze({
    eventType: SUBJECT_PARSE_MESSAGE_TYPES.DELIVERY_COMPLETE,
    subjectPrefixPattern: 'DELIVERY\\s+COMPLETE',
  }),
  Object.freeze({
    eventType: SUBJECT_PARSE_MESSAGE_TYPES.READY_FOR_PICK_UP,
    subjectPrefixPattern: 'READY\\s+FOR\\s+PICK\\s+UP',
  }),
  Object.freeze({
    eventType: SUBJECT_PARSE_MESSAGE_TYPES.DLV,
    subjectPrefixPattern: 'DLV',
  }),
  Object.freeze({
    eventType: SUBJECT_PARSE_MESSAGE_TYPES.NFD,
    subjectPrefixPattern: 'NFD',
  }),
]);

function isSupportedMessageType(value) {
  return typeof value === 'string' && BODY_PARSE_MESSAGE_TYPE_VALUES.includes(value);
}

function messageTypeToDbEnum(messageType) {
  if (!isSupportedMessageType(messageType)) {
    return null;
  }

  return messageType.toUpperCase();
}

function isSupportedNotificationEventType(value) {
  return typeof value === 'string' && SUBJECT_PARSE_MESSAGE_TYPE_VALUES.includes(value);
}

module.exports = {
  BODY_PARSE_MESSAGE_TYPES,
  SUBJECT_PARSE_MESSAGE_TYPES,
  NOTIFICATION_SUBJECT_PATTERNS,
  isSupportedMessageType,
  isSupportedNotificationEventType,
  messageTypeToDbEnum,
};