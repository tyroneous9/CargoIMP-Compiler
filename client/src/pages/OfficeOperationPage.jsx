import DataTablePage from '../components/DataTablePage';
import { readJson } from '../lib/readJson';
import {
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

function toMultilineList(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .join('\n');
}

function renderOfficeOperationCell(column, row, { isEditMode } = {}) {
  if (column === 'hold' && !isEditMode) {
    return row[column] ? 'CBP_HOLD' : '';
  }

  if (column !== 'hawb_number' && column !== 'uld_code' && column !== 'consignee_name') {
    return undefined;
  }

  return <span style={{ whiteSpace: 'pre-line' }}>{toMultilineList(row[column])}</span>;
}

const MONTH_INDEX = {
  JAN: 0,
  FEB: 1,
  MAR: 2,
  APR: 3,
  MAY: 4,
  JUN: 5,
  JUL: 6,
  AUG: 7,
  SEP: 8,
  OCT: 9,
  NOV: 10,
  DEC: 11,
};

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function parseLastFreeDay(rawValue) {
  const text = String(rawValue || '').trim().toUpperCase();
  const match = text.match(/^(\d{2})([A-Z]{3})$/);
  if (!match) return null;

  const day = Number(match[1]);
  const month = MONTH_INDEX[match[2]];
  if (!Number.isInteger(day) || month === undefined) return null;

  const year = new Date().getFullYear();
  const parsed = new Date(year, month, day);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

function computeStorageValue({ weightKg, hasDeliveryComplete, effectiveLastFreeDay }) {
  const weight = Number(weightKg);
  const isWeightMissing = !Number.isFinite(weight) || weight <= 0;

  // Google-sheet equivalent: IF(OR(F="", X<>""), "", ...)
  if (isWeightMissing || Boolean(hasDeliveryComplete)) {
    return '';
  }

  if (!effectiveLastFreeDay) {
    return '';
  }

  const today = startOfToday();
  // Google-sheet equivalent: IF(TODAY() < INT(C), "", ...)
  if (today < effectiveLastFreeDay) {
    return '';
  }

  const dailyRate = Math.max(300, Math.ceil(weight / 45) * 45);
  const days = Math.floor((today - effectiveLastFreeDay) / (24 * 60 * 60 * 1000)) + 1;
  return dailyRate * days;
}

function formatActualArrivalDateTime(value) {
  const text = String(value || '').trim().toUpperCase();
  if (!text) return '';

  const fullDateMatch = text.match(/^(\d{2}[A-Z]{3})\s+(\d{2}):?(\d{2})$/);
  if (fullDateMatch) {
    return `${fullDateMatch[1]} ${fullDateMatch[2]}:${fullDateMatch[3]}`;
  }

  const dayOnlyMatch = text.match(/^(\d{2})\s+(\d{2}):?(\d{2})$/);
  if (dayOnlyMatch) {
    const day = dayOnlyMatch[1];
    const hh = dayOnlyMatch[2];
    const mm = dayOnlyMatch[3];
    return `${day} ${hh}:${mm}`;
  }

  return text;
}

function transformOfficeOperationItems(items) {
  let latestNonEmptyLastFreeDay = null;

  return items.map((item) => {
    const parsedLastFreeDay = parseLastFreeDay(item?.last_free_day);
    if (parsedLastFreeDay) {
      latestNonEmptyLastFreeDay = parsedLastFreeDay;
    }

    const shouldArchive = String(item?.processing_status || '').toLowerCase() === 'archive';

    return {
      ...item,
      archive_status: shouldArchive ? true : item?.archive_status,
      actual_arrival_datetime: formatActualArrivalDateTime(item?.actual_arrival_datetime),
      storage: computeStorageValue({
        weightKg: item?.weight_kg,
        hasDeliveryComplete: item?.has_delivery_complete,
        effectiveLastFreeDay: latestNonEmptyLastFreeDay,
      }),
    };
  });
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
      nonNullableBooleanColumns={['p3']}
      transformItems={transformOfficeOperationItems}
      renderCell={renderOfficeOperationCell}
      onSaveEdits={saveOfficeOperationEdits}
      visualGroupByColumn="carrier_flight_number"
      visualGroupHeaderColumns={['carrier_flight_number', 'scheduled_departure_date', 'last_free_day']}
      disableVisualGroupingInEditMode={false}
    />
  );
}

export default OfficeOperationPage;
