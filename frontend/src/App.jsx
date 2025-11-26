import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import CityCard from './components/CityCard';
import './styles.css';
import { searchCity } from './api';

export default function App() {
  const [results, setResults] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function doSearch(q) {
    if (!q || !q.trim()) return;
    setLoading(true);
    setResults(null);
    setError(null);
    try {
      const resp = await searchCity(q.trim());
      const data = resp.data?.data ? resp.data.data : resp.data;
      setMeta({ source: resp.source || 'vendor' });
      setResults(data);
    } catch (err) {
      setError(err?.data || err?.message || JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-container">
      {/* -------- HEADER -------- */}
      <header className="main-header">
        <h1 className="header-title">AQI Search</h1>
        <p className="header-subtitle">Search city name to view Air Quality Index data</p>
      </header>

      {/* -------- MAIN CONTENT -------- */}
      <main className="content-container">
        <section className="search-panel">
          <SearchBar onSearch={doSearch} />
          {meta && <div className="meta">Results (source: {meta.source})</div>}
        </section>

        {error && <div className="error-banner">
          Error: {typeof error === 'string' ? error : JSON.stringify(error)}
        </div>}

        <section className="results-area">
          {loading && <div className="loading">Searching…</div>}
          {results && results.length === 0 && <div className="empty">No matches found.</div>}

          <div className="grid">
            {results && results.map(item => (
              <CityCard key={item.uid || item.station?.uid || Math.random()} item={item} />
            ))}
          </div>
        </section>
      </main>

      {/* -------- FOOTER -------- */}
      <footer className="main-footer">
        © 2025 AirCheck • Real-time Air Quality Insights • Data powered by AQICN API
      </footer>
    </div>
  );
}
