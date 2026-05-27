export const ULD_TABLE_COLUMNS = [
  'processing_status',
  'uld_code',
  'carrier_flight_number',
  'scheduled_departure_date',
  'last_free_day',
  'scheduled_departure_time',
  'scheduled_arrival_date',
  'scheduled_arrival_time',
  'departure_airport_code',
  'mawb_numbers',
  'mawb_piece_count',
  'load_type',
  'uld_weight',
];

export const ULD_DEFAULT_VISIBLE_COLUMNS = [...ULD_TABLE_COLUMNS];

const ULD_EDITABLE_COLUMN_SET = new Set(['processing_status', 'uld_code', 'uld_weight']);

export const ULD_EDITABLE_COLUMNS = ULD_TABLE_COLUMNS.filter((column) =>
  ULD_EDITABLE_COLUMN_SET.has(column)
);

export const ULD_TABLE_SETTINGS_STORAGE_KEY = 'ncaparser.uldTable.settings';
export const ULD_DEFAULT_PAGE_SIZE = 25;
export const ULD_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
export const ULD_COLUMN_TYPES = {
  uld_weight: 'number',
  mawb_piece_count: 'number',
};