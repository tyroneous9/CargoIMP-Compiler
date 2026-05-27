import DataTablePage from '../components/DataTablePage';
import {
  EMAIL_XXX_COLUMN_TYPES,
  EMAIL_XXX_DEFAULT_PAGE_SIZE,
  EMAIL_XXX_DEFAULT_VISIBLE_COLUMNS,
  EMAIL_XXX_PAGE_SIZE_OPTIONS,
  EMAIL_XXX_TABLE_COLUMNS,
  EMAIL_XXX_TABLE_SETTINGS_STORAGE_KEY,
} from '../constants/emailXxxTable';

const EMAIL_NOTIFICATION_COLUMNS = new Set([
  'has_rcf',
  'has_nfd',
  'has_dlv',
  'has_arrival_notice',
  'has_ready_for_pick_up',
  'has_delivery_complete',
]);

function renderEmailXxxCell(column, row) {
  if (EMAIL_NOTIFICATION_COLUMNS.has(column)) {
    return row[column] ? 'YES' : 'NO';
  }
  return undefined;
}

function EmailXxxTablePage() {
  return (
    <DataTablePage
      title="Email XXX"
      eyebrow="Email notification matrix"
      columns={EMAIL_XXX_TABLE_COLUMNS}
      defaultVisibleColumns={EMAIL_XXX_DEFAULT_VISIBLE_COLUMNS}
      columnTypes={EMAIL_XXX_COLUMN_TYPES}
      defaultPageSize={EMAIL_XXX_DEFAULT_PAGE_SIZE}
      pageSizeOptions={EMAIL_XXX_PAGE_SIZE_OPTIONS}
      storageKey={EMAIL_XXX_TABLE_SETTINGS_STORAGE_KEY}
      fetchUrl="/api/reports/email-xxx-table?limit=1000&offset=0"
      loadingText="Loading email_xxx rows..."
      fetchErrorText="Unable to load email_xxx rows"
      stickyColumn="mawb_number"
      rowIdField="fwb_master_id"
      rowKeyFallbackField="mawb_number"
      rowKeyPrefix="email-xxx-row"
      statusUpdateUrl={(id) => `/api/reports/mawbs/${id}/processing-status`}
      renderCell={renderEmailXxxCell}
    />
  );
}

export default EmailXxxTablePage;
