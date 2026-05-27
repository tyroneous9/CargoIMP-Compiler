-- Active: 1779404189835@@127.0.0.1@5432@nca_cargo
-- Show MAWBs with their notification statuses (e.g. RCF, dlv, nfd)
WITH raw_events AS (
  SELECT
    er.id AS email_id,
    COALESCE(er.received_at, er.created_at) AS seen_at,
    er.subject,
    er.raw_json->'recognizedNotification'->>'mawb' AS mawb_number,
    er.raw_json->'recognizedNotification'->>'eventType' AS event_type
  FROM emails_raw er
  WHERE er.raw_json->'recognizedNotification'->>'eventType' IN
    ('rcf', 'arrival_notice', 'delivery_complete', 'ready_for_pick_up', 'dlv', 'nfd')
    AND er.raw_json->'recognizedNotification'->>'mawb' IS NOT NULL
),
per_mawb_events AS (
  SELECT
    re.mawb_number,
    jsonb_agg(
      jsonb_build_object(
        'email_id', re.email_id,
        'seen_at', re.seen_at,
        'event_type', re.event_type,
        'subject', re.subject
      )
      ORDER BY re.seen_at DESC, re.email_id DESC
    ) AS contributing_events
  FROM raw_events re
  GROUP BY re.mawb_number
)
SELECT
  mns.mawb_number,
  mns.has_rcf,
  mns.has_arrival_notice,
  mns.has_delivery_complete,
  mns.has_ready_for_pick_up,
  mns.has_dlv,
  mns.has_nfd,
  mns.notification_email_count,
  mns.last_notification_at,
  COALESCE(pme.contributing_events, '[]'::jsonb) AS contributing_events
FROM mawb_notification_status mns
LEFT JOIN per_mawb_events pme
  ON pme.mawb_number = mns.mawb_number
ORDER BY mns.mawb_number;