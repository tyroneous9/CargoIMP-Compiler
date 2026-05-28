export const MAWB_TABLE_COLUMNS = [
  'processing_status',
  'mawb_number',
  'carrier_flight_number',
  'has_rcf',
  'has_delivery_complete',
  'has_arrival_notice',
  'has_ready_for_pick_up',
  'has_dlv',
  'has_nfd',
  'origin_airport_code',
  'destination_airport_code',
  'scheduled_arrival_date',
  'scheduled_arrival_time',
  'actual_arrival_datetime',
  'piece_count',
  'weight_kg',
];

export const MAWB_DEFAULT_VISIBLE_COLUMNS = [...MAWB_TABLE_COLUMNS];

const MAWB_EDITABLE_COLUMN_SET = new Set([
  'processing_status',
  'mawb_number',
  'origin_airport_code',
  'destination_airport_code',
  'piece_count',
  'weight_kg',
]);

export const MAWB_EDITABLE_COLUMNS = MAWB_TABLE_COLUMNS.filter((column) =>
  MAWB_EDITABLE_COLUMN_SET.has(column)
);

export const MAWB_TABLE_SETTINGS_STORAGE_KEY = 'ncaparser.mawbTable.settings';
export const MAWB_DEFAULT_PAGE_SIZE = 25;
export const MAWB_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
export const MAWB_COLUMN_TYPES = {
  piece_count: 'number',
  weight_kg: 'number',
};