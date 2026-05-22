import { useEffect, useState } from 'react';
import { readJson } from '../lib/readJson';

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

export default HealthPage;