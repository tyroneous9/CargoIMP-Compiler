export const PICKUP_TABLE_COLUMNS = [
  'carrier_flight_number',
  'scheduled_departure_date',
  'scheduled_departure_time',
  'scheduled_arrival_date',
  'scheduled_arrival_time',
  'load_type',
  'uld_code',
  'pickup_status',
];

export const PICKUP_DEFAULT_VISIBLE_COLUMNS = PICKUP_TABLE_COLUMNS.filter(
  (col) => col !== 'carrier_flight_number' && col !== 'scheduled_departure_date' && col !== 'pickup_status'
);

export const PICKUP_EDITABLE_COLUMNS = ['pickup_status'];

export const PICKUP_TABLE_SETTINGS_STORAGE_KEY = 'ncaparser.pickupTable.settings';
export const PICKUP_DEFAULT_PAGE_SIZE = 25;
export const PICKUP_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export const PICKUP_COLUMN_TYPES = {};

export const PICKUP_STATUS_OPTIONS = ['new', 'arranged', 'complete'];
