import React, { useState, useEffect } from 'react';
import { getCityFeed } from '../api';

function aqiLevel(aqi) {
  if (aqi === '-' || aqi == null) return { text: 'Unknown', color: '#666' };
  const n = Number(aqi);
  if (n <= 50) return { text: 'Good', color: '#4caf50' };
  if (n <= 100) return { text: 'Moderate', color: '#ffeb3b' };
  if (n <= 200) return { text: 'Unhealthy for Sensitive', color: '#ff9800' };
  if (n <= 300) return { text: 'Unhealthy', color: '#f44336' };
  return { text: 'Hazardous', color: '#7e0023' };
}

export default function CityCard({ item }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // small mount animation trigger
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const uid = item.uid || item.station?.uid;
  const name = item.station?.name || item.station?.city || item.city?.name || item.title || item.name || 'Unknown location';
  const aqi = item.aqi ?? item.aqi;
  const level = aqiLevel(aqi);

  async function toggleDetails() {
    if (details) { setDetails(null); return; }
    if (!uid) return;
    setLoading(true);
    setDetails(null); // clear old details so skeleton shows
    try {
      const resp = await getCityFeed(uid);
      const d = resp.data?.data ? resp.data.data : resp.data;
      // small delay to show skeleton nicely
      await new Promise(r => setTimeout(r, 300));
      setDetails(d);
    } catch (err) {
      setDetails({ error: err });
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className={`citycard ${mounted ? 'enter' : ''}`}>
      <div className="citycard-top">
        <div className="citycard-title">{name}</div>

        <div
          className="aqi-pill-animated"
          style={{ borderColor: level.color }}
          aria-hidden
        >
          <div className="aqi-value-bubble" style={{ background: level.color }}>
            {aqi ?? '—'}
          </div>
          <div className="aqi-text-small">{level.text}</div>
        </div>
      </div>

      <div className="citycard-small">
        Dominant pollutant: <strong>{item.dominentpol || item.dominentPol || '—'}</strong>
      </div>

      <div className="citycard-actions">
        <button
          className="details-btn"
          onClick={toggleDetails}
          disabled={loading}
          aria-expanded={!!details}
        >
          {loading ? 'Loading…' : (details ? 'Hide details' : 'Details')}
        </button>
      </div>

      {/* skeleton while loading */}
      {loading && (
        <div className="citycard-details skeleton">
          <div className="s-line short" />
          <div className="s-line" />
          <div className="s-grid">
            <div className="s-box" />
            <div className="s-box" />
            <div className="s-box" />
          </div>
        </div>
      )}

      {/* details panel (animated expand) */}
      <div className={`citycard-details ${details ? 'open' : ''}`} aria-hidden={!details}>
        {details && details.error && <div className="error">Failed: {JSON.stringify(details.error)}</div>}

        {details && !details.error && (
          <>
            {details.time && <div>Last update: <strong>{details.time.s}</strong></div>}
            {details.city && <div>City: {details.city.name}</div>}

            {details.iaqi && (
              <div className="iaqi-grid">
                {Object.entries(details.iaqi).slice(0, 6).map(([k, v]) => (
                  <div key={k} className="iaqi-item">
                    <div className="iaqi-key">{k.toUpperCase()}</div>
                    <div className="iaqi-val">{v?.v ?? v ?? '—'}</div>
                  </div>
                ))}
              </div>
            )}

            {details.attributions && <div className="attrib">Source: {details.attributions.map(a => a.name).join(', ')}</div>}
          </>
        )}
      </div>
    </article>
  );
}
