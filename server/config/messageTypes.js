const SUPPORTED_MESSAGE_TYPES = Object.freeze({
  FFM: 'ffm',
  FWB: 'fwb',
  FHL: 'fhl',
  MVT: 'mvt',
});

const SUPPORTED_MESSAGE_TYPE_VALUES = Object.freeze(Object.values(SUPPORTED_MESSAGE_TYPES));
const SUPPORTED_CIMP_MESSAGE_TYPES = Object.freeze([
  SUPPORTED_MESSAGE_TYPES.FFM,
  SUPPORTED_MESSAGE_TYPES.FWB,
  SUPPORTED_MESSAGE_TYPES.FHL,
]);

function isSupportedMessageType(value) {
  return typeof value === 'string' && SUPPORTED_MESSAGE_TYPE_VALUES.includes(value);
}

module.exports = {
  SUPPORTED_MESSAGE_TYPES,
  SUPPORTED_CIMP_MESSAGE_TYPES,
  isSupportedMessageType,
};