'use strict';

const { readEnv } = require('./env');

const DEFAULT_PARSER_CONFIG = Object.freeze({
  version: 'v1',
});

function getParserConfig() {
  const version = readEnv('PARSER_VERSION');
  if (!version || version.trim() === '') {
    return DEFAULT_PARSER_CONFIG;
  }

  return {
    version: version.trim(),
  };
}

module.exports = {
  DEFAULT_PARSER_CONFIG,
  getParserConfig,
};
