import DataTablePage from '../components/DataTablePage';
import { readJson } from '../lib/readJson';
import {
  BREAKDOWN_MANIFEST_COLUMN_LABELS,
  BREAKDOWN_MANIFEST_COLUMN_TYPES,
  BREAKDOWN_MANIFEST_DEFAULT_PAGE_SIZE,
  BREAKDOWN_MANIFEST_DEFAULT_VISIBLE_COLUMNS,
  BREAKDOWN_MANIFEST_EDITABLE_COLUMNS,
  BREAKDOWN_MANIFEST_PAGE_SIZE_OPTIONS,
  BREAKDOWN_MANIFEST_TABLE_COLUMNS,
  BREAKDOWN_MANIFEST_TABLE_SETTINGS_STORAGE_KEY,
} from '../constants/breakdownManifestTable';

function buildBreakdownManifestUpdates(items, originalItems) {
  const originalById = new Map(
    originalItems.map((row) => [row.fwb_master_id, row])
  );

  const updates = [];
  for (const row of items) {
    const original = originalById.get(row.fwb_master_id);
    if (!original) continue;

    if (row.processing_status !== original.processing_status) {
      updates.push({
        id: row.fwb_master_id,
        changes: { processing_status: row.processing_status ?? 'new' },
      });
    }
  }

  return updates;
}

async function saveBreakdownManifestEdits({ items, originalItems }) {
  const updates = buildBreakdownManifestUpdates(items, originalItems);
  if (updates.length === 0) return items;

  const response = await fetch('/api/reports/mawbs-table/batch', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ updates }),
  });
  const data = await readJson(response);

  if (!response.ok) {
    throw new Error(data?.message || 'Unable to save breakdown manifest edits');
  }

  return items;
}

function BreakdownManifestPage() {
  return (
    <DataTablePage
      title="Breakdown Manifest"
      eyebrow="Breakdown manifest table"
      columns={BREAKDOWN_MANIFEST_TABLE_COLUMNS}
      defaultVisibleColumns={BREAKDOWN_MANIFEST_DEFAULT_VISIBLE_COLUMNS}
      columnTypes={BREAKDOWN_MANIFEST_COLUMN_TYPES}
      defaultPageSize={BREAKDOWN_MANIFEST_DEFAULT_PAGE_SIZE}
      pageSizeOptions={BREAKDOWN_MANIFEST_PAGE_SIZE_OPTIONS}
      storageKey={BREAKDOWN_MANIFEST_TABLE_SETTINGS_STORAGE_KEY}
      columnLabels={BREAKDOWN_MANIFEST_COLUMN_LABELS}
      requiredColumns={['mawb_number']}
      fetchUrl="/api/reports/breakdown-manifest-table?limit=1000&offset=0"
      loadingText="Loading breakdown manifest rows..."
      fetchErrorText="Unable to load breakdown manifest rows"
      stickyColumn="mawb_number"
      rowIdField="fwb_master_id"
      rowKeyFallbackField="mawb_number"
      rowKeyPrefix="breakdown-row"
      editableColumns={BREAKDOWN_MANIFEST_EDITABLE_COLUMNS}
      onSaveEdits={saveBreakdownManifestEdits}
    />
  );
}

export default BreakdownManifestPage;
