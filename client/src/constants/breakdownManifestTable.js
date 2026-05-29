export const BREAKDOWN_MANIFEST_TABLE_COLUMNS = [
  'archive_status',
  'mawb_number',
  'hawb_number',
  'piece_count',
  'uld_code',
];

export const BREAKDOWN_MANIFEST_DEFAULT_VISIBLE_COLUMNS = [...BREAKDOWN_MANIFEST_TABLE_COLUMNS];

export const BREAKDOWN_MANIFEST_EDITABLE_COLUMNS = ['archive_status'];

export const BREAKDOWN_MANIFEST_TABLE_SETTINGS_STORAGE_KEY = 'ncaparser.breakdownManifestTable.settings';
export const BREAKDOWN_MANIFEST_DEFAULT_PAGE_SIZE = 25;
export const BREAKDOWN_MANIFEST_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export const BREAKDOWN_MANIFEST_COLUMN_TYPES = {
  archive_status: 'boolean',
  piece_count: 'number',
};

