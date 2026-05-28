import DataTablePage from '../components/DataTablePage';
import { readJson } from '../lib/readJson';
import {
  OFFICE_OPERATION_COLUMN_LABELS,
  OFFICE_OPERATION_COLUMN_TYPES,
  OFFICE_OPERATION_DEFAULT_PAGE_SIZE,
  OFFICE_OPERATION_DEFAULT_VISIBLE_COLUMNS,
  OFFICE_OPERATION_EDITABLE_COLUMNS,
  OFFICE_OPERATION_ISC_OPTIONS,
  OFFICE_OPERATION_PAGE_SIZE_OPTIONS,
  OFFICE_OPERATION_TABLE_COLUMNS,
  OFFICE_OPERATION_TABLE_SETTINGS_STORAGE_KEY,
} from '../constants/officeOperationTable';

const COLUMN_SELECT_OPTIONS = {
  isc: OFFICE_OPERATION_ISC_OPTIONS,
};

function formatActualArrivalDateTime(value, fallbackDate) {
  const text = String(value || '').trim().toUpperCase();
  if (!text) return '';

  const fullDateMatch = text.match(/^(\d{2}[A-Z]{3})\s+(\d{2}):?(\d{2})$/);
  if (fullDateMatch) {
    return `${fullDateMatch[1]} ${fullDateMatch[2]}:${fullDateMatch[3]}`;
  }

  const dayOnlyMatch = text.match(/^(\d{2})\s+(\d{2}):?(\d{2})$/);
  if (dayOnlyMatch) {
    const fallback = String(fallbackDate || '').trim().toUpperCase();
    const fallbackMatch = fallback.match(/^(\d{2})([A-Z]{3})$/);
    const day = dayOnlyMatch[1];
    const hh = dayOnlyMatch[2];
    const mm = dayOnlyMatch[3];
    if (fallbackMatch) {
      return `${day}${fallbackMatch[2]} ${hh}:${mm}`;
    }
    return `${day} ${hh}:${mm}`;
  }

  return text;
}

function transformOfficeOperationItems(items) {
  return items.map((item) => ({
    ...item,
    actual_arrival_datetime: formatActualArrivalDateTime(
      item?.actual_arrival_datetime,
      item?.scheduled_arrival_date
    ),
  }));
}

function buildOfficeOperationUpdates(items, originalItems) {
  const originalByMawb = new Map(
    originalItems.map((row) => [row.mawb_number, row])
  );

  const updates = [];
  for (const row of items) {
    const original = originalByMawb.get(row.mawb_number);
    if (!original) continue;

    const changes = {};
    for (const col of OFFICE_OPERATION_EDITABLE_COLUMNS) {
      const curr = row[col];
      const orig = original[col];
      if (curr !== orig) {
        changes[col] = curr ?? null;
      }
    }

    if (Object.keys(changes).length > 0) {
      updates.push({ mawb_number: row.mawb_number, changes });
    }
  }

  return updates;
}

async function saveOfficeOperationEdits({ items, originalItems }) {
  const updates = buildOfficeOperationUpdates(items, originalItems);
  if (updates.length === 0) return items;

  const response = await fetch('/api/reports/office-operation-table/batch', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ updates }),
  });
  const data = await readJson(response);

  if (!response.ok) {
    throw new Error(data?.message || 'Unable to save office operation edits');
  }

  return items;
}

function OfficeOperationPage() {
  return (
    <DataTablePage
      title="Office Operation"
      eyebrow="Office operation table"
      columns={OFFICE_OPERATION_TABLE_COLUMNS}
      defaultVisibleColumns={OFFICE_OPERATION_DEFAULT_VISIBLE_COLUMNS}
      columnTypes={OFFICE_OPERATION_COLUMN_TYPES}
      defaultPageSize={OFFICE_OPERATION_DEFAULT_PAGE_SIZE}
      pageSizeOptions={OFFICE_OPERATION_PAGE_SIZE_OPTIONS}
      storageKey={OFFICE_OPERATION_TABLE_SETTINGS_STORAGE_KEY}
      columnLabels={OFFICE_OPERATION_COLUMN_LABELS}
      columnSelectOptions={COLUMN_SELECT_OPTIONS}
      requiredColumns={['mawb_number']}
      fetchUrl="/api/reports/office-operation-table?limit=1000&offset=0"
      loadingText="Loading office operation rows..."
      fetchErrorText="Unable to load office operation rows"
      stickyColumn="mawb_number"
      rowIdField="office_operation_id"
      rowKeyFallbackField="mawb_number"
      rowKeyPrefix="oo-row"
      editableColumns={OFFICE_OPERATION_EDITABLE_COLUMNS}
      transformItems={transformOfficeOperationItems}
      onSaveEdits={saveOfficeOperationEdits}
    />
  );
}

export default OfficeOperationPage;
