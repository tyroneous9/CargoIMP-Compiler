'use strict';

const { pool } = require('../../config/db');

async function listMawbs(limit, offset) {
  const result = await pool.query(
    `
      SELECT *
      FROM mawb_list
      ORDER BY mawb_number ASC
      LIMIT $1 OFFSET $2
    `,
    [limit, offset]
  );
  return result.rows;
}

async function listUlds(limit, offset) {
  const result = await pool.query(
    `
      SELECT *
      FROM uld_list
      ORDER BY uld_code ASC
      LIMIT $1 OFFSET $2
    `,
    [limit, offset]
  );
  return result.rows;
}

async function listHawbs(limit, offset) {
  const result = await pool.query(
    `
      SELECT *
      FROM hawb_list
      ORDER BY hawb_number ASC
      LIMIT $1 OFFSET $2
    `,
    [limit, offset]
  );
  return result.rows;
}

module.exports = {
  listMawbs,
  listUlds,
  listHawbs,
};
