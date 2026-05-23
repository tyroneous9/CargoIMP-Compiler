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
        processing_status,
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
        fwb_master_id,
        mawb_number,
        origin_airport_code,
        destination_airport_code,
        piece_count,
        weight_kg,
        nature_of_goods,
        processing_status
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

async function listHawbTableRows(limit, offset) {
  const result = await pool.query(
    `
      SELECT DISTINCT ON (hawb_number)
        fhl_house_id,
        hawb_number,
        piece_count,
        weight_kg,
        goods_description,
        processing_status,
        mawb_number,
        origin_airport_code,
        destination_airport_code
      FROM report_hawb
      WHERE hawb_number IS NOT NULL
        AND hawb_number <> ''
      ORDER BY hawb_number ASC
      LIMIT $1 OFFSET $2
    `,
    [limit, offset]
  );
  return result.rows;
}

async function updateUldProcessingStatus(ffmUldId, processingStatus) {
  const result = await pool.query(
    `
      UPDATE ffm_uld
      SET processing_status = $2
      WHERE id = $1
      RETURNING id AS ffm_uld_id, processing_status
    `,
    [ffmUldId, processingStatus]
  );
  return result.rows[0] || null;
}

async function updateMawbProcessingStatus(fwbMasterId, processingStatus) {
  const result = await pool.query(
    `
      UPDATE fwb_master
      SET processing_status = $2
      WHERE id = $1
      RETURNING id AS fwb_master_id, processing_status
    `,
    [fwbMasterId, processingStatus]
  );
  return result.rows[0] || null;
}

async function updateHawbProcessingStatus(fhlHouseId, processingStatus) {
  const result = await pool.query(
    `
      UPDATE fhl_house
      SET processing_status = $2
      WHERE id = $1
      RETURNING id AS fhl_house_id, processing_status
    `,
    [fhlHouseId, processingStatus]
  );
  return result.rows[0] || null;
}

module.exports = {
  listMawbs,
  listUlds,
  listHawbs,
  listUldTableRows,
  listMawbTableRows,
  listHawbTableRows,
  updateUldProcessingStatus,
  updateMawbProcessingStatus,
  updateHawbProcessingStatus,
};
