import DataTablePage from '../components/DataTablePage';
import {
  HAWB_COLUMN_TYPES,
  HAWB_DEFAULT_PAGE_SIZE,
  HAWB_DEFAULT_VISIBLE_COLUMNS,
  HAWB_FETCH_ERROR_TEXT,
  HAWB_FETCH_URL,
  HAWB_LOADING_TEXT,
  HAWB_PAGE_SIZE_OPTIONS,
  HAWB_ROW_ID_FIELD,
  HAWB_ROW_KEY_FALLBACK_FIELD,
  HAWB_ROW_KEY_PREFIX,
  HAWB_STICKY_COLUMN,
  HAWB_TABLE_COLUMNS,
  HAWB_TABLE_SETTINGS_STORAGE_KEY,
} from '../constants/hawbTable';

function HawbTablePage() {
  return (
    <DataTablePage
      title="HAWB Table"
      eyebrow="HAWB table page"
      columns={HAWB_TABLE_COLUMNS}
      defaultVisibleColumns={HAWB_DEFAULT_VISIBLE_COLUMNS}
      columnTypes={HAWB_COLUMN_TYPES}
      defaultPageSize={HAWB_DEFAULT_PAGE_SIZE}
      pageSizeOptions={HAWB_PAGE_SIZE_OPTIONS}
      storageKey={HAWB_TABLE_SETTINGS_STORAGE_KEY}
      fetchUrl={HAWB_FETCH_URL}
      loadingText={HAWB_LOADING_TEXT}
      fetchErrorText={HAWB_FETCH_ERROR_TEXT}
      stickyColumn={HAWB_STICKY_COLUMN}
      rowIdField={HAWB_ROW_ID_FIELD}
      rowKeyFallbackField={HAWB_ROW_KEY_FALLBACK_FIELD}
      rowKeyPrefix={HAWB_ROW_KEY_PREFIX}
      statusUpdateUrl={(id) => `/api/reports/hawbs/${id}/processing-status`}
    />
  );
}

export default HawbTablePage;
