'use strict';

exports.up = (pgm) => {
  pgm.sql(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pickup_status_enum') THEN
        CREATE TYPE pickup_status_enum AS ENUM ('new', 'arranged', 'complete');
      END IF;
    END $$;

    CREATE TABLE IF NOT EXISTS pickup_operation (
      id BIGSERIAL PRIMARY KEY,
      ffm_uld_id BIGINT NOT NULL,
      pickup_status pickup_status_enum NOT NULL DEFAULT 'new',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT uq_pickup_operation_ffm_uld_id UNIQUE (ffm_uld_id),
      CONSTRAINT fk_pickup_operation_ffm_uld
        FOREIGN KEY (ffm_uld_id)
        REFERENCES ffm_uld(id)
        ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_pickup_operation_ffm_uld_id
      ON pickup_operation (ffm_uld_id);
  `);
};

exports.down = () => {
  throw new Error('Down migration is not supported for 1714000021000_add_pickup_operation_table');
};
