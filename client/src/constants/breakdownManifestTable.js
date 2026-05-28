export const BREAKDOWN_MANIFEST_TABLE_COLUMNS = [
  'processing_status',
  'mawb_number',
  'hawb_number',
  'piece_count',
  'uld_code',
];

export const BREAKDOWN_MANIFEST_DEFAULT_VISIBLE_COLUMNS = [...BREAKDOWN_MANIFEST_TABLE_COLUMNS];

export const BREAKDOWN_MANIFEST_EDITABLE_COLUMNS = ['processing_status'];

export const BREAKDOWN_MANIFEST_TABLE_SETTINGS_STORAGE_KEY = 'ncaparser.breakdownManifestTable.settings';
export const BREAKDOWN_MANIFEST_DEFAULT_PAGE_SIZE = 25;
export const BREAKDOWN_MANIFEST_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export const BREAKDOWN_MANIFEST_COLUMN_TYPES = {
  piece_count: 'number',
};

export const BREAKDOWN_MANIFEST_COLUMN_LABELS = {
  processing_status: 'Status',
  mawb_number: 'MAWB',
  hawb_number: 'HAWB',
  piece_count: 'Pieces',
  uld_code: 'ULD',
};
