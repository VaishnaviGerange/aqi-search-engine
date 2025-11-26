import React from 'react';

export default function Legend({ compact = false }) {
  const bands = [
    { name: 'Good', max: 50, color: '#2e7d32' },
    { name: 'Moderate', max: 100, color: '#f9a825' },
    { name: 'Unhealthy S', max: 200, color: '#fb8c00' },
    { name: 'Unhealthy', max: 300, color: '#e53935' },
    { name: 'Hazardous', max: '500+', color: '#6a0040' },
  ];

  return (
    <div className={compact ? 'legend legend-compact' : 'legend'}>
      {bands.map(b => (
        <div key={b.name} className="legend-item">
          <span className="legend-swatch" style={{ background: b.color }} aria-hidden />
          <span className="legend-label">{b.name}{!compact && ` (≤ ${b.max})`}</span>
        </div>
      ))}
    </div>
  );
}
