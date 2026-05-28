'use strict';

exports.up = (pgm) => {
  pgm.sql(`
    DROP VIEW IF EXISTS mawb_notification_status;

    CREATE INDEX IF NOT EXISTS idx_emails_raw_notification_mawb_event
    ON emails_raw (
      (raw_json->'recognizedNotification'->>'mawb'),
      (raw_json->'recognizedNotification'->>'eventType')
    )
    WHERE raw_json->'recognizedNotification'->>'eventType' IN ('rcf', 'delivery_complete', 'ready_for_pick_up', 'dlv', 'nfd');

    CREATE OR REPLACE VIEW mawb_notification_status AS
    WITH notification_events AS (
      SELECT
        er.raw_json->'recognizedNotification'->>'mawb' AS mawb_number,
        er.raw_json->'recognizedNotification'->>'eventType' AS event_type,
        COALESCE(er.received_at, er.created_at) AS seen_at
      FROM emails_raw er
      WHERE er.raw_json->'recognizedNotification'->>'eventType' IN ('rcf', 'delivery_complete', 'ready_for_pick_up', 'dlv', 'nfd')
        AND er.raw_json->'recognizedNotification'->>'mawb' IS NOT NULL
    ), notification_rollup AS (
      SELECT
        ne.mawb_number,
        BOOL_OR(ne.event_type = 'rcf') AS has_rcf,
        BOOL_OR(ne.event_type = 'delivery_complete') AS has_delivery_complete,
        BOOL_OR(ne.event_type = 'ready_for_pick_up') AS has_ready_for_pick_up,
        BOOL_OR(ne.event_type = 'dlv') AS has_dlv,
        BOOL_OR(ne.event_type = 'nfd') AS has_nfd,
        COUNT(*) AS notification_email_count,
        MAX(ne.seen_at) AS last_notification_at
      FROM notification_events ne
      GROUP BY ne.mawb_number
    ), mawb_universe AS (
      SELECT ml.mawb_number
      FROM mawb_list ml
      UNION
      SELECT ne.mawb_number
      FROM notification_events ne
    )
    SELECT
      mu.mawb_number,
      COALESCE(nr.has_rcf, FALSE) AS has_rcf,
      COALESCE(nr.has_delivery_complete, FALSE) AS has_delivery_complete,
      COALESCE(nr.has_ready_for_pick_up, FALSE) AS has_ready_for_pick_up,
      COALESCE(nr.has_dlv, FALSE) AS has_dlv,
      COALESCE(nr.has_nfd, FALSE) AS has_nfd,
      COALESCE(nr.notification_email_count, 0) AS notification_email_count,
      nr.last_notification_at
    FROM mawb_universe mu
    LEFT JOIN notification_rollup nr ON nr.mawb_number = mu.mawb_number
    ORDER BY mu.mawb_number;
  `);
};

exports.down = () => {
  throw new Error('Down migration is not supported for 1714000008000_add_mawb_notification_status_view');
};
