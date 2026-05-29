import DataTablePage from '../components/DataTablePage';
import { readJson } from '../lib/readJson';
import {
  BREAKDOWN_MANIFEST_COLUMN_TYPES,
  BREAKDOWN_MANIFEST_DEFAULT_PAGE_SIZE,
  BREAKDOWN_MANIFEST_DEFAULT_VISIBLE_COLUMNS,
  BREAKDOWN_MANIFEST_EDITABLE_COLUMNS,
  BREAKDOWN_MANIFEST_PAGE_SIZE_OPTIONS,
  BREAKDOWN_MANIFEST_TABLE_COLUMNS,
  BREAKDOWN_MANIFEST_TABLE_SETTINGS_STORAGE_KEY,
} from '../constants/breakdownManifestTable';

function toMultilineList(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .join('\n');
}

function renderBreakdownCell(column, row) {
  if (column !== 'hawb_number' && column !== 'uld_code') {
    return undefined;
  }

  return <span style={{ whiteSpace: 'pre-line' }}>{toMultilineList(row[column])}</span>;
}

function buildBreakdownManifestUpdates(items, originalItems) {
  const originalById = new Map(
    originalItems.map((row) => [row.fwb_master_id, row])
  );

  const updates = [];
  for (const row of items) {
    const original = originalById.get(row.fwb_master_id);
    if (!original) continue;

    if (row.archive_status !== original.archive_status) {
      updates.push({
        id: row.fwb_master_id,
        changes: { archive_status: row.archive_status ?? false },
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
      requiredColumns={['mawb_number']}
      fetchUrl="/api/reports/breakdown-manifest-table?limit=1000&offset=0"
      loadingText="Loading breakdown manifest rows..."
      fetchErrorText="Unable to load breakdown manifest rows"
      stickyColumn="mawb_number"
      rowIdField="fwb_master_id"
      rowKeyFallbackField="mawb_number"
      rowKeyPrefix="breakdown-row"
      editableColumns={BREAKDOWN_MANIFEST_EDITABLE_COLUMNS}
      renderCell={renderBreakdownCell}
      onSaveEdits={saveBreakdownManifestEdits}
    />
  );
}

export default BreakdownManifestPage;
