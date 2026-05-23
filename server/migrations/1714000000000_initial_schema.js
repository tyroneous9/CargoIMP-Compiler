'use strict';

const fs = require('fs');
const path = require('path');

const SQL_FILE = path.join(__dirname, 'sql', '0001_initial.sql');

exports.up = (pgm) => {
  const sql = fs.readFileSync(SQL_FILE, 'utf8');
  pgm.sql(sql);
};

exports.down = () => {
  throw new Error('Down migration is not supported for 0001_initial_schema');
};
