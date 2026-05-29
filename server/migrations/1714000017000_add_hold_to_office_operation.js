'use strict';

exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE office_operation
    ADD COLUMN IF NOT EXISTS hold BOOLEAN NOT NULL DEFAULT FALSE
  `);
};

exports.down = () => {
  throw new Error('Down migration is not supported for 1714000017000_add_hold_to_office_operation');
};