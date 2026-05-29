'use strict';

exports.up = (pgm) => {
  pgm.sql(`
    -- Ensure table exists in the expected shape keyed by mawb_number.
    CREATE TABLE IF NOT EXISTS office_operation (
      id BIGSERIAL PRIMARY KEY,
      mawb_number TEXT NOT NULL UNIQUE,
      ams_status TEXT,
      p3 BOOLEAN NOT NULL DEFAULT FALSE,
      hold BOOLEAN NOT NULL DEFAULT FALSE,
      freight_charge NUMERIC(12, 2),
      storage TEXT,
      isc isc_enum,
      last_free_day DATE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- Remove obsolete column/constraint from early schema variants.
    ALTER TABLE office_operation DROP COLUMN IF EXISTS hawb_number;
    ALTER TABLE office_operation DROP CONSTRAINT IF EXISTS uq_office_operation_mawb_hawb;

    -- Guarantee upsert target exists for ON CONFLICT (mawb_number).
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'uq_office_operation_mawb'
          AND conrelid = 'office_operation'::regclass
      ) THEN
        ALTER TABLE office_operation
        ADD CONSTRAINT uq_office_operation_mawb UNIQUE (mawb_number);
      END IF;
    END $$;

    CREATE INDEX IF NOT EXISTS idx_office_operation_mawb ON office_operation (mawb_number);
  `);
};

exports.down = () => {
  throw new Error('Down migration is not supported for 1714000014000_fix_office_operation_pk');
};
