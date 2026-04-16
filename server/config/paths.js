const path = require('path');

const SERVER_ROOT = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(SERVER_ROOT, '..');

const DATA_DIR = path.join(SERVER_ROOT, 'data');
const OUTPUTS_DIR = path.join(DATA_DIR, 'outputs');
const INDEX_FILE = path.join(DATA_DIR, 'index.ndjson');
const CHECKPOINT_FILE = path.join(DATA_DIR, 'imap_last_uid.txt');
const ENV_FILE = path.join(SERVER_ROOT, '.env');

const CPP_DIR = path.join(REPO_ROOT, 'cpp');

const PARSER_BINARIES = {
  ffm8: path.join(CPP_DIR, 'build', 'parser_ffm8_json'),
  fwb17: path.join(CPP_DIR, 'build', 'parser_fwb17_json'),
  fhl4: path.join(CPP_DIR, 'build', 'parser_fhl4_json'),
};

const SAMPLE_INPUTS = {
  ffm8: path.join(CPP_DIR, 'data', 'input_tests', 'ffm8_test.txt'),
  fwb17: path.join(CPP_DIR, 'data', 'input_tests', 'fwb17_test.txt'),
  fhl4: path.join(CPP_DIR, 'data', 'input_tests', 'fhl4_test.txt'),
};

module.exports = {
  SERVER_ROOT,
  REPO_ROOT,
  DATA_DIR,
  OUTPUTS_DIR,
  INDEX_FILE,
  CHECKPOINT_FILE,
  ENV_FILE,
  CPP_DIR,
  PARSER_BINARIES,
  SAMPLE_INPUTS,
};
