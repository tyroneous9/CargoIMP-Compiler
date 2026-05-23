export const ULD_TABLE_COLUMNS = [
  'uld_code',
  'processing_status',
  'uld_detail_text',
  'carrier_flight_number',
  'scheduled_departure_date',
  'scheduled_departure_time',
  'departure_airport_code',
  'mawb_numbers',
  'awb_count',
];

export const ULD_TABLE_SETTINGS_STORAGE_KEY = 'ncaparser.uldTable.settings';
export const ULD_DEFAULT_PAGE_SIZE = 25;
export const ULD_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
export const ULD_COLUMN_TYPES = {
  awb_count: 'number',
};