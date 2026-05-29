'use strict';

exports.up = (pgm) => {
  pgm.sql(`
    ALTER TYPE isc_enum RENAME TO isc_enum_old;

    CREATE TYPE isc_enum AS ENUM ('ISC - NCA', 'ISC - TOLEAD', 'ISC + STORAGE', 'ISC - VFY_REQ');

    ALTER TABLE office_operation
    ALTER COLUMN isc TYPE isc_enum
    USING (
      CASE isc::text
        WHEN 'NCA' THEN 'ISC - NCA'
        WHEN 'TOLEAD' THEN 'ISC - TOLEAD'
        WHEN 'STORAGE' THEN 'ISC + STORAGE'
        WHEN 'VFY_REQ' THEN 'ISC - VFY_REQ'
        WHEN 'ISC - NCA' THEN 'ISC - NCA'
        WHEN 'ISC - TOLEAD' THEN 'ISC - TOLEAD'
        WHEN 'ISC + STORAGE' THEN 'ISC + STORAGE'
        WHEN 'ISC - VFY_REQ' THEN 'ISC - VFY_REQ'
        ELSE NULL
      END
    )::isc_enum;

    DROP TYPE isc_enum_old;
  `);
};

exports.down = () => {
  throw new Error('Down migration is not supported for 1714000016000_update_isc_enum_values');
};