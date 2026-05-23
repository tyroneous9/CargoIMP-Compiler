export const MAWB_TABLE_COLUMNS = [
  'mawb_number',
  'processing_status',
  'origin_airport_code',
  'destination_airport_code',
  'piece_count',
  'weight_kg',
];

export const MAWB_TABLE_SETTINGS_STORAGE_KEY = 'ncaparser.mawbTable.settings';
export const MAWB_DEFAULT_PAGE_SIZE = 25;
export const MAWB_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
export const MAWB_COLUMN_TYPES = {
  piece_count: 'number',
  weight_kg: 'number',
};