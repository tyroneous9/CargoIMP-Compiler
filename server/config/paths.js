const path = require('path');
const { SUPPORTED_MESSAGE_TYPES } = require('./messageTypes');

const SERVER_ROOT = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(SERVER_ROOT, '..');

const DATA_DIR = path.join(SERVER_ROOT, 'data');
const LOGS_DIR = path.join(DATA_DIR, 'logs');
const ENV_FILE = path.join(SERVER_ROOT, '.env');

const CPP_DIR = path.join(REPO_ROOT, 'cpp');

const PARSER_BINARIES = {
  [SUPPORTED_MESSAGE_TYPES.FFM]: path.join(CPP_DIR, 'build', 'parser_ffm_json'),
  [SUPPORTED_MESSAGE_TYPES.FWB]: path.join(CPP_DIR, 'build', 'parser_fwb_json'),
  [SUPPORTED_MESSAGE_TYPES.FHL]: path.join(CPP_DIR, 'build', 'parser_fhl_json'),
  [SUPPORTED_MESSAGE_TYPES.MVT]: path.join(CPP_DIR, 'build', 'parser_mvt_json'),
};

const SAMPLE_INPUTS = {
  [SUPPORTED_MESSAGE_TYPES.FFM]: path.join(CPP_DIR, 'data', 'input_tests', 'ffm_test.txt'),
  [SUPPORTED_MESSAGE_TYPES.FWB]: path.join(CPP_DIR, 'data', 'input_tests', 'fwb_test.txt'),
  [SUPPORTED_MESSAGE_TYPES.FHL]: path.join(CPP_DIR, 'data', 'input_tests', 'fhl_test.txt'),
  [SUPPORTED_MESSAGE_TYPES.MVT]: path.join(CPP_DIR, 'data', 'input_tests', 'mvt_test.txt'),
};

module.exports = {
  SERVER_ROOT,
  REPO_ROOT,
  DATA_DIR,
  LOGS_DIR,
  ENV_FILE,
  CPP_DIR,
  PARSER_BINARIES,
  SAMPLE_INPUTS,
};
