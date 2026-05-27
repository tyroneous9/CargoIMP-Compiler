import { useEffect, useMemo, useState } from 'react';
import { readJson } from '../lib/readJson';

const PROCESSING_STATUS_OPTIONS = ['new', 'complete'];

function withRequiredColumns(columns, allColumns, requiredColumns) {
  const set = new Set(columns);
  for (const required of requiredColumns) {
    set.add(required);
  }
  return allColumns.filter((column) => set.has(column));
}

/**
 * Reusable paginated data table with column visibility, sorting, filtering,
 * and per-row processing-status editing.
 *
 * @param {object} props
 * @param {string}   props.title
 * @param {string}   props.eyebrow
 * @param {string[]} props.columns              - Full ordered column list
 * @param {string[]} [props.defaultVisibleColumns] - Initial visible subset; defaults to all supported columns only when omitted
 * @param {object}   props.columnTypes          - Map of column name → 'number' | 'text'
 * @param {number}   props.defaultPageSize
 * @param {number[]} props.pageSizeOptions
 * @param {string}   props.storageKey           - localStorage key
 * @param {string[]} [props.requiredColumns]     - Columns that cannot be hidden
 * @param {string}   props.fetchUrl             - API endpoint URL
 * @param {string}   props.loadingText
 * @param {string}   props.fetchErrorText       - Fallback error when API gives no message
 * @param {string}   props.stickyColumn         - Column that gets sticky-column CSS class
 * @param {string}   props.rowIdField           - Row field used as the update ID
 * @param {string}   props.rowKeyFallbackField  - Row field used as key when rowIdField is absent
 * @param {string}   props.rowKeyPrefix         - Prefix for index-based fallback key
 * @param {function} props.statusUpdateUrl      - (id: string) => url string
 * @param {function} [props.transformItems]     - (items: object[]) => object[]
 * @param {function} [props.renderCell]         - (column: string, row: object) => node | undefined
 */
function DataTablePage({
  title,
  eyebrow,
  columns,
  defaultVisibleColumns,
  columnTypes,
  defaultPageSize,
  pageSizeOptions,
  storageKey,
  requiredColumns = [],
  fetchUrl,
  loadingText,
  fetchErrorText,
  stickyColumn,
  rowIdField,
  rowKeyFallbackField,
  rowKeyPrefix,
  statusUpdateUrl,
  transformItems,
  renderCell,
}) {
  const normalizedDefaultVisibleColumns = useMemo(() => {
    const configuredColumns = Array.isArray(defaultVisibleColumns)
      ? defaultVisibleColumns
      : columns;

    return withRequiredColumns(configuredColumns, columns, requiredColumns);
  }, [defaultVisibleColumns, columns, requiredColumns]);

  const [state, setState] = useState({
    isLoading: true,
    items: [],
    error: '',
  });
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState({ column: '', direction: '' });
  const [visibleColumns, setVisibleColumns] = useState(normalizedDefaultVisibleColumns);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // Load persisted settings from localStorage on mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) {
        return;
      }

      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') {
        return;
      }

      if (parsed.filters && typeof parsed.filters === 'object') {
        setFilters(parsed.filters);
      }

      if (parsed.sort && typeof parsed.sort === 'object') {
        setSort({
          column: typeof parsed.sort.column === 'string' ? parsed.sort.column : '',
          direction: parsed.sort.direction === 'desc' ? 'desc' : parsed.sort.direction === 'asc' ? 'asc' : '',
        });
      }

      if (Number.isInteger(parsed.page) && parsed.page > 0) {
        setPage(parsed.page);
      }

      if (Number.isInteger(parsed.pageSize) && pageSizeOptions.includes(parsed.pageSize)) {
        setPageSize(parsed.pageSize);
      }
    } catch {
      // Ignore malformed localStorage payloads.
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist settings to localStorage whenever they change.
  useEffect(() => {
    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({ filters, sort, page, pageSize })
      );
    } catch {
      // Ignore localStorage write failures.
    }
  }, [storageKey, filters, sort, page, pageSize]);

  // Fetch rows from the API.
  useEffect(() => {
    let cancelled = false;

    async function loadRows() {
      try {
        const response = await fetch(fetchUrl);
        const data = await readJson(response);

        if (cancelled) {
          return;
        }

        if (!response.ok) {
          setState({
            isLoading: false,
            items: [],
            error: data?.message || fetchErrorText,
          });
          return;
        }

        const rawItems = Array.isArray(data?.items) ? data.items : [];
        const items = transformItems ? transformItems(rawItems) : rawItems;

        setState({ isLoading: false, items, error: '' });
      } catch (error) {
        if (!cancelled) {
          setState({ isLoading: false, items: [], error: error.message });
        }
      }
    }

    loadRows();

    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rows = useMemo(() => {
    const filtered = state.items.filter((row) => {
      return visibleColumns.every((column) => {
        const query = (filters[column] || '').trim().toLowerCase();
        if (!query) return true;
        return String(row[column] ?? '').toLowerCase().includes(query);
      });
    });

    if (!sort.column || !sort.direction) {
      return filtered;
    }

    const direction = sort.direction === 'asc' ? 1 : -1;
    const columnType = columnTypes[sort.column] || 'text';
    return [...filtered].sort((a, b) => {
      const aRaw = a[sort.column];
      const bRaw = b[sort.column];

      if (aRaw === null || aRaw === undefined || aRaw === '') {
        return bRaw === null || bRaw === undefined || bRaw === '' ? 0 : 1;
      }
      if (bRaw === null || bRaw === undefined || bRaw === '') {
        return -1;
      }

      if (columnType === 'number') {
        const aNum = Number(aRaw);
        const bNum = Number(bRaw);
        if (Number.isNaN(aNum) && Number.isNaN(bNum)) return 0;
        if (Number.isNaN(aNum)) return 1;
        if (Number.isNaN(bNum)) return -1;
        return (aNum - bNum) * direction;
      }

      return String(aRaw).localeCompare(String(bRaw), undefined, { numeric: true }) * direction;
    });
  }, [state.items, filters, sort, visibleColumns, columnTypes]);

  const totalRows = rows.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * pageSize;
  const pageRows = rows.slice(pageStart, pageStart + pageSize);

  useEffect(() => {
    if (sort.column && !visibleColumns.includes(sort.column)) {
      setSort({ column: '', direction: '' });
    }
  }, [sort.column, visibleColumns]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  function onFilterChange(column, value) {
    setFilters((current) => ({ ...current, [column]: value }));
    setPage(1);
  }

  function onSortToggle(column) {
    setSort((current) => {
      if (current.column !== column) return { column, direction: 'asc' };
      if (current.direction === 'asc') return { column, direction: 'desc' };
      return { column: '', direction: '' };
    });
    setPage(1);
  }

  function clearAllControls() {
    setFilters({});
    setSort({ column: '', direction: '' });
    setVisibleColumns(normalizedDefaultVisibleColumns);
    setPage(1);
    setPageSize(defaultPageSize);
  }

  function resetVisibleColumns() {
    setVisibleColumns(normalizedDefaultVisibleColumns);
    setPage(1);
  }

  function toggleVisibleColumn(column) {
    setVisibleColumns((current) => {
      const hasColumn = current.includes(column);
      if (hasColumn && current.length === 1) return current;
      const next = hasColumn
        ? current.filter((name) => name !== column)
        : [...current, column];
      return columns.filter((name) => next.includes(name));
    });
    setPage(1);
  }

  async function updateProcessingStatus(rowId, processingStatus) {
    if (!rowId) return;

    try {
      const response = await fetch(statusUpdateUrl(rowId), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ processingStatus }),
      });
      const data = await readJson(response);

      if (!response.ok) {
        throw new Error(data?.message || 'Unable to update processing status');
      }

      setState((current) => ({
        ...current,
        items: current.items.map((item) => {
          if (item[rowIdField] !== rowId) return item;
          return { ...item, processing_status: data?.processing_status || processingStatus };
        }),
      }));
    } catch (error) {
      window.alert(error.message);
    }
  }

  function renderCellValue(column, row) {
    if (renderCell) {
      const custom = renderCell(column, row);
      if (custom !== undefined) return custom;
    }

    if (column === 'processing_status') {
      const rowId = row[rowIdField];
      return (
        <select
          value={row.processing_status || 'new'}
          onChange={(event) => updateProcessingStatus(rowId, event.target.value)}
          disabled={!rowId}
        >
          {PROCESSING_STATUS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );
    }

    return row[column] ?? '';
  }

  return (
    <main className="page page-wide">
      <section className="hero-card">
        <a className="page-link" href="/">Back to index</a>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <div className="page-config">
          <div className="panel-head">
            <h2>Configuration</h2>
          </div>

          {state.error ? (
            <p className="error-text">{state.error}</p>
          ) : state.isLoading ? (
            <p className="muted-text">{loadingText}</p>
          ) : (
            <>
              <div className="table-tools">
                <div className="table-tools-left">
                  <button type="button" className="clear-button" onClick={clearAllControls}>Reset Table</button>
                  <button type="button" className="clear-button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage <= 1}>
                    Prev
                  </button>
                  <button type="button" className="clear-button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages}>
                    Next
                  </button>
                </div>
                <div className="table-tools-right">
                  <span className="muted-text">Page {safePage} of {totalPages}</span>
                  <label className="page-size-control">
                    <span>Rows</span>
                    <select
                      value={pageSize}
                      onChange={(event) => {
                        setPageSize(Number(event.target.value));
                        setPage(1);
                      }}
                    >
                      {pageSizeOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
              <div className="column-controls">
                <div className="column-controls-head">
                  <strong>Visible columns</strong>
                  <button type="button" className="clear-button" onClick={resetVisibleColumns}>Reset columns</button>
                </div>
                <div className="column-checkbox-grid">
                  {columns.map((column) => (
                    <label key={column} className="column-checkbox-item">
                      <input
                        type="checkbox"
                        checked={visibleColumns.includes(column)}
                        onChange={() => toggleVisibleColumn(column)}
                      />
                      <span>{column}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {!state.isLoading && !state.error ? (
          <table className="sheet-table">
            <thead>
              <tr>
                {visibleColumns.map((column) => (
                  <th key={column} className={column === stickyColumn ? 'sticky-column sticky-header' : undefined}>
                    <button
                      type="button"
                      className={`sort-button ${sort.column === column ? 'active' : ''}`}
                      onClick={() => onSortToggle(column)}
                    >
                      {column}
                      <span className="sort-indicator">
                        {sort.column === column ? (sort.direction === 'asc' ? '↑' : '↓') : '↕'}
                      </span>
                    </button>
                  </th>
                ))}
              </tr>
              <tr>
                {visibleColumns.map((column) => (
                  <th
                    key={`${column}-filter`}
                    className={column === stickyColumn ? 'sticky-column sticky-filter' : undefined}
                  >
                    <input
                      className="filter-input"
                      type="text"
                      value={filters[column] || ''}
                      onChange={(event) => onFilterChange(column, event.target.value)}
                      placeholder="filter"
                      aria-label={`Filter ${column}`}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row, index) => {
                const rowId = row[rowIdField];
                const rowKey = rowId || row[rowKeyFallbackField] || `${rowKeyPrefix}-${index}`;
                return (
                  <tr key={rowKey}>
                    {visibleColumns.map((column) => (
                      <td
                        key={`${rowKey}-${column}`}
                        className={column === stickyColumn ? 'sticky-column sticky-cell' : undefined}
                      >
                        {renderCellValue(column, row)}
                      </td>
                    ))}
                  </tr>
                );
              })}
              {rows.length === 0 ? (
                <tr>
                  <td className="empty-cell" colSpan={visibleColumns.length}>No rows match current filters.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        ) : null}
      </section>
    </main>
  );
}

export default DataTablePage;
