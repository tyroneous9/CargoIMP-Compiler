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

async function listUldTableRows(limit, offset) {
  const result = await pool.query(
    `
      SELECT DISTINCT ON (uld_code)
        ffm_uld_id,
        uld_code,
        uld_detail_text,
        carrier_flight_number,
        scheduled_departure_date,
        scheduled_departure_time,
        departure_airport_code,
        mawb_numbers,
        awb_count
      FROM report_uld
      WHERE uld_code IS NOT NULL
        AND uld_code <> ''
      ORDER BY uld_code ASC, ffm_uld_id DESC
      LIMIT $1 OFFSET $2
    `,
    [limit, offset]
  );
  return result.rows;
}

async function listMawbTableRows(limit, offset) {
  const result = await pool.query(
    `
      SELECT DISTINCT ON (mawb_number)
        mawb_number,
        origin_airport_code,
        destination_airport_code,
        piece_count,
        weight_kg,
        nature_of_goods
      FROM report_mawb
      WHERE mawb_number IS NOT NULL
        AND mawb_number <> ''
      ORDER BY mawb_number ASC
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
  listUldTableRows,
  listMawbTableRows,
};
