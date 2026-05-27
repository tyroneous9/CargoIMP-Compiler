export function buildOrderedUpdates(items, originalItems, { idField, columnOrder, editableColumns }) {
  const editableSet = new Set(editableColumns);
  const originalById = new Map(
    originalItems
      .filter((row) => row && row[idField] !== null && row[idField] !== undefined)
      .map((row) => [row[idField], row])
  );

  const updates = [];
  const unsupportedColumns = new Set();

  for (const row of items) {
    if (!row) continue;
    const id = row[idField];
    if (id === null || id === undefined) continue;

    const original = originalById.get(id);
    if (!original) continue;

    const changes = {};
    for (const column of columnOrder) {
      if (column === idField) continue;

      const currentValue = row[column];
      const originalValue = original[column];
      if (currentValue === originalValue) continue;

      if (editableSet.has(column)) {
        changes[column] = currentValue;
      } else {
        unsupportedColumns.add(column);
      }
    }

    if (Object.keys(changes).length > 0) {
      updates.push({ id, changes });
    }
  }

  return { updates, unsupportedColumns: [...unsupportedColumns] };
}