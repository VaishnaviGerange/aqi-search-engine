const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

export async function searchCity(q) {
  const url = `${BACKEND}/api/aqi/search?q=${encodeURIComponent(q)}`;
  const r = await fetch(url);
  const j = await r.json();
  if (!r.ok) throw j;
  return j;
}

export async function getCityFeed(uid) {
  const url = `${BACKEND}/api/aqi/city/${uid}`;
  const r = await fetch(url);
  const j = await r.json();
  if (!r.ok) throw j;
  return j;
}

// dev helper to use mock endpoint if needed
export async function mockSearch() {
  const url = `${BACKEND}/api/aqi/mock`;
  const r = await fetch(url);
  const j = await r.json();
  if (!r.ok) throw j;
  return j;
}
