function IndexPage() {
  return (
    <main className="page">
      <section className="hero-card">
        <p className="eyebrow">NCAParser frontend</p>
        <h1>Page Index</h1>
        <p className="lede">Use this page as the single entry point to navigate all available views.</p>

        <div className="index-grid">
          <a className="index-card" href="/health">
            <h2>Health</h2>
            <p>Backend status and health response payload.</p>
          </a>
          <a className="index-card" href="/mawb-table">
            <h2>MAWB Table</h2>
            <p>Interactive MAWB table with filters, sort, paging, and column controls.</p>
          </a>
          <a className="index-card" href="/uld-table">
            <h2>ULD Table</h2>
            <p>Interactive ULD table with filters, sort, paging, and column controls.</p>
          </a>
        </div>
      </section>
    </main>
  );
}

export default IndexPage;