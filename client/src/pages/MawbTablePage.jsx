import DataTablePage from '../components/DataTablePage';
import {
  MAWB_COLUMN_TYPES,
  MAWB_DEFAULT_PAGE_SIZE,
  MAWB_DEFAULT_VISIBLE_COLUMNS,
  MAWB_PAGE_SIZE_OPTIONS,
  MAWB_TABLE_COLUMNS,
  MAWB_TABLE_SETTINGS_STORAGE_KEY,
} from '../constants/mawbTable';

const MAWB_NOTIFICATION_COLUMNS = new Set([
  'has_rcf',
  'has_delivery_complete',
  'has_ready_for_pick_up',
  'has_dlv',
  'has_nfd',
]);

function renderMawbCell(column, row) {
  if (MAWB_NOTIFICATION_COLUMNS.has(column)) {
    return row[column] ? 'YES' : 'NO';
  }
  return undefined;
}

function MawbTablePage() {
  return (
    <DataTablePage
      title="MAWB Table"
      eyebrow="MAWB table page"
      columns={MAWB_TABLE_COLUMNS}
      defaultVisibleColumns={MAWB_DEFAULT_VISIBLE_COLUMNS}
      columnTypes={MAWB_COLUMN_TYPES}
      defaultPageSize={MAWB_DEFAULT_PAGE_SIZE}
      pageSizeOptions={MAWB_PAGE_SIZE_OPTIONS}
      storageKey={MAWB_TABLE_SETTINGS_STORAGE_KEY}
      requiredColumns={['scheduled_arrival_date']}
      fetchUrl="/api/reports/mawbs-table?limit=1000&offset=0"
      loadingText="Loading MAWB rows..."
      fetchErrorText="Unable to load MAWB rows"
      stickyColumn="mawb_number"
      rowIdField="fwb_master_id"
      rowKeyFallbackField="mawb_number"
      rowKeyPrefix="mawb-row"
      statusUpdateUrl={(id) => `/api/reports/mawbs/${id}/processing-status`}
      renderCell={renderMawbCell}
    />
  );
}

export default MawbTablePage;
