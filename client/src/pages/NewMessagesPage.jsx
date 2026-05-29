import { useEffect, useMemo, useState } from 'react';
import { readJson } from '../lib/readJson';

const NEW_MESSAGES_COLUMNS = [
  'record_type',
  'record_key',
  'archive_status',
  'description',
  'related_number',
  'origin_airport_code',
  'destination_airport_code',
  'created_at',
];
const NEW_MESSAGES_SETTINGS_STORAGE_KEY = 'ncaparser.newMessages.settings.v2';
const NEW_MESSAGES_DEFAULT_PAGE_SIZE = 25;
const NEW_MESSAGES_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

function NewMessagesPage() {
  const [state, setState] = useState({
    isLoading: true,
    items: [],
    error: '',
  });
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState({ column: '', direction: '' });
  const [visibleColumns, setVisibleColumns] = useState(NEW_MESSAGES_COLUMNS);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(NEW_MESSAGES_DEFAULT_PAGE_SIZE);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [archiving, setArchiving] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(NEW_MESSAGES_SETTINGS_STORAGE_KEY);
      if (!raw) {
        const legacyColumns = window.localStorage.getItem('ncaparser.newMessages.visibleColumns');
        if (legacyColumns) {
          const parsedLegacyColumns = JSON.parse(legacyColumns);
          if (Array.isArray(parsedLegacyColumns)) {
            const normalizedLegacyColumns = NEW_MESSAGES_COLUMNS.filter((column) => parsedLegacyColumns.includes(column));
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
        const normalized = NEW_MESSAGES_COLUMNS.filter((column) => parsed.visibleColumns.includes(column));
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

      if (Number.isInteger(parsed.pageSize) && NEW_MESSAGES_PAGE_SIZE_OPTIONS.includes(parsed.pageSize)) {
        setPageSize(parsed.pageSize);
      }
    } catch {
      setVisibleColumns(NEW_MESSAGES_COLUMNS);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        NEW_MESSAGES_SETTINGS_STORAGE_KEY,
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

    async function loadItems() {
      try {
        const response = await fetch('/api/reports/new-messages?limit=1000&offset=0');
        const data = await readJson(response);

        if (cancelled) {
          return;
        }

        if (!response.ok) {
          setState({
            isLoading: false,
            items: [],
            error: data?.message || 'Unable to load new messages',
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

    loadItems();

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

      return String(aRaw).localeCompare(String(bRaw), undefined, { numeric: true }) * direction;
    });

    return sorted;
  }, [state.items, filters, sort, visibleColumns]);

  const totalRows = rows.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * pageSize;
  const pageRows = rows.slice(pageStart, pageStart + pageSize);
  const selectableRows = pageRows.map((row) => ({
    ...row,
    rowKey: `${row.record_type}:${row.record_id}`,
  }));
  const selectedSet = useMemo(() => new Set(selectedKeys), [selectedKeys]);
  const allSelected = selectableRows.length > 0 && selectableRows.every((row) => selectedSet.has(row.rowKey));

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
    setVisibleColumns(NEW_MESSAGES_COLUMNS);
    setPage(1);
    setPageSize(NEW_MESSAGES_DEFAULT_PAGE_SIZE);
    setSelectedKeys([]);
  }

  function resetVisibleColumns() {
    setVisibleColumns(NEW_MESSAGES_COLUMNS);
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

      return NEW_MESSAGES_COLUMNS.filter((name) => next.includes(name));
    });
    setPage(1);
  }

  function goToPreviousPage() {
    setPage((current) => Math.max(1, current - 1));
  }

  function goToNextPage() {
    setPage((current) => Math.min(totalPages, current + 1));
  }

  function toggleRow(rowKey) {
    setSelectedKeys((current) => {
      if (current.includes(rowKey)) {
        return current.filter((key) => key !== rowKey);
      }
      return [...current, rowKey];
    });
  }

  function toggleAllRows() {
    if (allSelected) {
      setSelectedKeys((current) => current.filter((key) => !selectableRows.some((row) => row.rowKey === key)));
      return;
    }

    setSelectedKeys((current) => {
      const next = new Set(current);
      selectableRows.forEach((row) => next.add(row.rowKey));
      return Array.from(next);
    });
  }

  async function archiveSelected() {
    const selectedRecords = rows
      .map((row) => ({
        ...row,
        rowKey: `${row.record_type}:${row.record_id}`,
      }))
      .filter((row) => selectedSet.has(row.rowKey))
      .map((row) => ({
        recordType: row.record_type,
        recordId: row.record_id,
      }));

    if (selectedRecords.length === 0) {
      return;
    }

    setArchiving(true);

    try {
      const response = await fetch('/api/reports/new-messages/archive', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ records: selectedRecords }),
      });
      const data = await readJson(response);

      if (!response.ok) {
        throw new Error(data?.message || 'Unable to archive selected records');
      }

      setState((current) => ({
        ...current,
        items: current.items.filter((row) => !selectedSet.has(`${row.record_type}:${row.record_id}`)),
      }));
      setSelectedKeys([]);
    } catch (error) {
      window.alert(error.message);
    } finally {
      setArchiving(false);
    }
  }

  return (
    <main className="page page-wide">
      <section className="hero-card">
        <a className="page-link" href="/">Back to index</a>
        <p className="eyebrow">Queue</p>
        <h1>New Messages</h1>
        <p className="lede">All unprocessed ULD, MAWB, and HAWB base records in one queue.</p>

        <div className="page-config">
          <div className="panel-head">
            <h2>Unprocessed records</h2>
          </div>

          {state.error ? (
            <p className="error-text">{state.error}</p>
          ) : state.isLoading ? (
            <p className="muted-text">Loading new messages...</p>
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
                  <button
                    type="button"
                    className="clear-button"
                    onClick={archiveSelected}
                    disabled={selectedKeys.length === 0 || archiving}
                  >
                    {archiving ? 'Archiving...' : 'Archive'}
                  </button>
                </div>
                <div className="table-tools-right">
                  <span className="muted-text">Page {safePage} of {totalPages}</span>
                  <span className="muted-text">{selectedKeys.length} selected</span>
                  <label className="page-size-control">
                    <span>Rows</span>
                    <select
                      value={pageSize}
                      onChange={(event) => {
                        setPageSize(Number(event.target.value));
                        setPage(1);
                      }}
                    >
                      {NEW_MESSAGES_PAGE_SIZE_OPTIONS.map((option) => (
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
                  {NEW_MESSAGES_COLUMNS.map((column) => (
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
                <th className="sticky-column sticky-header checkbox-column">
                  <input type="checkbox" checked={allSelected} onChange={toggleAllRows} aria-label="Select all records" />
                </th>
                {visibleColumns.map((column) => (
                  <th key={column} className={column === 'record_type' ? 'sticky-header' : undefined}>
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
                <th className="sticky-column sticky-filter checkbox-column" />
                {visibleColumns.map((column) => (
                  <th key={`${column}-filter`}>
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
              {selectableRows.map((row) => (
                <tr key={row.rowKey}>
                  <td className="sticky-column sticky-cell checkbox-column">
                    <input
                      type="checkbox"
                      checked={selectedSet.has(row.rowKey)}
                      onChange={() => toggleRow(row.rowKey)}
                      aria-label={`Select ${row.record_type} ${row.record_key || row.record_id}`}
                    />
                  </td>
                  {visibleColumns.map((column) => (
                    <td key={`${row.rowKey}-${column}`}>
                      {row[column] ?? ''}
                    </td>
                  ))}
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td className="empty-cell" colSpan={visibleColumns.length + 1}>No unarchived records found.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        ) : null}
      </section>
    </main>
  );
}

export default NewMessagesPage;
