import DataTablePage from '../components/DataTablePage';
import { readJson } from '../lib/readJson';
import {
  EMAIL_XXX_COLUMN_TYPES,
  EMAIL_XXX_DEFAULT_PAGE_SIZE,
  EMAIL_XXX_DEFAULT_VISIBLE_COLUMNS,
  EMAIL_XXX_EDITABLE_COLUMNS,
  EMAIL_XXX_PAGE_SIZE_OPTIONS,
  EMAIL_XXX_TABLE_COLUMNS,
  EMAIL_XXX_TABLE_SETTINGS_STORAGE_KEY,
} from '../constants/emailXxxTable';

function buildEmailXxxUpdates(items, originalItems) {
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

async function saveEmailXxxEdits({ items, originalItems }) {
  const updates = buildEmailXxxUpdates(items, originalItems);
  if (updates.length === 0) return items;

  const response = await fetch('/api/reports/mawbs-table/batch', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ updates }),
  });
  const data = await readJson(response);

  if (!response.ok) {
    throw new Error(data?.message || 'Unable to save Email XXX edits');
  }

  return items;
}

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
      rowIdField="fwb_master_id"
      rowKeyFallbackField="mawb_number"
      rowKeyPrefix="email-xxx-row"
      editableColumns={EMAIL_XXX_EDITABLE_COLUMNS}
      onSaveEdits={saveEmailXxxEdits}
    />
  );
}

export default EmailXxxTablePage;
