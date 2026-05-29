function IndexPage() {
  return (
    <main className="page">
      <section className="hero-card">
        <p className="eyebrow">NCAParser frontend</p>
        <h1>Page Index</h1>
        <div className="index-grid">
          <a className="index-card" href="/new-messages">
            <h2>New Messages</h2>
          </a>
          <a className="index-card" href="/parse-errors">
            <h2>Parse Errors</h2>
          </a>
          <a className="index-card" href="/email-xxx-table">
            <h2>Email XXX</h2>
          </a>
          <a className="index-card" href="/hawb-table">
            <h2>HAWB Table</h2>
          </a>
          <a className="index-card" href="/mawb-table">
            <h2>MAWB Table</h2>
          </a>
          <a className="index-card" href="/uld-table">
            <h2>ULD Table</h2>
          </a>
          <a className="index-card" href="/office-operation">
            <h2>Office Operation</h2>
          </a>
          <a className="index-card" href="/breakdown-manifest">
            <h2>Breakdown Manifest</h2>
          </a>
          <a className="index-card" href="/pickup">
            <h2>Pickup</h2>
          </a>
        </div>
      </section>
    </main>
  );
}

export default IndexPage;