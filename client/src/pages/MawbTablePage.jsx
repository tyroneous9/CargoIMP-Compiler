import DataTablePage from '../components/DataTablePage';
import { readJson } from '../lib/readJson';
import { buildOrderedUpdates } from '../lib/tableEdits';
import {
  MAWB_COLUMN_TYPES,
  MAWB_DEFAULT_PAGE_SIZE,
  MAWB_DEFAULT_VISIBLE_COLUMNS,
  MAWB_EDITABLE_COLUMNS,
  MAWB_PAGE_SIZE_OPTIONS,
  MAWB_TABLE_COLUMNS,
  MAWB_TABLE_SETTINGS_STORAGE_KEY,
} from '../constants/mawbTable';

async function saveMawbEdits({ items, originalItems }) {
  const { updates, unsupportedColumns } = buildOrderedUpdates(items, originalItems, {
    idField: 'fwb_master_id',
    columnOrder: MAWB_TABLE_COLUMNS,
    editableColumns: MAWB_EDITABLE_COLUMNS,
  });
  if (unsupportedColumns.length > 0) {
    throw new Error(`These fields cannot be saved: ${unsupportedColumns.join(', ')}`);
  }
  if (updates.length === 0) return items;

  const response = await fetch('/api/reports/mawbs-table/batch', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ updates }),
  });
  const data = await readJson(response);

  if (!response.ok) {
    throw new Error(data?.message || 'Unable to save MAWB edits');
  }

  return items;
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
      editableColumns={MAWB_EDITABLE_COLUMNS}
      onSaveEdits={saveMawbEdits}
    />
  );
}

export default MawbTablePage;
