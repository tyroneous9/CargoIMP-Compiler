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
        r.archive_status,
        r.mawb_piece_count,
        r.load_type,
        r.carrier_flight_number,
        r.scheduled_departure_date,
        r.scheduled_departure_time,
        r.scheduled_arrival_date,
        r.scheduled_arrival_time,
        r.actual_arrival_datetime,
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
        rm.carrier_flight_number,
        rm.scheduled_arrival_date,
        rm.scheduled_arrival_time,
        rm.actual_arrival_datetime,
        rm.piece_count,
        rm.weight_kg,
        rm.nature_of_goods,
        rm.archive_status,
        COALESCE(ns.has_rcf, FALSE) AS has_rcf,
        COALESCE(rm.has_arrival_notice, FALSE) AS has_arrival_notice,
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

async function listEmailXxxRows(limit, offset) {
  const result = await pool.query(
    `
      SELECT DISTINCT ON (rm.mawb_number)
        rm.fwb_master_id,
        rm.archive_status,
        rm.carrier_flight_number,
        rm.scheduled_arrival_date,
        rm.mawb_number,
        COALESCE(ns.has_rcf, FALSE) AS has_rcf,
        COALESCE(ns.has_nfd, FALSE) AS has_nfd,
        COALESCE(ns.has_dlv, FALSE) AS has_dlv,
        COALESCE(rm.has_arrival_notice, FALSE) AS has_arrival_notice,
        COALESCE(ns.has_ready_for_pick_up, FALSE) AS has_ready_for_pick_up,
        COALESCE(ns.has_delivery_complete, FALSE) AS has_delivery_complete
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
        archive_status,
        mawb_number,
        origin_airport_code,
        destination_airport_code,
        scheduled_arrival_time,
        actual_arrival_datetime
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

async function updateUldArchiveStatus(ffmUldId, archiveStatus) {
  const result = await pool.query(
    `
      UPDATE ffm_uld
      SET archive_status = $2
      WHERE id = $1
      RETURNING id AS ffm_uld_id, archive_status
    `,
    [ffmUldId, archiveStatus]
  );
  return result.rows[0] || null;
}

async function updateMawbArchiveStatus(fwbMasterId, archiveStatus) {
  const result = await pool.query(
    `
      UPDATE fwb_master
      SET archive_status = $2
      WHERE id = $1
      RETURNING id AS fwb_master_id, archive_status
    `,
    [fwbMasterId, archiveStatus]
  );
  return result.rows[0] || null;
}

async function updateHawbArchiveStatus(fhlHouseId, archiveStatus) {
  const result = await pool.query(
    `
      UPDATE fhl_house
      SET archive_status = $2
      WHERE id = $1
      RETURNING id AS fhl_house_id, archive_status
    `,
    [fhlHouseId, archiveStatus]
  );
  return result.rows[0] || null;
}

async function updateHawbRows(updates) {
  const client = await pool.connect();
  const updatedRows = [];

  try {
    await client.query('BEGIN');

    for (const update of updates) {
      const columns = Object.keys(update.changes);
      if (columns.length === 0) continue;

      const setClauses = columns.map((column, index) => `${column} = $${index + 2}`);
      const values = [update.id, ...columns.map((column) => update.changes[column])];

      const result = await client.query(
        `
          UPDATE fhl_house
          SET ${setClauses.join(', ')}
          WHERE id = $1
          RETURNING id AS fhl_house_id, archive_status, hawb_number, piece_count, weight_kg
        `,
        values
      );

      if (result.rowCount === 0) {
        throw new Error(`HAWB record not found for id=${update.id}`);
      }

      updatedRows.push(result.rows[0]);
    }

    await client.query('COMMIT');
    return { updatedCount: updatedRows.length, items: updatedRows };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function updateMawbRows(updates) {
  const client = await pool.connect();
  const updatedRows = [];

  try {
    await client.query('BEGIN');

    for (const update of updates) {
      const columns = Object.keys(update.changes);
      if (columns.length === 0) continue;

      const setClauses = columns.map((column, index) => `${column} = $${index + 2}`);
      const values = [update.id, ...columns.map((column) => update.changes[column])];

      const result = await client.query(
        `
          UPDATE fwb_master
          SET ${setClauses.join(', ')}
          WHERE id = $1
          RETURNING id AS fwb_master_id, archive_status, mawb_number,
                    origin_airport_code, destination_airport_code, piece_count, weight_kg
        `,
        values
      );

      if (result.rowCount === 0) {
        throw new Error(`MAWB record not found for id=${update.id}`);
      }

      updatedRows.push(result.rows[0]);
    }

    await client.query('COMMIT');
    return { updatedCount: updatedRows.length, items: updatedRows };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function updateUldRows(updates) {
  const client = await pool.connect();
  const updatedRows = [];

  try {
    await client.query('BEGIN');

    for (const update of updates) {
      const columns = Object.keys(update.changes);
      if (columns.length === 0) continue;

      const setClauses = columns.map((column, index) => `${column} = $${index + 2}`);
      const values = [update.id, ...columns.map((column) => update.changes[column])];

      const result = await client.query(
        `
          UPDATE ffm_uld
          SET ${setClauses.join(', ')}
          WHERE id = $1
          RETURNING id AS ffm_uld_id, archive_status, uld_code, uld_weight
        `,
        values
      );

      if (result.rowCount === 0) {
        throw new Error(`ULD record not found for id=${update.id}`);
      }

      updatedRows.push(result.rows[0]);
    }

    await client.query('COMMIT');
    return { updatedCount: updatedRows.length, items: updatedRows };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function listPickupRows(limit, offset) {
  const result = await pool.query(
    `
      SELECT DISTINCT ON (r.uld_code)
        r.ffm_uld_id,
        r.carrier_flight_number,
        r.scheduled_departure_date,
        r.scheduled_departure_time,
        r.scheduled_arrival_date,
        r.scheduled_arrival_time,
        r.load_type,
        r.uld_code,
        COALESCE(po.pickup_status::text, 'new') AS pickup_status
      FROM report_uld r
      LEFT JOIN pickup_operation po ON po.ffm_uld_id = r.ffm_uld_id
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

async function updatePickupRows(updates) {
  const client = await pool.connect();
  const updatedRows = [];

  try {
    await client.query('BEGIN');

    for (const update of updates) {
      const pickupStatus = update.changes.pickup_status;

      const result = await client.query(
        `
          INSERT INTO pickup_operation (ffm_uld_id, pickup_status, updated_at)
          VALUES ($1, $2::pickup_status_enum, NOW())
          ON CONFLICT (ffm_uld_id)
          DO UPDATE SET
            pickup_status = EXCLUDED.pickup_status,
            updated_at = NOW()
          RETURNING id AS pickup_operation_id, ffm_uld_id, pickup_status::text AS pickup_status
        `,
        [update.id, pickupStatus]
      );

      if (result.rowCount === 0) {
        throw new Error(`Pickup record not found for ffm_uld_id=${update.id}`);
      }

      updatedRows.push(result.rows[0]);
    }

    await client.query('COMMIT');
    return { updatedCount: updatedRows.length, items: updatedRows };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
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
          u.archive_status,
          u.uld_detail_text AS description,
          ff.carrier_flight_number AS related_number,
          ff.departure_airport_code AS origin_airport_code,
          NULL::text AS destination_airport_code,
          u.created_at AS created_at
        FROM ffm_uld u
        JOIN ffm_flight ff ON ff.id = u.ffm_flight_id
        WHERE u.archive_status = FALSE
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
          f.archive_status,
          f.nature_of_goods AS description,
          NULL::text AS related_number,
          f.origin_airport_code AS origin_airport_code,
          f.destination_airport_code AS destination_airport_code,
          f.created_at AS created_at
        FROM fwb_master f
        WHERE f.archive_status = FALSE

        UNION ALL

        SELECT
          'hawb'::text AS record_type,
          h.id::bigint AS record_id,
          h.hawb_number AS record_key,
          h.archive_status,
          h.goods_description AS description,
          fm.mawb_number AS related_number,
          fm.origin_airport_code AS origin_airport_code,
          fm.destination_airport_code AS destination_airport_code,
          h.created_at AS created_at
        FROM fhl_house h
        JOIN fhl_master fm ON fm.id = h.fhl_master_id
        WHERE h.archive_status = FALSE
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
            SET archive_status = TRUE
            WHERE id = $1
          `,
          [record.recordId]
        );
      } else if (record.recordType === 'mawb') {
        await client.query(
          `
            UPDATE fwb_master
            SET archive_status = TRUE
            WHERE id = $1
          `,
          [record.recordId]
        );
      } else if (record.recordType === 'hawb') {
        await client.query(
          `
            UPDATE fhl_house
            SET archive_status = TRUE
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
  listEmailXxxRows,
  listHawbTableRows,
  updateUldArchiveStatus,
  updateMawbArchiveStatus,
  updateHawbArchiveStatus,
  updateHawbRows,
  updateMawbRows,
  updateUldRows,
  listNewMessages,
  archiveNewMessages,
  listOfficeOperationRows,
  upsertOfficeOperationRows,
  listBreakdownManifestRows,
  listPickupRows,
  updatePickupRows,
};

async function listBreakdownManifestRows(limit, offset) {
  const result = await pool.query(
    `
      SELECT
        rm.archive_status,
        rm.mawb_number,
        COALESCE(rh.hawb_numbers, '') AS hawb_number,
        f.piece_count,
        COALESCE(ru.uld_codes, '') AS uld_code,
        oo.ams_status,
        f.id AS fwb_master_id
      FROM report_mawb rm
      JOIN fwb_master f ON f.id = rm.fwb_master_id
      LEFT JOIN office_operation oo ON oo.mawb_number = rm.mawb_number
      LEFT JOIN (
        SELECT
          mawb_number,
          STRING_AGG(
            hawb_number || '_' || total_piece_count::text || 'pcs',
            ', '
            ORDER BY hawb_number
          ) AS hawb_numbers
        FROM (
          SELECT
            mawb_number,
            hawb_number,
            COALESCE(SUM(piece_count), 0)::bigint AS total_piece_count
          FROM report_hawb
          WHERE hawb_number IS NOT NULL
            AND hawb_number <> ''
          GROUP BY mawb_number, hawb_number
        ) hawb_totals
        GROUP BY mawb_number
      ) rh ON rh.mawb_number = rm.mawb_number
      LEFT JOIN (
        SELECT
          uld_totals.mawb_number,
          STRING_AGG(
            uld_totals.uld_code || '_' || COALESCE(uld_totals.total_piece_count::text, '0') || 'pcs',
            ', '
            ORDER BY uld_totals.uld_code
          ) AS uld_codes
        FROM (
          SELECT
            mawb_uld.mawb_number,
            mawb_uld.uld_code,
            COALESCE(SUM(COALESCE(ru.mawb_piece_count, 0)), 0)::bigint AS total_piece_count
          FROM (
            SELECT DISTINCT
              fa.master_awb_number AS mawb_number,
              fu.id AS ffm_uld_id,
              fu.uld_code
            FROM ffm_awb fa
            JOIN ffm_uld fu ON fu.id = fa.ffm_uld_id
            WHERE fa.master_awb_number IS NOT NULL
              AND fa.master_awb_number <> ''
              AND fu.uld_code IS NOT NULL
              AND fu.uld_code <> ''
          ) mawb_uld
          LEFT JOIN report_uld ru ON ru.ffm_uld_id = mawb_uld.ffm_uld_id
          GROUP BY mawb_uld.mawb_number, mawb_uld.uld_code
        ) uld_totals
        GROUP BY uld_totals.mawb_number
      ) ru ON ru.mawb_number = rm.mawb_number
      WHERE rm.mawb_number IS NOT NULL
        AND rm.mawb_number <> ''
      ORDER BY rm.mawb_number ASC
      LIMIT $1 OFFSET $2
    `,
    [limit, offset]
  );
  return result.rows;
}

async function listOfficeOperationRows(limit, offset) {
  const result = await pool.query(
    `
      SELECT DISTINCT ON (rm.mawb_number)
        rm.carrier_flight_number,
        dep.scheduled_departure_date,
        rm.actual_arrival_datetime,
        COALESCE(
          UPPER(TO_CHAR(oo.last_free_day, 'DDMON')),
          CASE
            WHEN dep.scheduled_departure_date ~ '^[0-9]{2}[A-Za-z]{3}$' THEN
              UPPER(
                TO_CHAR(
                  TO_DATE(dep.scheduled_departure_date || TO_CHAR(CURRENT_DATE, 'YYYY'), 'DDMONYYYY') + INTERVAL '2 day',
                  'DDMON'
                )
              )
            ELSE NULL
          END
        ) AS last_free_day,
        rm.archive_status,
        rm.mawb_number,
        COALESCE(rh.hawb_numbers, '') AS hawb_number,
        f.weight_kg,
        f.piece_count,
        COALESCE(ru.uld_codes, '') AS uld_code,
        COALESCE(NULLIF(BTRIM(f.consignee_name), ''), hc.hawb_consignees, '') AS consignee_name,
        oo.ams_status,
        COALESCE(oo.p3, FALSE) AS p3,
        COALESCE(oo.hold, FALSE) AS hold,
        oo.storage,
        oo.isc,
        COALESCE(oo.notes, '') AS notes,
        CASE
          WHEN COALESCE(ns.has_delivery_complete, FALSE) THEN 'archive'
          WHEN COALESCE(ns.has_arrival_notice, FALSE) = FALSE THEN 'arriving'
          WHEN COALESCE(ns.has_ready_for_pick_up, FALSE) = FALSE THEN 'receiving'
          ELSE 'ready'
        END AS processing_status,
        COALESCE(ns.has_delivery_complete, FALSE) AS has_delivery_complete,
        oo.id AS office_operation_id
      FROM report_mawb rm
      JOIN fwb_master f ON f.id = rm.fwb_master_id
      LEFT JOIN mawb_notification_status ns
        ON ns.mawb_number = rm.mawb_number
      LEFT JOIN (
        SELECT
          mawb_number,
          STRING_AGG(
            hawb_number || '_' || total_piece_count::text || 'pcs',
            ', '
            ORDER BY hawb_number
          ) AS hawb_numbers
        FROM (
          SELECT
            mawb_number,
            hawb_number,
            COALESCE(SUM(piece_count), 0)::bigint AS total_piece_count
          FROM report_hawb
          WHERE hawb_number IS NOT NULL
            AND hawb_number <> ''
          GROUP BY mawb_number, hawb_number
        ) hawb_totals
        GROUP BY mawb_number
      ) rh ON rh.mawb_number = rm.mawb_number
      LEFT JOIN (
        SELECT
          fa.master_awb_number AS mawb_number,
          STRING_AGG(DISTINCT fu.uld_code, ', ' ORDER BY fu.uld_code) AS uld_codes
        FROM ffm_awb fa
        JOIN ffm_uld fu ON fu.id = fa.ffm_uld_id
        WHERE fa.master_awb_number IS NOT NULL
          AND fa.master_awb_number <> ''
          AND fu.uld_code IS NOT NULL
          AND fu.uld_code <> ''
        GROUP BY fa.master_awb_number
      ) ru ON ru.mawb_number = rm.mawb_number
      LEFT JOIN (
        SELECT
          fm.mawb_number,
          STRING_AGG(DISTINCT h.consignee_name, ', ' ORDER BY h.consignee_name) AS hawb_consignees
        FROM fhl_house h
        JOIN fhl_master fm ON fm.id = h.fhl_master_id
        WHERE h.consignee_name IS NOT NULL
          AND BTRIM(h.consignee_name) <> ''
        GROUP BY fm.mawb_number
      ) hc ON hc.mawb_number = rm.mawb_number
      LEFT JOIN LATERAL (
        SELECT ff.scheduled_departure_date
        FROM ffm_awb fa
        JOIN ffm_uld fu ON fu.id = fa.ffm_uld_id
        JOIN ffm_flight ff ON ff.id = fu.ffm_flight_id
        WHERE fa.master_awb_number = rm.mawb_number
          AND ff.scheduled_departure_date IS NOT NULL
          AND ff.scheduled_departure_date <> ''
        ORDER BY ff.id DESC
        LIMIT 1
      ) dep ON TRUE
      LEFT JOIN office_operation oo
        ON oo.mawb_number = rm.mawb_number
      WHERE rm.mawb_number IS NOT NULL
        AND rm.mawb_number <> ''
      ORDER BY rm.mawb_number ASC, rm.fwb_master_id DESC
      LIMIT $1 OFFSET $2
    `,
    [limit, offset]
  );
  return result.rows;
}

async function upsertOfficeOperationRows(updates) {
  const client = await pool.connect();
  const updatedRows = [];

  try {
    await client.query('BEGIN');

    for (const update of updates) {
      const { mawb_number, changes } = update;

      const columns = Object.keys(changes);
      if (columns.length === 0) continue;

      const hasArchiveStatusChange = Object.prototype.hasOwnProperty.call(changes, 'archive_status');
      const archiveStatus = hasArchiveStatusChange ? changes.archive_status : null;

      if (hasArchiveStatusChange) {
        const statusResult = await client.query(
          `
            UPDATE fwb_master
            SET archive_status = $2
            WHERE mawb_number = $1
            RETURNING id
          `,
          [mawb_number, archiveStatus]
        );

        if (statusResult.rowCount === 0) {
          throw new Error(`MAWB record not found for mawb_number=${mawb_number}`);
        }
      }

      const officeColumns = columns.filter((column) => column !== 'archive_status');
      if (officeColumns.length === 0) {
        updatedRows.push({ mawb_number, archive_status: archiveStatus });
        continue;
      }

      const setClauseParts = officeColumns.map((col, i) => `${col} = $${i + 2}`);
      const values = [mawb_number, ...officeColumns.map((col) => changes[col])];

      const result = await client.query(
        `
          INSERT INTO office_operation (mawb_number, ${officeColumns.join(', ')}, updated_at)
          VALUES ($1, ${officeColumns.map((_, i) => `$${i + 2}`).join(', ')}, NOW())
          ON CONFLICT (mawb_number)
          DO UPDATE SET ${setClauseParts.join(', ')}, updated_at = NOW()
          RETURNING id AS office_operation_id, mawb_number, $${officeColumns.length + 2}::boolean AS archive_status, ams_status,
                    COALESCE(p3, FALSE) AS p3, hold, storage, isc, COALESCE(notes, '') AS notes, last_free_day
        `,
        [...values, archiveStatus]
      );

      updatedRows.push(result.rows[0]);
    }

    await client.query('COMMIT');
    return { updatedCount: updatedRows.length, items: updatedRows };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
