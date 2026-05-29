'use strict';

exports.up = (pgm) => {
  pgm.sql(`
    UPDATE office_operation
    SET p3 = FALSE
    WHERE p3 IS NULL;

    ALTER TABLE office_operation
    ALTER COLUMN p3 SET DEFAULT FALSE;

    ALTER TABLE office_operation
    ALTER COLUMN p3 SET NOT NULL;
  `);
};

exports.down = () => {
  throw new Error('Down migration is not supported for 1714000018000_set_p3_default_false');
};