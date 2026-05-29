'use strict';

exports.up = (pgm) => {
  pgm.sql(`
    DROP VIEW IF EXISTS report_uld;
    DROP VIEW IF EXISTS report_hawb;
    DROP VIEW IF EXISTS report_mawb;

    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'ffm_uld'
          AND column_name = 'processing_status'
      ) THEN
        ALTER TABLE ffm_uld RENAME COLUMN processing_status TO archive_status;
      END IF;

      IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'fwb_master'
          AND column_name = 'processing_status'
      ) THEN
        ALTER TABLE fwb_master RENAME COLUMN processing_status TO archive_status;
      END IF;

      IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'fhl_house'
          AND column_name = 'processing_status'
      ) THEN
        ALTER TABLE fhl_house RENAME COLUMN processing_status TO archive_status;
      END IF;
    END $$;

    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'ffm_uld'
          AND column_name = 'archive_status'
          AND udt_name <> 'bool'
      ) THEN
        ALTER TABLE ffm_uld ALTER COLUMN archive_status DROP DEFAULT;
        ALTER TABLE ffm_uld
        ALTER COLUMN archive_status TYPE BOOLEAN
        USING CASE WHEN archive_status::text = 'complete' THEN TRUE ELSE FALSE END;
      END IF;

      IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'fwb_master'
          AND column_name = 'archive_status'
          AND udt_name <> 'bool'
      ) THEN
        ALTER TABLE fwb_master ALTER COLUMN archive_status DROP DEFAULT;
        ALTER TABLE fwb_master
        ALTER COLUMN archive_status TYPE BOOLEAN
        USING CASE WHEN archive_status::text = 'complete' THEN TRUE ELSE FALSE END;
      END IF;

      IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'fhl_house'
          AND column_name = 'archive_status'
          AND udt_name <> 'bool'
      ) THEN
        ALTER TABLE fhl_house ALTER COLUMN archive_status DROP DEFAULT;
        ALTER TABLE fhl_house
        ALTER COLUMN archive_status TYPE BOOLEAN
        USING CASE WHEN archive_status::text = 'complete' THEN TRUE ELSE FALSE END;
      END IF;
    END $$;

    UPDATE ffm_uld SET archive_status = FALSE WHERE archive_status IS NULL;
    UPDATE fwb_master SET archive_status = FALSE WHERE archive_status IS NULL;
    UPDATE fhl_house SET archive_status = FALSE WHERE archive_status IS NULL;

    ALTER TABLE ffm_uld ALTER COLUMN archive_status SET DEFAULT FALSE;
    ALTER TABLE ffm_uld ALTER COLUMN archive_status SET NOT NULL;
    ALTER TABLE fwb_master ALTER COLUMN archive_status SET DEFAULT FALSE;
    ALTER TABLE fwb_master ALTER COLUMN archive_status SET NOT NULL;
    ALTER TABLE fhl_house ALTER COLUMN archive_status SET DEFAULT FALSE;
    ALTER TABLE fhl_house ALTER COLUMN archive_status SET NOT NULL;

    DROP TYPE IF EXISTS processing_status_enum;

    CREATE OR REPLACE VIEW report_mawb AS
    SELECT
      f.id AS fwb_master_id,
      f.mawb_number,
      f.origin_airport_code,
      f.destination_airport_code,
      mawb_arrival.carrier_flight_number,
      mawb_arrival.scheduled_arrival_date,
      mawb_arrival.scheduled_arrival_time,
      mawb_arrival.actual_arrival_datetime,
      f.piece_count,
      f.weight_kg,
      f.nature_of_goods,
      f.archive_status,
      COALESCE(ns.has_arrival_notice, FALSE) AS has_arrival_notice
    FROM fwb_master f
    JOIN messages_parsed mp ON mp.id = f.parsed_message_id
    LEFT JOIN LATERAL (
      SELECT
        ff.carrier_flight_number,
        COALESCE(
          (
            SELECT me.event_date_text
            FROM mvt_event me
            WHERE me.carrier_flight_number = ff.carrier_flight_number
              AND me.event_type IN ('EA', 'AA')
            ORDER BY me.id DESC
            LIMIT 1
          ),
          fr.scheduled_arrival_date
        ) AS scheduled_arrival_date,
        COALESCE(
          (
            SELECT me.event_time_text
            FROM mvt_event me
            WHERE me.carrier_flight_number = ff.carrier_flight_number
              AND me.event_type IN ('EA', 'AA')
            ORDER BY me.id DESC
            LIMIT 1
          ),
          fr.scheduled_arrival_time
        ) AS scheduled_arrival_time,
        (
          SELECT
            CASE
              WHEN COALESCE(me.event_date_text, '') = '' OR COALESCE(me.event_time_text, '') = '' THEN NULL
              ELSE me.event_date_text || ' ' || me.event_time_text
            END
          FROM mvt_event me
          WHERE me.carrier_flight_number = ff.carrier_flight_number
            AND me.event_type = 'AA'
          ORDER BY me.id DESC
          LIMIT 1
        ) AS actual_arrival_datetime
      FROM ffm_awb fa
      JOIN ffm_uld fu ON fu.id = fa.ffm_uld_id
      JOIN ffm_flight ff ON ff.id = fu.ffm_flight_id
      JOIN ffm_route fr ON fr.ffm_flight_id = ff.id
      WHERE fa.master_awb_number = f.mawb_number
      ORDER BY fr.route_seq ASC, fr.id ASC
      LIMIT 1
    ) mawb_arrival ON TRUE
    LEFT JOIN mawb_notification_status ns ON ns.mawb_number = f.mawb_number
    WHERE mp.status = 'ok';

    CREATE OR REPLACE VIEW report_hawb AS
    SELECT
      h.id AS fhl_house_id,
      h.hawb_number,
      h.piece_count,
      h.weight_kg,
      h.goods_description,
      h.archive_status,
      fm.mawb_number,
      fm.origin_airport_code,
      fm.destination_airport_code,
      hawb_arrival.scheduled_arrival_time,
      hawb_arrival.actual_arrival_datetime
    FROM fhl_house h
    JOIN fhl_master fm ON fm.id = h.fhl_master_id
    JOIN messages_parsed mp ON mp.id = fm.parsed_message_id
    LEFT JOIN LATERAL (
      SELECT
        COALESCE(
          (
            SELECT me.event_time_text
            FROM mvt_event me
            WHERE me.carrier_flight_number = ff.carrier_flight_number
              AND me.event_type IN ('EA', 'AA')
            ORDER BY me.id DESC
            LIMIT 1
          ),
          fr.scheduled_arrival_time
        ) AS scheduled_arrival_time,
        (
          SELECT
            CASE
              WHEN COALESCE(me.event_date_text, '') = '' OR COALESCE(me.event_time_text, '') = '' THEN NULL
              ELSE me.event_date_text || ' ' || me.event_time_text
            END
          FROM mvt_event me
          WHERE me.carrier_flight_number = ff.carrier_flight_number
            AND me.event_type = 'AA'
          ORDER BY me.id DESC
          LIMIT 1
        ) AS actual_arrival_datetime
      FROM ffm_awb fa
      JOIN ffm_uld fu ON fu.id = fa.ffm_uld_id
      JOIN ffm_flight ff ON ff.id = fu.ffm_flight_id
      JOIN ffm_route fr ON fr.ffm_flight_id = ff.id
      WHERE fa.master_awb_number = fm.mawb_number
      ORDER BY fr.route_seq ASC, fr.id ASC
      LIMIT 1
    ) hawb_arrival ON TRUE
    WHERE mp.status = 'ok';

    CREATE OR REPLACE VIEW report_uld AS
    SELECT
      u.id AS ffm_uld_id,
      u.uld_code,
      u.uld_weight,
      u.uld_detail_code,
      u.archive_status,
      COALESCE(mawb_piece_totals.total_piece_count, 0) AS mawb_piece_count,
      CASE
        WHEN MAX(
          CASE
            WHEN fa.id IS NOT NULL
              AND NOT EXISTS (
                SELECT 1
                FROM fwb_master fm_match
                WHERE fm_match.mawb_number = fa.master_awb_number
              )
            THEN 1
            ELSE 0
          END
        ) = 1 THEN 'loose'
        ELSE 'uld'
      END AS load_type,
      ff.carrier_flight_number,
      ff.scheduled_departure_date,
      ff.scheduled_departure_time,
      COALESCE(mvt_arrival.scheduled_arrival_date, uld_arrival.scheduled_arrival_date) AS scheduled_arrival_date,
      COALESCE(mvt_arrival.scheduled_arrival_time, uld_arrival.scheduled_arrival_time) AS scheduled_arrival_time,
      ff.departure_airport_code,
      STRING_AGG(DISTINCT fa.master_awb_number, ',' ORDER BY fa.master_awb_number) AS mawb_numbers,
      COUNT(fa.id) AS awb_count,
      mvt_arrival.actual_arrival_datetime
    FROM ffm_uld u
    JOIN ffm_flight ff ON ff.id = u.ffm_flight_id
    JOIN messages_parsed mp ON mp.id = ff.parsed_message_id
    LEFT JOIN ffm_awb fa ON fa.ffm_uld_id = u.id
    LEFT JOIN LATERAL (
      SELECT
        me_any.event_date_text AS scheduled_arrival_date,
        me_any.event_time_text AS scheduled_arrival_time,
        CASE
          WHEN COALESCE(me_aa.event_date_text, '') = '' OR COALESCE(me_aa.event_time_text, '') = '' THEN NULL
          ELSE me_aa.event_date_text || ' ' || me_aa.event_time_text
        END AS actual_arrival_datetime
      FROM (
        SELECT me.event_date_text, me.event_time_text
        FROM mvt_event me
        WHERE me.carrier_flight_number = ff.carrier_flight_number
          AND me.event_type IN ('EA', 'AA')
        ORDER BY me.id DESC
        LIMIT 1
      ) me_any
      LEFT JOIN LATERAL (
        SELECT me.event_date_text, me.event_time_text
        FROM mvt_event me
        WHERE me.carrier_flight_number = ff.carrier_flight_number
          AND me.event_type = 'AA'
        ORDER BY me.id DESC
        LIMIT 1
      ) me_aa ON TRUE
    ) mvt_arrival ON TRUE
    LEFT JOIN LATERAL (
      SELECT fr.scheduled_arrival_date, fr.scheduled_arrival_time
      FROM ffm_route fr
      WHERE fr.ffm_flight_id = ff.id
      ORDER BY fr.route_seq ASC, fr.id ASC
      LIMIT 1
    ) uld_arrival ON TRUE
    LEFT JOIN LATERAL (
      SELECT COALESCE(SUM(latest_fwb.piece_count), 0) AS total_piece_count
      FROM (
        SELECT DISTINCT ON (fm.mawb_number)
          fm.mawb_number,
          fm.piece_count
        FROM ffm_awb fa2
        JOIN fwb_master fm ON fm.mawb_number = fa2.master_awb_number
        WHERE fa2.ffm_uld_id = u.id
        ORDER BY fm.mawb_number, fm.id DESC
      ) latest_fwb
    ) mawb_piece_totals ON TRUE
    WHERE mp.status = 'ok'
    GROUP BY
      u.id,
      u.uld_code,
      u.uld_weight,
      u.uld_detail_code,
      u.archive_status,
      mawb_piece_totals.total_piece_count,
      ff.carrier_flight_number,
      ff.scheduled_departure_date,
      ff.scheduled_departure_time,
      mvt_arrival.scheduled_arrival_date,
      mvt_arrival.scheduled_arrival_time,
      uld_arrival.scheduled_arrival_date,
      uld_arrival.scheduled_arrival_time,
      ff.departure_airport_code,
      mvt_arrival.actual_arrival_datetime;
  `);
};

exports.down = () => {
  throw new Error('Down migration is not supported for 1714000019000_refactor_archive_status');
};