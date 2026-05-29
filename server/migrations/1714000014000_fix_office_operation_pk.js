'use strict';

exports.up = (pgm) => {
  pgm.sql(`
    -- Recreate table keyed only on mawb_number; hawb_number was never part of the
    -- office_operation data model — it's displayed from a view join.
    DROP TABLE IF EXISTS office_operation;

    CREATE TABLE office_operation (
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

    CREATE INDEX idx_office_operation_mawb ON office_operation (mawb_number);
  `);
};

exports.down = () => {
  throw new Error('Down migration is not supported for 1714000014000_fix_office_operation_pk');
};
