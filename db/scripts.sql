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


-- -----------------------------------------------------------------------------
-- DANGER ZONE: wipe all application data (preserves schema objects)
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  truncate_sql TEXT;
BEGIN
  SELECT
    'TRUNCATE TABLE '
    || string_agg(format('%I.%I', schemaname, tablename), ', ')
    || ' RESTART IDENTITY CASCADE'
  INTO truncate_sql
  FROM pg_tables
  WHERE schemaname = 'public'
    AND tablename <> 'pgmigrations';

  IF truncate_sql IS NULL THEN
    RAISE NOTICE 'No tables found to truncate.';
    RETURN;
  END IF;

  EXECUTE truncate_sql;
END
$$;


-- -----------------------------------------------------------------------------
-- DANGER ZONE: delete only records marked processing_status = 'complete'
-- Affects status-bearing tables only: fwb_master, fhl_house, ffm_uld.
-- Child rows linked with ON DELETE CASCADE are removed automatically.
-- -----------------------------------------------------------------------------
BEGIN;

WITH deleted AS (
  DELETE FROM fwb_master
  WHERE processing_status = 'complete'
  RETURNING id
)
SELECT 'fwb_master' AS table_name, COUNT(*) AS deleted_rows FROM deleted;

WITH deleted AS (
  DELETE FROM fhl_house
  WHERE processing_status = 'complete'
  RETURNING id
)
SELECT 'fhl_house' AS table_name, COUNT(*) AS deleted_rows FROM deleted;

WITH deleted AS (
  DELETE FROM ffm_uld
  WHERE processing_status = 'complete'
  RETURNING id
)
SELECT 'ffm_uld' AS table_name, COUNT(*) AS deleted_rows FROM deleted;

COMMIT;