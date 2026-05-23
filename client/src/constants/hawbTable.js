export const HAWB_TABLE_COLUMNS = [
  'hawb_number',
  'processing_status',
  'piece_count',
  'weight_kg',
  'mawb_number',
  'origin_airport_code',
  'destination_airport_code',
  'scheduled_arrival_time',
];

export const HAWB_TABLE_SETTINGS_STORAGE_KEY = 'ncaparser.hawbTable.settings';
export const HAWB_DEFAULT_PAGE_SIZE = 25;
export const HAWB_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
export const HAWB_COLUMN_TYPES = {
  piece_count: 'number',
  weight_kg: 'number',
};