export const EMAIL_XXX_TABLE_COLUMNS = [
  'archive_status',
  'carrier_flight_number',
  'scheduled_arrival_date',
  'mawb_number',
  'has_rcf',
  'has_nfd',
  'has_dlv',
  'has_arrival_notice',
  'has_ready_for_pick_up',
  'has_delivery_complete',
];

export const EMAIL_XXX_DEFAULT_VISIBLE_COLUMNS = [...EMAIL_XXX_TABLE_COLUMNS];

export const EMAIL_XXX_EDITABLE_COLUMNS = ['archive_status'];

export const EMAIL_XXX_TABLE_SETTINGS_STORAGE_KEY = 'ncaparser.emailXxxTable.settings';
export const EMAIL_XXX_DEFAULT_PAGE_SIZE = 25;
export const EMAIL_XXX_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export const EMAIL_XXX_COLUMN_TYPES = {
  archive_status: 'boolean',
};
