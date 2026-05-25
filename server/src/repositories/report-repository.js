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
      SELECT DISTINCT ON (r.uld_code)
        r.ffm_uld_id,
        r.uld_code,
        r.uld_weight,
        r.uld_detail_code,
        r.processing_status,
        r.mawb_piece_count,
        r.load_type,
        r.carrier_flight_number,
        r.scheduled_departure_date,
        r.scheduled_departure_time,
        r.scheduled_arrival_date,
        r.scheduled_arrival_time,
        r.departure_airport_code,
        r.mawb_numbers,
        r.awb_count
      FROM report_uld r
      WHERE r.uld_code IS NOT NULL
        AND r.uld_code <> ''
        AND EXISTS (
          SELECT 1
          FROM ffm_uld u_filter
          JOIN ffm_flight ff_filter ON ff_filter.id = u_filter.ffm_flight_id
          JOIN ffm_route fr_filter ON fr_filter.ffm_flight_id = ff_filter.id
          WHERE u_filter.id = r.ffm_uld_id
            AND fr_filter.arrival_airport_code = 'ORD'
        )
      ORDER BY r.uld_code ASC, r.ffm_uld_id DESC
      LIMIT $1 OFFSET $2
    `,
    [limit, offset]
  );
  return result.rows;
}

async function listMawbTableRows(limit, offset) {
  const result = await pool.query(
    `
      SELECT DISTINCT ON (rm.mawb_number)
        rm.fwb_master_id,
        rm.mawb_number,
        rm.origin_airport_code,
        rm.destination_airport_code,
        rm.scheduled_arrival_date,
        rm.scheduled_arrival_time,
        rm.piece_count,
        rm.weight_kg,
        rm.nature_of_goods,
        rm.processing_status,
        COALESCE(ns.has_rcf, FALSE) AS has_rcf,
        COALESCE(ns.has_delivery_complete, FALSE) AS has_delivery_complete,
        COALESCE(ns.has_ready_for_pick_up, FALSE) AS has_ready_for_pick_up,
        COALESCE(ns.has_dlv, FALSE) AS has_dlv,
        COALESCE(ns.has_nfd, FALSE) AS has_nfd
      FROM report_mawb rm
      LEFT JOIN mawb_notification_status ns
        ON ns.mawb_number = rm.mawb_number
      WHERE rm.mawb_number IS NOT NULL
        AND rm.mawb_number <> ''
      ORDER BY rm.mawb_number ASC
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
        destination_airport_code,
        scheduled_arrival_time
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

async function listNewMessages(limit, offset) {
  const result = await pool.query(
    `
      SELECT *
      FROM (
        SELECT
          'uld'::text AS record_type,
          u.id::bigint AS record_id,
          u.uld_code AS record_key,
          u.processing_status::text AS processing_status,
          u.uld_detail_text AS description,
          ff.carrier_flight_number AS related_number,
          ff.departure_airport_code AS origin_airport_code,
          NULL::text AS destination_airport_code,
          u.created_at AS created_at
        FROM ffm_uld u
        JOIN ffm_flight ff ON ff.id = u.ffm_flight_id
        WHERE u.processing_status = 'new'
          AND EXISTS (
            SELECT 1
            FROM ffm_route fr
            WHERE fr.ffm_flight_id = ff.id
              AND fr.arrival_airport_code = 'ORD'
          )

        UNION ALL

        SELECT
          'mawb'::text AS record_type,
          f.id::bigint AS record_id,
          f.mawb_number AS record_key,
          f.processing_status::text AS processing_status,
          f.nature_of_goods AS description,
          NULL::text AS related_number,
          f.origin_airport_code AS origin_airport_code,
          f.destination_airport_code AS destination_airport_code,
          f.created_at AS created_at
        FROM fwb_master f
        WHERE f.processing_status = 'new'

        UNION ALL

        SELECT
          'hawb'::text AS record_type,
          h.id::bigint AS record_id,
          h.hawb_number AS record_key,
          h.processing_status::text AS processing_status,
          h.goods_description AS description,
          fm.mawb_number AS related_number,
          fm.origin_airport_code AS origin_airport_code,
          fm.destination_airport_code AS destination_airport_code,
          h.created_at AS created_at
        FROM fhl_house h
        JOIN fhl_master fm ON fm.id = h.fhl_master_id
        WHERE h.processing_status = 'new'
      ) new_messages
      ORDER BY created_at DESC, record_type ASC, record_id DESC
      LIMIT $1 OFFSET $2
    `,
    [limit, offset]
  );

  return result.rows;
}

async function archiveNewMessages(records) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    for (const record of records) {
      if (record.recordType === 'uld') {
        await client.query(
          `
            UPDATE ffm_uld
            SET processing_status = 'complete'
            WHERE id = $1
          `,
          [record.recordId]
        );
      } else if (record.recordType === 'mawb') {
        await client.query(
          `
            UPDATE fwb_master
            SET processing_status = 'complete'
            WHERE id = $1
          `,
          [record.recordId]
        );
      } else if (record.recordType === 'hawb') {
        await client.query(
          `
            UPDATE fhl_house
            SET processing_status = 'complete'
            WHERE id = $1
          `,
          [record.recordId]
        );
      }
    }

    await client.query('COMMIT');
    return { archivedCount: records.length };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
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
  listNewMessages,
  archiveNewMessages,
};
