'use strict';

exports.up = (pgm) => {
  pgm.sql(`
    CREATE OR REPLACE VIEW report_mawb AS
    SELECT
      f.id AS fwb_master_id,
      f.mawb_number,
      f.origin_airport_code,
      f.destination_airport_code,
      mawb_arrival.carrier_flight_number,
      mawb_arrival.scheduled_arrival_date,
      mawb_arrival.scheduled_arrival_time,
      f.piece_count,
      f.weight_kg,
      f.nature_of_goods,
      f.processing_status,
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
        ) AS scheduled_arrival_time
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
  `);
};

exports.down = () => {
  throw new Error('Down migration is not supported for 1714000011000_add_has_arrival_notice_to_report_mawb');
};
