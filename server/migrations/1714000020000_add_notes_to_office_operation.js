'use strict';

exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE office_operation
    ADD COLUMN IF NOT EXISTS notes TEXT NOT NULL DEFAULT ''
  `);
};

exports.down = () => {
  throw new Error('Down migration is not supported for 1714000020000_add_notes_to_office_operation');
};
