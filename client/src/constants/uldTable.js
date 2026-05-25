export const ULD_TABLE_COLUMNS = [
  'uld_code',
  'uld_weight',
  'processing_status',
  'mawb_piece_count',
  'load_type',
  'carrier_flight_number',
  'scheduled_departure_date',
  'scheduled_departure_time',
  'scheduled_arrival_time',
  'departure_airport_code',
  'mawb_numbers',
];

export const ULD_TABLE_SETTINGS_STORAGE_KEY = 'ncaparser.uldTable.settings';
export const ULD_DEFAULT_PAGE_SIZE = 25;
export const ULD_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
export const ULD_COLUMN_TYPES = {
  uld_weight: 'number',
  mawb_piece_count: 'number',
};