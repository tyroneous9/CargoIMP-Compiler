import { useEffect, useState } from 'react';

async function readJson(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

function App() {
  const isTestPage = window.location.pathname === '/test';

  if (isTestPage) {
    return <UldTestPage />;
  }

  return <HealthPage />;
}

function HealthPage() {
  const [backend, setBackend] = useState({
    state: 'loading',
    data: null,
    error: '',
  });

  useEffect(() => {
    let cancelled = false;

    async function loadHealth() {
      try {
        const response = await fetch('/api/health');
        const data = await readJson(response);

        if (cancelled) {
          return;
        }

        if (!response.ok) {
          setBackend({
            state: 'error',
            data,
            error: data?.message || 'Health check failed',
          });
          return;
        }

        setBackend({
          state: 'ready',
          data,
          error: '',
        });
      } catch (error) {
        if (!cancelled) {
          setBackend({
            state: 'error',
            data: null,
            error: error.message,
          });
        }
      }
    }

    loadHealth();

    return () => {
      cancelled = true;
    };
  }, []);

  const statusText =
    backend.state === 'loading'
      ? 'Checking backend'
      : backend.state === 'ready'
        ? 'Backend online'
        : 'Backend unavailable';

  return (
    <main className="page">
      <section className="hero-card">
        <a className="page-link" href="/test">Go to ULD test table</a>
        <p className="eyebrow">NCAParser frontend</p>
        <h1>Frontend is live.</h1>
        <p className="lede">
          This page proves the Vite React app is running and shows the live backend health status.
        </p>

        <div className={`status-badge status-${backend.state}`}>
          <span className="status-dot" />
          {statusText}
        </div>

        <div className="info-grid">
          <div className="info-box">
            <span>Frontend</span>
            <strong>Vite + React</strong>
          </div>
          <div className="info-box">
            <span>API target</span>
            <strong>/api/health</strong>
          </div>
          <div className="info-box">
            <span>Backend</span>
            <strong>{backend.data?.database || 'loading'}</strong>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <h2>Health response</h2>
            <span className={`chip chip-${backend.state}`}>{backend.state}</span>
          </div>

          {backend.state === 'error' ? (
            <p className="error-text">{backend.error}</p>
          ) : backend.state === 'loading' ? (
            <p className="muted-text">Loading backend status...</p>
          ) : (
            <pre>{JSON.stringify(backend.data, null, 2)}</pre>
          )}
        </div>
      </section>
    </main>
  );
}

function UldTestPage() {
  const [state, setState] = useState({
    status: 'loading',
    items: [],
    error: '',
  });

  useEffect(() => {
    let cancelled = false;

    async function loadRows() {
      try {
        const response = await fetch('/api/reports/ulds-table?limit=1000&offset=0');
        const data = await readJson(response);

        if (cancelled) {
          return;
        }

        if (!response.ok) {
          setState({
            status: 'error',
            items: [],
            error: data?.message || 'Unable to load ULD rows',
          });
          return;
        }

        setState({
          status: 'ready',
          items: Array.isArray(data?.items) ? data.items : [],
          error: '',
        });
      } catch (error) {
        if (!cancelled) {
          setState({
            status: 'error',
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

  const columns = [
    'uld_code',
    'uld_detail_text',
    'carrier_flight_number',
    'scheduled_departure_date',
    'scheduled_departure_time',
    'departure_airport_code',
    'mawb_numbers',
    'awb_count',
    'mailbox',
    'source_uid',
    'source_parsed_message_id',
    'source_parsed_at',
  ];

  return (
    <main className="page page-wide">
      <section className="hero-card">
        <a className="page-link" href="/">Back to health page</a>
        <p className="eyebrow">Test page</p>
        <h1>ULD spreadsheet test</h1>
        <p className="lede">
          One row per unique ULD code. Columns include all ULD-related fields from the backend report dataset.
        </p>

        <div className="panel">
          <div className="panel-head">
            <h2>Rows</h2>
            <span className={`chip chip-${state.status}`}>{state.status}</span>
          </div>

          {state.status === 'error' ? (
            <p className="error-text">{state.error}</p>
          ) : state.status === 'loading' ? (
            <p className="muted-text">Loading ULD rows...</p>
          ) : (
            <>
              <p className="muted-text">Total unique ULD rows: {state.items.length}</p>
              <div className="table-wrap">
                <table className="sheet-table">
                  <thead>
                    <tr>
                      {columns.map((column) => (
                        <th key={column}>{column}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {state.items.map((row) => (
                      <tr key={row.uld_code}>
                        {columns.map((column) => (
                          <td key={`${row.uld_code}-${column}`}>{row[column] ?? ''}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export default App;
