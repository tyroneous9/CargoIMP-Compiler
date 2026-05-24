'use strict';

exports.up = (pgm) => {
  pgm.sql(`
    DROP VIEW IF EXISTS report_uld;
    DROP VIEW IF EXISTS report_hawb;
    DROP VIEW IF EXISTS report_mawb;

    CREATE VIEW report_mawb AS
    SELECT
      f.id AS fwb_master_id,
      f.mawb_number,
      f.origin_airport_code,
      f.destination_airport_code,
      mawb_arrival.scheduled_arrival_time,
      f.piece_count,
      f.weight_kg,
      f.nature_of_goods,
      f.processing_status
    FROM fwb_master f
    JOIN messages_parsed mp ON mp.id = f.parsed_message_id
    LEFT JOIN LATERAL (
      SELECT COALESCE(
        (
          SELECT me.event_time_text
          FROM mvt_event me
          WHERE me.carrier_flight_number = ff.carrier_flight_number
            AND me.event_type IN ('EA', 'AA')
          ORDER BY me.id DESC
          LIMIT 1
        ),
        fr.scheduled_arrival_time
      ) AS scheduled_arrival_time
      FROM ffm_awb fa
      JOIN ffm_uld fu ON fu.id = fa.ffm_uld_id
      JOIN ffm_flight ff ON ff.id = fu.ffm_flight_id
      JOIN ffm_route fr ON fr.ffm_flight_id = ff.id
      WHERE fa.master_awb_number = f.mawb_number
      ORDER BY fr.route_seq ASC, fr.id ASC
      LIMIT 1
    ) mawb_arrival ON TRUE
    WHERE mp.status = 'ok';

    CREATE VIEW report_hawb AS
    SELECT
      h.id AS fhl_house_id,
      h.hawb_number,
      h.piece_count,
      h.weight_kg,
      h.goods_description,
      h.processing_status,
      fm.mawb_number,
      fm.origin_airport_code,
      fm.destination_airport_code,
      hawb_arrival.scheduled_arrival_time
    FROM fhl_house h
    JOIN fhl_master fm ON fm.id = h.fhl_master_id
    JOIN messages_parsed mp ON mp.id = fm.parsed_message_id
    LEFT JOIN LATERAL (
      SELECT COALESCE(
        (
          SELECT me.event_time_text
          FROM mvt_event me
          WHERE me.carrier_flight_number = ff.carrier_flight_number
            AND me.event_type IN ('EA', 'AA')
          ORDER BY me.id DESC
          LIMIT 1
        ),
        fr.scheduled_arrival_time
      ) AS scheduled_arrival_time
      FROM ffm_awb fa
      JOIN ffm_uld fu ON fu.id = fa.ffm_uld_id
      JOIN ffm_flight ff ON ff.id = fu.ffm_flight_id
      JOIN ffm_route fr ON fr.ffm_flight_id = ff.id
      WHERE fa.master_awb_number = fm.mawb_number
      ORDER BY fr.route_seq ASC, fr.id ASC
      LIMIT 1
    ) hawb_arrival ON TRUE
    WHERE mp.status = 'ok';

    CREATE VIEW report_uld AS
    SELECT
      u.id AS ffm_uld_id,
      u.uld_code,
      u.uld_detail_text,
      u.processing_status,
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
      COALESCE(mvt_arrival.scheduled_arrival_time, uld_arrival.scheduled_arrival_time) AS scheduled_arrival_time,
      ff.departure_airport_code,
      STRING_AGG(DISTINCT fa.master_awb_number, ',' ORDER BY fa.master_awb_number) AS mawb_numbers,
      COUNT(fa.id) AS awb_count
    FROM ffm_uld u
    JOIN ffm_flight ff ON ff.id = u.ffm_flight_id
    JOIN messages_parsed mp ON mp.id = ff.parsed_message_id
    LEFT JOIN ffm_awb fa ON fa.ffm_uld_id = u.id
    LEFT JOIN LATERAL (
      SELECT me.event_time_text AS scheduled_arrival_time
      FROM mvt_event me
      WHERE me.carrier_flight_number = ff.carrier_flight_number
        AND me.event_type IN ('EA', 'AA')
      ORDER BY me.id DESC
      LIMIT 1
    ) mvt_arrival ON TRUE
    LEFT JOIN LATERAL (
      SELECT fr.scheduled_arrival_time
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
      u.uld_detail_text,
      u.processing_status,
      mawb_piece_totals.total_piece_count,
      ff.carrier_flight_number,
      ff.scheduled_departure_date,
      ff.scheduled_departure_time,
      mvt_arrival.scheduled_arrival_time,
      uld_arrival.scheduled_arrival_time,
      ff.departure_airport_code;
  `);
};

exports.down = () => {
  throw new Error('Down migration is not supported for 1714000003000_use_mvt_for_scheduled_arrival_time');
};
