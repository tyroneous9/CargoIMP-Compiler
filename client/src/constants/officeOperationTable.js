export const OFFICE_OPERATION_TABLE_COLUMNS = [
  'carrier_flight_number',
  'actual_arrival_datetime',
  'last_free_day',
  'mawb_number',
  'hawb_number',
  'weight_kg',
  'piece_count',
  'uld_code',
  'consignee_name',
  'ams_status',
  'p3',
  'freight_charge',
  'storage',
  'isc',
  'has_delivery_complete',
];

export const OFFICE_OPERATION_DEFAULT_VISIBLE_COLUMNS = [...OFFICE_OPERATION_TABLE_COLUMNS];

const OFFICE_OPERATION_EDITABLE_COLUMN_SET = new Set([
  'ams_status',
  'p3',
  'freight_charge',
  'storage',
  'isc',
]);

export const OFFICE_OPERATION_EDITABLE_COLUMNS = OFFICE_OPERATION_TABLE_COLUMNS.filter((col) =>
  OFFICE_OPERATION_EDITABLE_COLUMN_SET.has(col)
);

export const OFFICE_OPERATION_TABLE_SETTINGS_STORAGE_KEY = 'ncaparser.officeOperationTable.settings';
export const OFFICE_OPERATION_DEFAULT_PAGE_SIZE = 25;
export const OFFICE_OPERATION_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export const OFFICE_OPERATION_COLUMN_TYPES = {
  p3: 'boolean',
  weight_kg: 'number',
  piece_count: 'number',
  freight_charge: 'number',
};

export const OFFICE_OPERATION_COLUMN_LABELS = {
  carrier_flight_number: 'Flight',
  actual_arrival_datetime: 'Actual Arrival',
  last_free_day: 'LFD',
  mawb_number: 'MAWB',
  hawb_number: 'HAWB',
  weight_kg: 'Weight (kg)',
  piece_count: 'Pieces',
  uld_code: 'ULD',
  consignee_name: 'Consignee',
  ams_status: 'AMS',
  p3: 'P3',
  freight_charge: 'Freight Charge',
  storage: 'Storage',
  isc: 'ISC',
  has_delivery_complete: 'Delivered',
};

export const OFFICE_OPERATION_ISC_OPTIONS = ['TOLEAD', 'NCA', 'STORAGE', 'VFY_REQ'];
