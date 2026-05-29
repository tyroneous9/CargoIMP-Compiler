import DataTablePage from '../components/DataTablePage';
import { readJson } from '../lib/readJson';
import { buildOrderedUpdates } from '../lib/tableEdits';
import {
  PICKUP_COLUMN_TYPES,
  PICKUP_DEFAULT_PAGE_SIZE,
  PICKUP_DEFAULT_VISIBLE_COLUMNS,
  PICKUP_EDITABLE_COLUMNS,
  PICKUP_PAGE_SIZE_OPTIONS,
  PICKUP_STATUS_OPTIONS,
  PICKUP_TABLE_COLUMNS,
  PICKUP_TABLE_SETTINGS_STORAGE_KEY,
} from '../constants/pickupTable';

const COLUMN_SELECT_OPTIONS = {
  pickup_status: PICKUP_STATUS_OPTIONS,
};

async function savePickupEdits({ items, originalItems }) {
  const { updates, unsupportedColumns } = buildOrderedUpdates(items, originalItems, {
    idField: 'ffm_uld_id',
    columnOrder: PICKUP_TABLE_COLUMNS,
    editableColumns: PICKUP_EDITABLE_COLUMNS,
  });

  if (unsupportedColumns.length > 0) {
    throw new Error(`These fields cannot be saved: ${unsupportedColumns.join(', ')}`);
  }

  if (updates.length === 0) {
    return items;
  }

  const response = await fetch('/api/reports/pickup-table/batch', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ updates }),
  });
  const data = await readJson(response);

  if (!response.ok) {
    throw new Error(data?.message || 'Unable to save pickup edits');
  }

  return items;
}

function PickupPage() {
  return (
    <DataTablePage
      title="Pickup"
      eyebrow="Pickup table"
      columns={PICKUP_TABLE_COLUMNS}
      defaultVisibleColumns={PICKUP_DEFAULT_VISIBLE_COLUMNS}
      columnTypes={PICKUP_COLUMN_TYPES}
      defaultPageSize={PICKUP_DEFAULT_PAGE_SIZE}
      pageSizeOptions={PICKUP_PAGE_SIZE_OPTIONS}
      storageKey={PICKUP_TABLE_SETTINGS_STORAGE_KEY}
      columnSelectOptions={COLUMN_SELECT_OPTIONS}
      requiredColumns={['uld_code']}
      fetchUrl="/api/reports/pickup-table?limit=1000&offset=0"
      loadingText="Loading pickup rows..."
      fetchErrorText="Unable to load pickup rows"
      stickyColumn="uld_code"
      rowIdField="ffm_uld_id"
      rowKeyFallbackField="uld_code"
      rowKeyPrefix="pickup-row"
      editableColumns={PICKUP_EDITABLE_COLUMNS}
      onSaveEdits={savePickupEdits}
      visualGroupByColumn="carrier_flight_number"
      visualGroupHeaderColumns={[
        'carrier_flight_number',
        'scheduled_departure_date',
        'pickup_status',
      ]}
      disableVisualGroupingInEditMode={false}
    />
  );
}

export default PickupPage;
