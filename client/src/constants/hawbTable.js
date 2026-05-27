export const HAWB_TABLE_COLUMNS = [
  'processing_status',
  'hawb_number',
  'piece_count',
  'weight_kg',
  'mawb_number',
  'origin_airport_code',
  'destination_airport_code',
  'scheduled_arrival_time',
];

export const HAWB_DEFAULT_VISIBLE_COLUMNS = [
  'processing_status',
  'hawb_number',
  'piece_count',
  'mawb_number',
];

export const HAWB_TABLE_SETTINGS_STORAGE_KEY = 'ncaparser.hawbTable.settings';
export const HAWB_DEFAULT_PAGE_SIZE = 25;
export const HAWB_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
export const HAWB_COLUMN_TYPES = {
  piece_count: 'number',
  weight_kg: 'number',
};

export const HAWB_FETCH_URL = '/api/reports/hawbs-table?limit=1000&offset=0';
export const HAWB_FETCH_ERROR_TEXT = 'Unable to load HAWB rows';
export const HAWB_LOADING_TEXT = 'Loading HAWB rows...';
export const HAWB_STICKY_COLUMN = 'hawb_number';
export const HAWB_ROW_ID_FIELD = 'fhl_house_id';
export const HAWB_ROW_KEY_FALLBACK_FIELD = 'hawb_number';
export const HAWB_ROW_KEY_PREFIX = 'hawb-row';