-- Active: 1779404189835@@127.0.0.1@5432@nca_cargo
DO $$
BEGIN
	IF current_database() <> 'nca_cargo' THEN
		RAISE EXCEPTION 'This script must run on nca_cargo, current db is %', current_database();
	END IF;
END $$;

DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'processing_status_enum') THEN
		CREATE TYPE processing_status_enum AS ENUM ('new', 'complete');
	END IF;
END $$;

-- 1) Raw email ingestion
CREATE TABLE IF NOT EXISTS emails_raw (
	id BIGSERIAL PRIMARY KEY,
	mailbox TEXT NOT NULL,
	uid BIGINT NOT NULL,
	message_type TEXT,
	subject TEXT,
	sender TEXT,
	received_at TIMESTAMPTZ,
	body TEXT NOT NULL,
	raw_json JSONB,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	CONSTRAINT ck_emails_raw_message_type
		CHECK (message_type IS NULL OR message_type IN ('FFM', 'FWB', 'FHL', 'MVT')),
	CONSTRAINT uq_emails_raw_mailbox_uid UNIQUE (mailbox, uid)
);

CREATE INDEX IF NOT EXISTS idx_emails_raw_message_type ON emails_raw (message_type);
CREATE INDEX IF NOT EXISTS idx_emails_raw_received_at ON emails_raw (received_at DESC);

-- 2) Parser execution output (keeps parse status/errors/version lineage)
CREATE TABLE IF NOT EXISTS messages_parsed (
	id BIGSERIAL PRIMARY KEY,
	email_id BIGINT NOT NULL REFERENCES emails_raw(id) ON DELETE CASCADE,
	parser_name TEXT,
	parser_version TEXT,
	message_type TEXT NOT NULL,
	status TEXT NOT NULL,
	stderr TEXT,
	stdout TEXT,
	result_json JSONB NOT NULL,
	payload_json JSONB,
	parsed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	CONSTRAINT ck_messages_parsed_message_type
		CHECK (message_type IN ('FFM', 'FWB', 'FHL', 'MVT')),
	CONSTRAINT ck_messages_parsed_status
		CHECK (status IN ('ok', 'error')),
	CONSTRAINT ck_messages_parsed_result_json_object
		CHECK (jsonb_typeof(result_json) = 'object'),
	CONSTRAINT ck_messages_parsed_payload_for_ok
		CHECK (status <> 'ok' OR payload_json IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_messages_parsed_email_id ON messages_parsed (email_id);
CREATE INDEX IF NOT EXISTS idx_messages_parsed_type_status ON messages_parsed (message_type, status);
CREATE INDEX IF NOT EXISTS idx_messages_parsed_parsed_at ON messages_parsed (parsed_at DESC);

-- Latest parse attempt per source email (for retry-friendly ingestion)
CREATE OR REPLACE VIEW v_latest_parsed_per_email AS
SELECT t.*
FROM (
	SELECT
		mp.*,
		ROW_NUMBER() OVER (
			PARTITION BY mp.email_id
			ORDER BY mp.parsed_at DESC, mp.id DESC
		) AS rn
	FROM messages_parsed mp
) t
WHERE t.rn = 1;

-- Latest successful parse per source email
CREATE OR REPLACE VIEW v_latest_ok_parsed_per_email AS
SELECT t.*
FROM (
	SELECT
		mp.*,
		ROW_NUMBER() OVER (
			PARTITION BY mp.email_id
			ORDER BY mp.parsed_at DESC, mp.id DESC
		) AS rn
	FROM messages_parsed mp
	WHERE mp.status = 'ok'
) t
WHERE t.rn = 1;

-- 3) Normalized FFM tables
CREATE TABLE IF NOT EXISTS ffm_flight (
	id BIGSERIAL PRIMARY KEY,
	parsed_message_id BIGINT NOT NULL UNIQUE REFERENCES messages_parsed(id) ON DELETE CASCADE,
	message_page_number TEXT,
	carrier_flight_number TEXT,
	scheduled_departure_datetime TEXT,
	scheduled_departure_date TEXT,
	scheduled_departure_time TEXT,
	departure_airport_code TEXT,
	aircraft_registration TEXT,
	raw_fields JSONB,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ffm_flight_carrier_flight ON ffm_flight (carrier_flight_number);
CREATE INDEX IF NOT EXISTS idx_ffm_flight_departure_airport ON ffm_flight (departure_airport_code);

CREATE TABLE IF NOT EXISTS ffm_route (
	id BIGSERIAL PRIMARY KEY,
	ffm_flight_id BIGINT NOT NULL REFERENCES ffm_flight(id) ON DELETE CASCADE,
	route_seq INTEGER NOT NULL,
	arrival_airport_code TEXT,
	route_kind TEXT,
	scheduled_arrival_datetime TEXT,
	scheduled_arrival_date TEXT,
	scheduled_arrival_time TEXT,
	scheduled_onward_departure_datetime TEXT,
	scheduled_onward_departure_date TEXT,
	scheduled_onward_departure_time TEXT,
	raw_fields JSONB,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	CONSTRAINT uq_ffm_route_seq UNIQUE (ffm_flight_id, route_seq)
);

CREATE INDEX IF NOT EXISTS idx_ffm_route_arrival_airport ON ffm_route (arrival_airport_code);

CREATE TABLE IF NOT EXISTS ffm_uld (
	id BIGSERIAL PRIMARY KEY,
	ffm_flight_id BIGINT NOT NULL REFERENCES ffm_flight(id) ON DELETE CASCADE,
	uld_seq INTEGER NOT NULL,
	uld_code TEXT,
	uld_detail_text TEXT,
	processing_status processing_status_enum NOT NULL DEFAULT 'new',
	raw_fields JSONB,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	CONSTRAINT uq_ffm_uld_seq UNIQUE (ffm_flight_id, uld_seq)
);

ALTER TABLE ffm_uld
	ADD COLUMN IF NOT EXISTS processing_status processing_status_enum NOT NULL DEFAULT 'new';

CREATE INDEX IF NOT EXISTS idx_ffm_uld_code ON ffm_uld (uld_code);

CREATE TABLE IF NOT EXISTS ffm_awb (
	id BIGSERIAL PRIMARY KEY,
	ffm_uld_id BIGINT NOT NULL REFERENCES ffm_uld(id) ON DELETE CASCADE,
	awb_seq INTEGER NOT NULL,
	master_awb_number TEXT,
	origin_and_destination TEXT,
	shipment_summary TEXT,
	free_text TEXT,
	osi JSONB NOT NULL DEFAULT '[]'::jsonb,
	oci JSONB NOT NULL DEFAULT '[]'::jsonb,
	sci JSONB NOT NULL DEFAULT '[]'::jsonb,
	qualifiers JSONB NOT NULL DEFAULT '[]'::jsonb,
	continuations JSONB NOT NULL DEFAULT '[]'::jsonb,
	raw_fields JSONB,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	CONSTRAINT uq_ffm_awb_seq UNIQUE (ffm_uld_id, awb_seq)
);

CREATE INDEX IF NOT EXISTS idx_ffm_awb_master_awb_number ON ffm_awb (master_awb_number);

-- 4) Normalized FWB tables
CREATE TABLE IF NOT EXISTS fwb_master (
	id BIGSERIAL PRIMARY KEY,
	parsed_message_id BIGINT NOT NULL UNIQUE REFERENCES messages_parsed(id) ON DELETE CASCADE,
	mawb_number TEXT,
	origin_airport_code TEXT,
	destination_airport_code TEXT,
	piece_count INTEGER,
	weight_kg NUMERIC(14, 3),
	volume_amount NUMERIC(14, 3),
	volume_unit TEXT,
	nature_of_goods TEXT,
	processing_status processing_status_enum NOT NULL DEFAULT 'new',
	shipper_name TEXT,
	consignee_name TEXT,
	charges_declaration JSONB,
	raw_fields JSONB,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE fwb_master
	ADD COLUMN IF NOT EXISTS processing_status processing_status_enum NOT NULL DEFAULT 'new';

CREATE INDEX IF NOT EXISTS idx_fwb_master_mawb ON fwb_master (mawb_number);

CREATE TABLE IF NOT EXISTS fwb_flight_booking (
	id BIGSERIAL PRIMARY KEY,
	fwb_master_id BIGINT NOT NULL REFERENCES fwb_master(id) ON DELETE CASCADE,
	booking_seq INTEGER NOT NULL,
	carrier_flight_number TEXT,
	day_text TEXT,
	raw_fields JSONB,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	CONSTRAINT uq_fwb_flight_booking_seq UNIQUE (fwb_master_id, booking_seq)
);

CREATE INDEX IF NOT EXISTS idx_fwb_flight_booking_flight ON fwb_flight_booking (carrier_flight_number);

CREATE TABLE IF NOT EXISTS fwb_routing_leg (
	id BIGSERIAL PRIMARY KEY,
	fwb_master_id BIGINT NOT NULL REFERENCES fwb_master(id) ON DELETE CASCADE,
	leg_seq INTEGER NOT NULL,
	airport_code TEXT,
	carrier_code TEXT,
	raw_fields JSONB,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	CONSTRAINT uq_fwb_routing_leg_seq UNIQUE (fwb_master_id, leg_seq)
);

CREATE INDEX IF NOT EXISTS idx_fwb_routing_leg_airport ON fwb_routing_leg (airport_code);

-- 5) Normalized FHL tables
CREATE TABLE IF NOT EXISTS fhl_master (
	id BIGSERIAL PRIMARY KEY,
	parsed_message_id BIGINT NOT NULL UNIQUE REFERENCES messages_parsed(id) ON DELETE CASCADE,
	mawb_number TEXT,
	origin_airport_code TEXT,
	destination_airport_code TEXT,
	charges_declaration JSONB,
	raw_fields JSONB,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fhl_master_mawb ON fhl_master (mawb_number);

CREATE TABLE IF NOT EXISTS fhl_house (
	id BIGSERIAL PRIMARY KEY,
	fhl_master_id BIGINT NOT NULL REFERENCES fhl_master(id) ON DELETE CASCADE,
	house_seq INTEGER NOT NULL,
	hawb_number TEXT,
	piece_count INTEGER,
	weight_kg NUMERIC(14, 3),
	goods_description TEXT,
	processing_status processing_status_enum NOT NULL DEFAULT 'new',
	shipper_name TEXT,
	consignee_name TEXT,
	raw_fields JSONB,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	CONSTRAINT uq_fhl_house_seq UNIQUE (fhl_master_id, house_seq)
);

ALTER TABLE fhl_house
	ADD COLUMN IF NOT EXISTS processing_status processing_status_enum NOT NULL DEFAULT 'new';

CREATE INDEX IF NOT EXISTS idx_fhl_house_hawb ON fhl_house (hawb_number);

-- 6) Normalized MVT table
CREATE TABLE IF NOT EXISTS mvt_event (
	id BIGSERIAL PRIMARY KEY,
	parsed_message_id BIGINT NOT NULL UNIQUE REFERENCES messages_parsed(id) ON DELETE CASCADE,
	event_type TEXT,
	carrier_flight_number TEXT,
	board_point TEXT,
	off_point TEXT,
	event_datetime_text TEXT,
	event_date_text TEXT,
	event_time_text TEXT,
	registration TEXT,
	service_type TEXT,
	diversion_airport_code TEXT,
	delay_airport_code TEXT,
	delay_reason_code TEXT,
	delay_duration_minutes INTEGER,
	raw_fields JSONB,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mvt_event_flight ON mvt_event (carrier_flight_number);
CREATE INDEX IF NOT EXISTS idx_mvt_event_type ON mvt_event (event_type);

-- 7) Reporting projections (the three output entities)
-- These can back exports directly, while preserving normalized/source tables.

CREATE OR REPLACE VIEW report_mawb AS
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

CREATE OR REPLACE VIEW report_hawb AS
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

CREATE OR REPLACE VIEW report_uld AS
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

-- 8) Simple list views for direct querying requirements.
CREATE OR REPLACE VIEW mawb_list AS
SELECT DISTINCT mawb_number
FROM (
	SELECT f.mawb_number FROM fwb_master f WHERE f.mawb_number IS NOT NULL AND f.mawb_number <> ''
	UNION ALL
	SELECT m.mawb_number FROM fhl_master m WHERE m.mawb_number IS NOT NULL AND m.mawb_number <> ''
	UNION ALL
	SELECT a.master_awb_number FROM ffm_awb a WHERE a.master_awb_number IS NOT NULL AND a.master_awb_number <> ''
) x
ORDER BY mawb_number;

CREATE OR REPLACE VIEW hawb_list AS
SELECT DISTINCT h.hawb_number
FROM fhl_house h
WHERE h.hawb_number IS NOT NULL AND h.hawb_number <> ''
ORDER BY h.hawb_number;

CREATE OR REPLACE VIEW uld_list AS
SELECT DISTINCT u.uld_code
FROM ffm_uld u
WHERE u.uld_code IS NOT NULL AND u.uld_code <> ''
ORDER BY u.uld_code;

-- 9) Pipeline runtime tracking for Option A single-service scheduler/worker.
CREATE TABLE IF NOT EXISTS pipeline_runs (
	id BIGSERIAL PRIMARY KEY,
	run_id TEXT NOT NULL UNIQUE,
	run_number BIGINT NOT NULL,
	status TEXT NOT NULL,
	force_run BOOLEAN NOT NULL DEFAULT FALSE,
	metrics_json JSONB,
	started_at TIMESTAMPTZ NOT NULL,
	finished_at TIMESTAMPTZ,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	CONSTRAINT ck_pipeline_runs_status CHECK (status IN ('running', 'success', 'failed'))
);

CREATE INDEX IF NOT EXISTS idx_pipeline_runs_started_at ON pipeline_runs (started_at DESC);

CREATE TABLE IF NOT EXISTS pipeline_run_steps (
	id BIGSERIAL PRIMARY KEY,
	pipeline_run_id BIGINT NOT NULL REFERENCES pipeline_runs(id) ON DELETE CASCADE,
	step_name TEXT NOT NULL,
	status TEXT NOT NULL,
	detail_json JSONB,
	started_at TIMESTAMPTZ NOT NULL,
	finished_at TIMESTAMPTZ,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	CONSTRAINT ck_pipeline_run_steps_status CHECK (status IN ('success', 'failed'))
);

CREATE INDEX IF NOT EXISTS idx_pipeline_run_steps_run_id ON pipeline_run_steps (pipeline_run_id);