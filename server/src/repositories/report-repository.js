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
        awb_count,
        mailbox,
        source_uid,
        source_parsed_message_id,
        source_parsed_at
      FROM report_uld
      WHERE uld_code IS NOT NULL
        AND uld_code <> ''
      ORDER BY uld_code ASC, source_parsed_at DESC, ffm_uld_id DESC
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
};
