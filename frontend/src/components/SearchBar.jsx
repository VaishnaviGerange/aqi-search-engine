import React, { useState, useEffect, useRef } from 'react';

const LS_KEY = 'aqi_recent';

export default function SearchBar({ onSearch }) {
  const [q, setQ] = useState('');
  const [recent, setRecent] = useState([]);
  const [openRecent, setOpenRecent] = useState(false);
  const [focused, setFocused] = useState(false);
  const wrapperRef = useRef();

  useEffect(() => {
    // load recent from localStorage
    try {
      const r = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
      setRecent(Array.isArray(r) ? r : []);
    } catch {
      setRecent([]);
    }

    // click-away handler for dropdown
    function onDocClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpenRecent(false);
      }
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  function saveRecent(term) {
    try {
      const curr = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
      const filtered = (curr || []).filter(r => r.toLowerCase() !== term.toLowerCase());
      const updated = [term, ...filtered].slice(0, 8);
      localStorage.setItem(LS_KEY, JSON.stringify(updated));
      setRecent(updated);
    } catch {
      // ignore
    }
  }

  function submit() {
    const term = q.trim();
    if (!term) return;
    if (onSearch) onSearch(term);
    saveRecent(term);
    setOpenRecent(false);
  }

  function pickRecent(term) {
    setQ(term);
    if (onSearch) onSearch(term);
    saveRecent(term);
    setOpenRecent(false);
  }

  function clearRecent(e) {
    e.stopPropagation();
    localStorage.removeItem(LS_KEY);
    setRecent([]);
    setOpenRecent(false);
  }

  return (
    <div className="search-wrapper" ref={wrapperRef}>
      <div className="search-left">
        <h2 className="search-title">AQI Search</h2>
        <p className="search-sub" aria-hidden>Type city name (e.g., Delhi, Mumbai, London)</p>
      </div>

      <div className="search-controls">
        <div className={`search-box glass ${focused ? 'focused' : ''}`} role="search">
          <span className="icon" aria-hidden>🔎</span>

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="Try: Delhi, Mumbai, London..."
            aria-label="Search city"
            onFocus={() => { setFocused(true); setOpenRecent(true); }}
            onBlur={() => setFocused(false)}
          />

          <button
            className="btn"
            onClick={submit}
            aria-label="Search"
            title="Search"
          >
            Search
          </button>

          {/* Recent dropdown */}
          {openRecent && recent && recent.length > 0 && (
            <div className="recent-dropdown" role="list" aria-label="Recent searches">
              <div className="recent-header">
                <div>Recent</div>
                <button className="recent-clear" onClick={clearRecent} title="Clear recent">Clear</button>
              </div>

              <div className="recent-list">
                {recent.map(r => (
                  <button key={r} className="recent-item" onClick={() => pickRecent(r)} role="listitem">
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
