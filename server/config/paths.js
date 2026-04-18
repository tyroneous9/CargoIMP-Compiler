const path = require('path');

const SERVER_ROOT = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(SERVER_ROOT, '..');

const DATA_DIR = path.join(SERVER_ROOT, 'data');
const LOGS_DIR = path.join(DATA_DIR, 'logs');
const OUTPUTS_DIR = path.join(DATA_DIR, 'outputs');
const EMAILS_DIR = path.join(OUTPUTS_DIR, 'emails');
const PARSED_EMAILS_DIR = path.join(OUTPUTS_DIR, 'parsed_emails');
const PARSED_TABLES_DIR = path.join(OUTPUTS_DIR, 'parsed_tables');
const TABLE_FILES = {
  mawb: 'CFS_mawb.csv',
  uld: 'CFS_uld.csv',
  hawb: 'CFS_hawb.csv',
};
const INDEX_FILE = path.join(DATA_DIR, 'index.ndjson');
const ENV_FILE = path.join(SERVER_ROOT, '.env');

const CPP_DIR = path.join(REPO_ROOT, 'cpp');

const PARSER_BINARIES = {
  ffm: path.join(CPP_DIR, 'build', 'parser_ffm_json'),
  fwb: path.join(CPP_DIR, 'build', 'parser_fwb_json'),
  fhl: path.join(CPP_DIR, 'build', 'parser_fhl_json'),
};

const SAMPLE_INPUTS = {
  ffm: path.join(CPP_DIR, 'data', 'input_tests', 'ffm_test.txt'),
  fwb: path.join(CPP_DIR, 'data', 'input_tests', 'fwb_test.txt'),
  fhl: path.join(CPP_DIR, 'data', 'input_tests', 'fhl_test.txt'),
};

module.exports = {
  SERVER_ROOT,
  REPO_ROOT,
  DATA_DIR,
  LOGS_DIR,
  OUTPUTS_DIR,
  EMAILS_DIR,
  PARSED_EMAILS_DIR,
  PARSED_TABLES_DIR,
  TABLE_FILES,
  INDEX_FILE,
  ENV_FILE,
  CPP_DIR,
  PARSER_BINARIES,
  SAMPLE_INPUTS,
};
