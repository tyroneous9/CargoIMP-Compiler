import { useEffect, useMemo, useState } from 'react';
import { readJson } from '../lib/readJson';
import {
  HAWB_COLUMN_TYPES,
  HAWB_DEFAULT_PAGE_SIZE,
  HAWB_PAGE_SIZE_OPTIONS,
  HAWB_TABLE_COLUMNS,
  HAWB_TABLE_SETTINGS_STORAGE_KEY,
} from '../constants/hawbTable';

const PROCESSING_STATUS_OPTIONS = ['new', 'complete'];

function HawbTablePage() {
  const [state, setState] = useState({
    isLoading: true,
    items: [],
    error: '',
  });
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState({ column: '', direction: '' });
  const [visibleColumns, setVisibleColumns] = useState(HAWB_TABLE_COLUMNS);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(HAWB_DEFAULT_PAGE_SIZE);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(HAWB_TABLE_SETTINGS_STORAGE_KEY);
      if (!raw) {
        const legacyColumns = window.localStorage.getItem('ncaparser.hawbTable.visibleColumns');
        if (legacyColumns) {
          const parsedLegacyColumns = JSON.parse(legacyColumns);
          if (Array.isArray(parsedLegacyColumns)) {
            const normalizedLegacyColumns = HAWB_TABLE_COLUMNS.filter((column) => parsedLegacyColumns.includes(column));
            if (normalizedLegacyColumns.length > 0) {
              setVisibleColumns(normalizedLegacyColumns);
            }
          }
        }
        return;
      }

      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') {
        return;
      }

      if (Array.isArray(parsed.visibleColumns)) {
        const normalized = HAWB_TABLE_COLUMNS.filter((column) => parsed.visibleColumns.includes(column));
        if (normalized.length > 0) {
          setVisibleColumns(normalized);
        }
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

      if (Number.isInteger(parsed.pageSize) && HAWB_PAGE_SIZE_OPTIONS.includes(parsed.pageSize)) {
        setPageSize(parsed.pageSize);
      }
    } catch {
      setVisibleColumns(HAWB_TABLE_COLUMNS);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        HAWB_TABLE_SETTINGS_STORAGE_KEY,
        JSON.stringify({
          visibleColumns,
          filters,
          sort,
          page,
          pageSize,
        })
      );
    } catch {
      // Ignore localStorage write failures.
    }
  }, [visibleColumns, filters, sort, page, pageSize]);

  useEffect(() => {
    let cancelled = false;

    async function loadRows() {
      try {
        const response = await fetch('/api/reports/hawbs-table?limit=1000&offset=0');
        const data = await readJson(response);

        if (cancelled) {
          return;
        }

        if (!response.ok) {
          setState({
            isLoading: false,
            items: [],
            error: data?.message || 'Unable to load HAWB rows',
          });
          return;
        }

        setState({
          isLoading: false,
          items: Array.isArray(data?.items) ? data.items : [],
          error: '',
        });
      } catch (error) {
        if (!cancelled) {
          setState({
            isLoading: false,
            items: [],
            error: error.message,
          });
        }
      }
    }

    loadRows();

    return () => {
      cancelled = true;
    };
  }, []);

  const rows = useMemo(() => {
    const filtered = state.items.filter((row) => {
      return visibleColumns.every((column) => {
        const query = (filters[column] || '').trim().toLowerCase();
        if (!query) {
          return true;
        }
        const value = String(row[column] ?? '').toLowerCase();
        return value.includes(query);
      });
    });

    if (!sort.column || !sort.direction) {
      return filtered;
    }

    const direction = sort.direction === 'asc' ? 1 : -1;
    const columnType = HAWB_COLUMN_TYPES[sort.column] || 'text';
    const sorted = [...filtered].sort((a, b) => {
      const aRaw = a[sort.column];
      const bRaw = b[sort.column];

      if (aRaw === null || aRaw === undefined || aRaw === '') {
        if (bRaw === null || bRaw === undefined || bRaw === '') return 0;
        return 1;
      }

      if (bRaw === null || bRaw === undefined || bRaw === '') {
        return -1;
      }

      if (columnType === 'number') {
        const aNumber = Number(aRaw);
        const bNumber = Number(bRaw);
        if (Number.isNaN(aNumber) && Number.isNaN(bNumber)) return 0;
        if (Number.isNaN(aNumber)) return 1;
        if (Number.isNaN(bNumber)) return -1;
        return (aNumber - bNumber) * direction;
      }

      return String(aRaw).localeCompare(String(bRaw), undefined, { numeric: true }) * direction;
    });

    return sorted;
  }, [state.items, filters, sort, visibleColumns]);

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
    setFilters((current) => ({
      ...current,
      [column]: value,
    }));
    setPage(1);
  }

  function onSortToggle(column) {
    setSort((current) => {
      if (current.column !== column) {
        return { column, direction: 'asc' };
      }
      if (current.direction === 'asc') {
        return { column, direction: 'desc' };
      }
      return { column: '', direction: '' };
    });
    setPage(1);
  }

  function clearAllControls() {
    setFilters({});
    setSort({ column: '', direction: '' });
    setVisibleColumns(HAWB_TABLE_COLUMNS);
    setPage(1);
    setPageSize(HAWB_DEFAULT_PAGE_SIZE);
  }

  function resetVisibleColumns() {
    setVisibleColumns(HAWB_TABLE_COLUMNS);
    setPage(1);
  }

  function toggleVisibleColumn(column) {
    setVisibleColumns((current) => {
      const hasColumn = current.includes(column);

      if (hasColumn && current.length === 1) {
        return current;
      }

      const next = hasColumn
        ? current.filter((name) => name !== column)
        : [...current, column];

      return HAWB_TABLE_COLUMNS.filter((name) => next.includes(name));
    });
    setPage(1);
  }

  function goToPreviousPage() {
    setPage((current) => Math.max(1, current - 1));
  }

  function goToNextPage() {
    setPage((current) => Math.min(totalPages, current + 1));
  }

  async function updateProcessingStatus(fhlHouseId, processingStatus) {
    if (!fhlHouseId) {
      return;
    }

    try {
      const response = await fetch(`/api/reports/hawbs/${fhlHouseId}/processing-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ processingStatus }),
      });
      const data = await readJson(response);

      if (!response.ok) {
        throw new Error(data?.message || 'Unable to update HAWB processing status');
      }

      setState((current) => ({
        ...current,
        items: current.items.map((item) => {
          if (item.fhl_house_id !== fhlHouseId) {
            return item;
          }
          return {
            ...item,
            processing_status: data?.processing_status || processingStatus,
          };
        }),
      }));
    } catch (error) {
      window.alert(error.message);
    }
  }

  return (
    <main className="page page-wide">
      <section className="hero-card">
        <a className="page-link" href="/">Back to index</a>
        <p className="eyebrow">HAWB table page</p>
        <h1>HAWB Table</h1>
        <div className="page-config">
          <div className="panel-head">
            <h2>Configuration</h2>
          </div>

          {state.error ? (
            <p className="error-text">{state.error}</p>
          ) : state.isLoading ? (
            <p className="muted-text">Loading HAWB rows...</p>
          ) : (
            <>
              <div className="table-tools">
                <div className="table-tools-left">
                  <button type="button" className="clear-button" onClick={clearAllControls}>Reset Table</button>
                  <button type="button" className="clear-button" onClick={goToPreviousPage} disabled={safePage <= 1}>
                    Prev
                  </button>
                  <button type="button" className="clear-button" onClick={goToNextPage} disabled={safePage >= totalPages}>
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
                      {HAWB_PAGE_SIZE_OPTIONS.map((option) => (
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
                  {HAWB_TABLE_COLUMNS.map((column) => (
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
                  <th key={column} className={column === 'hawb_number' ? 'sticky-column sticky-header' : undefined}>
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
                    className={column === 'hawb_number' ? 'sticky-column sticky-filter' : undefined}
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
                const rowId = row.fhl_house_id;
                const rowKey = rowId || row.hawb_number || `hawb-row-${index}`;
                return (
                  <tr key={rowKey}>
                    {visibleColumns.map((column) => (
                      <td
                        key={`${rowKey}-${column}`}
                        className={column === 'hawb_number' ? 'sticky-column sticky-cell' : undefined}
                      >
                        {column === 'processing_status' ? (
                          <select
                            value={row.processing_status || 'new'}
                            onChange={(event) => updateProcessingStatus(rowId, event.target.value)}
                            disabled={!rowId}
                          >
                            {PROCESSING_STATUS_OPTIONS.map((statusOption) => (
                              <option key={statusOption} value={statusOption}>{statusOption}</option>
                            ))}
                          </select>
                        ) : (
                          row[column] ?? ''
                        )}
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

export default HawbTablePage;