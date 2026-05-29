'use strict';

exports.up = (pgm) => {
  pgm.sql(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'isc_enum') THEN
        CREATE TYPE isc_enum AS ENUM ('ISC - NCA', 'ISC - TOLEAD', 'ISC + STORAGE', 'ISC - VFY_REQ');
      END IF;
    END $$;

    CREATE TABLE IF NOT EXISTS office_operation (
      id BIGSERIAL PRIMARY KEY,
      mawb_number TEXT NOT NULL,
      ams_status TEXT,
      p3 BOOLEAN NOT NULL DEFAULT FALSE,
      hold BOOLEAN NOT NULL DEFAULT FALSE,
      freight_charge NUMERIC(12, 2),
      storage TEXT,
      isc isc_enum,
      last_free_day DATE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT uq_office_operation_mawb UNIQUE (mawb_number)
    );

    CREATE INDEX IF NOT EXISTS idx_office_operation_mawb ON office_operation (mawb_number);
  `);
};

exports.down = () => {
  throw new Error('Down migration is not supported for 1714000013000_add_office_operation_table');
};
