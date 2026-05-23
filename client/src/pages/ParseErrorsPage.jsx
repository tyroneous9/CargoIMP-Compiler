import { useEffect, useMemo, useState } from 'react';
import { readJson } from '../lib/readJson';

const PARSE_ERRORS_COLUMNS = [
  'id',
  'message_type',
  'parsed_at',
  'subject',
  'sender',
  'stderr',
];

const DEFAULT_PAGE_SIZE = 25;
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

function ParseErrorsPage() {
  const [state, setState] = useState({
    isLoading: true,
    items: [],
    error: '',
  });
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState({ column: 'parsed_at', direction: 'desc' });
  const [visibleColumns, setVisibleColumns] = useState(PARSE_ERRORS_COLUMNS);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [detail, setDetail] = useState({
    isLoading: false,
    item: null,
    error: '',
  });

  useEffect(() => {
    let cancelled = false;

    async function loadItems() {
      try {
        const response = await fetch('/api/messages?status=error&limit=1000&offset=0');
        const data = await readJson(response);

        if (cancelled) {
          return;
        }

        if (!response.ok) {
          setState({
            isLoading: false,
            items: [],
            error: data?.message || 'Unable to load parse errors',
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
    setSort({ column: 'parsed_at', direction: 'desc' });
    setVisibleColumns(PARSE_ERRORS_COLUMNS);
    setPage(1);
    setPageSize(DEFAULT_PAGE_SIZE);
  }

  function resetVisibleColumns() {
    setVisibleColumns(PARSE_ERRORS_COLUMNS);
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

      return PARSE_ERRORS_COLUMNS.filter((name) => next.includes(name));
    });
    setPage(1);
  }

  function goToPreviousPage() {
    setPage((current) => Math.max(1, current - 1));
  }

  function goToNextPage() {
    setPage((current) => Math.min(totalPages, current + 1));
  }

  function summarizeStderr(stderr) {
    if (!stderr) {
      return '';
    }
    const oneLine = String(stderr).replace(/\s+/g, ' ').trim();
    if (oneLine.length <= 180) {
      return oneLine;
    }
    return `${oneLine.slice(0, 177)}...`;
  }

  async function openDetail(id) {
    setDetail({
      isLoading: true,
      item: null,
      error: '',
    });

    try {
      const response = await fetch(`/api/messages/${id}`);
      const data = await readJson(response);

      if (!response.ok) {
        throw new Error(data?.message || 'Unable to load parse error detail');
      }

      setDetail({
        isLoading: false,
        item: data,
        error: '',
      });
    } catch (error) {
      setDetail({
        isLoading: false,
        item: null,
        error: error.message,
      });
    }
  }

  function closeDetail() {
    setDetail({
      isLoading: false,
      item: null,
      error: '',
    });
  }

  return (
    <main className="page page-wide">
      <section className="hero-card">
        <a className="page-link" href="/">Back to index</a>
        <p className="eyebrow">Operations</p>
        <h1>Parse Errors</h1>
        <p className="lede">Failed parser runs from messages_parsed with status=error.</p>

        <div className="page-config">
          <div className="panel-head">
            <h2>Error records</h2>
          </div>

          {state.error ? (
            <p className="error-text">{state.error}</p>
          ) : state.isLoading ? (
            <p className="muted-text">Loading parse errors...</p>
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
                      {PAGE_SIZE_OPTIONS.map((option) => (
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
                  {PARSE_ERRORS_COLUMNS.map((column) => (
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
                  <th key={column} className={column === 'id' ? 'sticky-column sticky-header' : undefined}>
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
                <th>actions</th>
              </tr>
              <tr>
                {visibleColumns.map((column) => (
                  <th key={`${column}-filter`} className={column === 'id' ? 'sticky-column sticky-filter' : undefined}>
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
                <th />
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row, index) => {
                const rowId = row.id;
                const rowKey = rowId || `parse-error-${index}`;

                return (
                  <tr key={rowKey}>
                    {visibleColumns.map((column) => (
                      <td key={`${rowKey}-${column}`} className={column === 'id' ? 'sticky-column sticky-cell' : undefined}>
                        {column === 'stderr' ? summarizeStderr(row.stderr) : row[column] ?? ''}
                      </td>
                    ))}
                    <td>
                      <button type="button" className="clear-button" onClick={() => openDetail(rowId)} disabled={!rowId}>
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 ? (
                <tr>
                  <td className="empty-cell" colSpan={visibleColumns.length + 1}>No parse errors found.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        ) : null}

        {detail.isLoading || detail.error || detail.item ? (
          <section className="panel" style={{ marginTop: 12 }}>
            <div className="panel-head">
              <h2>Error detail</h2>
              <button type="button" className="clear-button" onClick={closeDetail}>Close</button>
            </div>
            {detail.error ? <p className="error-text">{detail.error}</p> : null}
            {detail.isLoading ? <p className="muted-text">Loading error detail...</p> : null}
            {detail.item ? (
              <>
                <div className="info-grid" style={{ marginBottom: 12 }}>
                  <div className="info-box"><span>ID</span><strong>{detail.item.id}</strong></div>
                  <div className="info-box"><span>Type</span><strong>{detail.item.message_type}</strong></div>
                  <div className="info-box"><span>Parsed At</span><strong>{detail.item.parsed_at}</strong></div>
                </div>
                <h3>stderr</h3>
                <pre>{detail.item.stderr || '(empty)'}</pre>
                <h3 style={{ marginTop: 12 }}>stdout</h3>
                <pre>{detail.item.stdout || '(empty)'}</pre>
              </>
            ) : null}
          </section>
        ) : null}
      </section>
    </main>
  );
}

export default ParseErrorsPage;
