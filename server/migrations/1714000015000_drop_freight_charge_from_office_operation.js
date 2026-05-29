'use strict';

exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE office_operation
    DROP COLUMN IF EXISTS freight_charge
  `);
};

exports.down = () => {
  throw new Error('Down migration is not supported for 1714000015000_drop_freight_charge_from_office_operation');
};
