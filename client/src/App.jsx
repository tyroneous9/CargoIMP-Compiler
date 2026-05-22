import { useEffect, useMemo, useState } from 'react';

const dashboardCards = [
  {
    title: 'Backend health',
    description: 'Checks the live API and database connection through /api/health.',
  },
  {
    title: 'Pipeline runs',
    description: 'Shows the latest ingestion run history from the backend.',
  },
  {
    title: 'Cargo reports',
    description: 'Exposes MAWB, ULD, and HAWB list endpoints for the UI.',
  },
];

async function readJson(response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return { raw: text };
  }
}

function App() {
  const [health, setHealth] = useState({ state: 'loading', data: null, error: '' });
  const [runs, setRuns] = useState({ state: 'loading', data: [], error: '' });
  const [reports, setReports] = useState({ state: 'loading', data: {}, error: '' });

  useEffect(() => {
    let cancelled = false;

    async function loadHealth() {
      try {
        const response = await fetch('/api/health');
        const data = await readJson(response);
        if (!cancelled) {
          setHealth({ state: response.ok ? 'ready' : 'error', data, error: response.ok ? '' : data?.message || 'Health check failed' });
        }
      } catch (error) {
        if (!cancelled) {
          setHealth({ state: 'error', data: null, error: error.message });
        }
      }
    }

    async function loadRuns() {
      try {
        const response = await fetch('/api/pipeline/runs?limit=5&offset=0');
        const data = await readJson(response);
        if (!cancelled) {
          setRuns({ state: response.ok ? 'ready' : 'error', data: Array.isArray(data?.items) ? data.items : [], error: response.ok ? '' : data?.message || 'Unable to load runs' });
        }
      } catch (error) {
        if (!cancelled) {
          setRuns({ state: 'error', data: [], error: error.message });
        }
      }
    }

    async function loadReports() {
      try {
        const [mawbsResponse, uldsResponse, hawbsResponse] = await Promise.all([
          fetch('/api/reports/mawbs?limit=5&offset=0'),
          fetch('/api/reports/ulds?limit=5&offset=0'),
          fetch('/api/reports/hawbs?limit=5&offset=0'),
        ]);
        const [mawbs, ulds, hawbs] = await Promise.all([
          readJson(mawbsResponse),
          readJson(uldsResponse),
          readJson(hawbsResponse),
        ]);
        if (!cancelled) {
          setReports({
            state: mawbsResponse.ok && uldsResponse.ok && hawbsResponse.ok ? 'ready' : 'error',
            data: {
              mawbs: Array.isArray(mawbs?.items) ? mawbs.items : [],
              ulds: Array.isArray(ulds?.items) ? ulds.items : [],
              hawbs: Array.isArray(hawbs?.items) ? hawbs.items : [],
            },
            error: mawbsResponse.ok && uldsResponse.ok && hawbsResponse.ok ? '' : 'One or more report endpoints failed',
          });
        }
      } catch (error) {
        if (!cancelled) {
          setReports({ state: 'error', data: { mawbs: [], ulds: [], hawbs: [] }, error: error.message });
        }
      }
    }

    loadHealth();
    loadRuns();
    loadReports();

    return () => {
      cancelled = true;
    };
  }, []);

  const statusLabel = useMemo(() => {
    if (health.state === 'loading') return 'Checking backend';
    if (health.state === 'ready') return 'Backend connected';
    return 'Backend unavailable';
  }, [health.state]);

  return (
    <main className="shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">NCAParser client</p>
          <h1>Operational dashboard for parser output and pipeline status.</h1>
          <p className="lede">
            This Vite React frontend connects directly to the backend API and displays live health, recent pipeline runs, and core cargo reference lists.
          </p>
          <div className={`status-pill status-${health.state}`}>
            <span className="status-dot" />
            {statusLabel}
          </div>
        </div>
        <div className="hero-panel">
          <div className="panel-card accent">
            <span>API base</span>
            <strong>/api</strong>
          </div>
          <div className="panel-card">
            <span>Backend</span>
            <strong>{health.data?.database || 'unknown'}</strong>
          </div>
          <div className="panel-card">
            <span>Latest run</span>
            <strong>{runs.data?.[0]?.run_id || 'none yet'}</strong>
          </div>
        </div>
      </section>

      <section className="grid three-up">
        {dashboardCards.map((card) => (
          <article className="info-card" key={card.title}>
            <h2>{card.title}</h2>
            <p>{card.description}</p>
          </article>
        ))}
      </section>

      <section className="grid two-up">
        <article className="data-card">
          <div className="section-head">
            <h2>Health</h2>
            <span className={`chip chip-${health.state}`}>{health.state}</span>
          </div>
          {health.state === 'error' ? (
            <p className="error-text">{health.error}</p>
          ) : (
            <pre>{JSON.stringify(health.data, null, 2)}</pre>
          )}
        </article>

        <article className="data-card">
          <div className="section-head">
            <h2>Latest runs</h2>
            <span className={`chip chip-${runs.state}`}>{runs.state}</span>
          </div>
          {runs.state === 'error' ? (
            <p className="error-text">{runs.error}</p>
          ) : (
            <ul className="list">
              {runs.data.map((run) => (
                <li key={run.id}>
                  <strong>{run.run_id}</strong>
                  <span>{run.status} · {run.started_at}</span>
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>

      <section className="grid three-up">
        {[
          ['MAWB', reports.data.mawbs],
          ['ULD', reports.data.ulds],
          ['HAWB', reports.data.hawbs],
        ].map(([label, items]) => (
          <article className="data-card mini" key={label}>
            <div className="section-head">
              <h2>{label}</h2>
              <span className={`chip chip-${reports.state}`}>{reports.state}</span>
            </div>
            {reports.state === 'error' ? (
              <p className="error-text">{reports.error}</p>
            ) : (
              <ul className="tag-list">
                {items.map((item) => (
                  <li key={item.mawb_number || item.uld_code || item.hawb_number}>
                    {item.mawb_number || item.uld_code || item.hawb_number}
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </section>
    </main>
  );
}

export default App;
