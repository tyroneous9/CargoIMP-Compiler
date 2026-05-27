import DataTablePage from '../components/DataTablePage';
import {
  EMAIL_XXX_COLUMN_TYPES,
  EMAIL_XXX_DEFAULT_PAGE_SIZE,
  EMAIL_XXX_DEFAULT_VISIBLE_COLUMNS,
  EMAIL_XXX_PAGE_SIZE_OPTIONS,
  EMAIL_XXX_TABLE_COLUMNS,
  EMAIL_XXX_TABLE_SETTINGS_STORAGE_KEY,
} from '../constants/emailXxxTable';

function EmailXxxTablePage() {
  return (
    <DataTablePage
      title="Email XXX Table"
      eyebrow="Email notification summary"
      columns={EMAIL_XXX_TABLE_COLUMNS}
      defaultVisibleColumns={EMAIL_XXX_DEFAULT_VISIBLE_COLUMNS}
      columnTypes={EMAIL_XXX_COLUMN_TYPES}
      defaultPageSize={EMAIL_XXX_DEFAULT_PAGE_SIZE}
      pageSizeOptions={EMAIL_XXX_PAGE_SIZE_OPTIONS}
      storageKey={EMAIL_XXX_TABLE_SETTINGS_STORAGE_KEY}
      fetchUrl="/api/reports/email-xxx-table?limit=1000&offset=0"
      loadingText="Loading Email XXX rows..."
      fetchErrorText="Unable to load Email XXX rows"
      stickyColumn="mawb_number"
      rowIdField="mawb_number"
      rowKeyFallbackField="mawb_number"
      rowKeyPrefix="email-xxx-row"
      statusUpdateUrl={() => ''}
    />
  );
}

export default EmailXxxTablePage;
