import DataTablePage from '../components/DataTablePage';
import { readJson } from '../lib/readJson';
import { buildOrderedUpdates } from '../lib/tableEdits';
import {
  ULD_COLUMN_TYPES,
  ULD_DEFAULT_PAGE_SIZE,
  ULD_DEFAULT_VISIBLE_COLUMNS,
  ULD_EDITABLE_COLUMNS,
  ULD_PAGE_SIZE_OPTIONS,
  ULD_TABLE_COLUMNS,
  ULD_TABLE_SETTINGS_STORAGE_KEY,
} from '../constants/uldTable';

const MONTH_NAMES = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const MONTH_INDEX = {
  JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
  JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11,
};

function computeLastFreeDay(scheduledDepartureDate) {
  const text = String(scheduledDepartureDate || '').trim().toUpperCase();
  const match = text.match(/^(\d{2})([A-Z]{3})$/);
  if (!match) return '';

  const day = Number(match[1]);
  const month = MONTH_INDEX[match[2]];
  if (!Number.isInteger(day) || month === undefined) return '';

  const year = new Date().getUTCFullYear();
  const date = new Date(Date.UTC(year, month, day));
  if (Number.isNaN(date.getTime())) return '';

  date.setUTCDate(date.getUTCDate() + 2);
  const nextDay = String(date.getUTCDate()).padStart(2, '0');
  const nextMonth = MONTH_NAMES[date.getUTCMonth()];
  return `${nextDay}${nextMonth}`;
}

function transformUldItems(items) {
  return items.map((item) => ({
    ...item,
    last_free_day: computeLastFreeDay(item?.scheduled_departure_date),
  }));
}

async function saveUldEdits({ items, originalItems }) {
  const { updates, unsupportedColumns } = buildOrderedUpdates(items, originalItems, {
    idField: 'ffm_uld_id',
    columnOrder: ULD_TABLE_COLUMNS,
    editableColumns: ULD_EDITABLE_COLUMNS,
  });
  if (unsupportedColumns.length > 0) {
    throw new Error(`These fields cannot be saved: ${unsupportedColumns.join(', ')}`);
  }
  if (updates.length === 0) return items;

  const response = await fetch('/api/reports/ulds-table/batch', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ updates }),
  });
  const data = await readJson(response);

  if (!response.ok) {
    throw new Error(data?.message || 'Unable to save ULD edits');
  }

  return items;
}

function UldTablePage() {
  return (
    <DataTablePage
      title="ULD Table"
      eyebrow="ULD table page"
      columns={ULD_TABLE_COLUMNS}
      defaultVisibleColumns={ULD_DEFAULT_VISIBLE_COLUMNS}
      columnTypes={ULD_COLUMN_TYPES}
      defaultPageSize={ULD_DEFAULT_PAGE_SIZE}
      pageSizeOptions={ULD_PAGE_SIZE_OPTIONS}
      storageKey={ULD_TABLE_SETTINGS_STORAGE_KEY}
      requiredColumns={['last_free_day']}
      fetchUrl="/api/reports/ulds-table?limit=1000&offset=0"
      loadingText="Loading ULD rows..."
      fetchErrorText="Unable to load ULD rows"
      stickyColumn="uld_code"
      rowIdField="ffm_uld_id"
      rowKeyFallbackField="uld_code"
      rowKeyPrefix="uld-row"
      editableColumns={ULD_EDITABLE_COLUMNS}
      transformItems={transformUldItems}
      onSaveEdits={saveUldEdits}
    />
  );
}

export default UldTablePage;
