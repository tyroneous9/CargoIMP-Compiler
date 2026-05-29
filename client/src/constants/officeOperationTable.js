export const OFFICE_OPERATION_TABLE_COLUMNS = [
  'archive_status',
  'carrier_flight_number',
  'last_free_day',
  'mawb_number',
  'hawb_number',
  'piece_count',
  'processing_status',
  'hold',
  'ams_status',
  'p3',
  'storage',
  'isc',
  'consignee_name',
  'notes',
];

export const OFFICE_OPERATION_DEFAULT_VISIBLE_COLUMNS = [...OFFICE_OPERATION_TABLE_COLUMNS];

const OFFICE_OPERATION_EDITABLE_COLUMN_SET = new Set([
  'archive_status',
  'ams_status',
  'p3',
  'hold',
  'isc',
  'notes',
]);

export const OFFICE_OPERATION_EDITABLE_COLUMNS = OFFICE_OPERATION_TABLE_COLUMNS.filter((col) =>
  OFFICE_OPERATION_EDITABLE_COLUMN_SET.has(col)
);

export const OFFICE_OPERATION_TABLE_SETTINGS_STORAGE_KEY = 'ncaparser.officeOperationTable.settings.v5';
export const OFFICE_OPERATION_DEFAULT_PAGE_SIZE = 25;
export const OFFICE_OPERATION_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export const OFFICE_OPERATION_COLUMN_TYPES = {
  archive_status: 'boolean',
  p3: 'boolean',
  hold: 'boolean',
  weight_kg: 'number',
  piece_count: 'number',
};

export const OFFICE_OPERATION_ISC_OPTIONS = [
  'ISC - NCA',
  'ISC - TOLEAD',
  'ISC + STORAGE',
  'ISC - VFY_REQ',
];
