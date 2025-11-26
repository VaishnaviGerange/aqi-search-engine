const express = require('express');
const axios = require('axios');

module.exports = (cache, { AQICN_TOKEN }) => {
  const router = express.Router();

  // Basic health endpoint for the API router
  router.get('/health', (req, res) => {
    try {
      const cacheSize = typeof cache.size === 'function' ? cache.size() : (cache.size || 0);
      res.json({ status: 'ok', cacheSize });
    } catch (err) {
      res.status(500).json({ status: 'error', message: err.message });
    }
  });

  // Helper: call AQICN search
  async function fetchSearch(city) {
    const url = `https://api.waqi.info/search/?token=${AQICN_TOKEN}&keyword=${encodeURIComponent(city)}`;
    const resp = await axios.get(url, { timeout: 8000 });
    return resp.data;
  }

  // Helper: call AQICN feed by uid
  async function fetchFeed(uid) {
    const url = `https://api.waqi.info/feed/@${uid}/?token=${AQICN_TOKEN}`;
    const resp = await axios.get(url, { timeout: 8000 });
    return resp.data;
  }

  // /search?q=city
  router.get('/search', async (req, res) => {
    try {
      const q = (req.query.q || '').trim();
      if (!q) return res.status(400).json({ error: 'Missing query param q' });

      const key = `search:${q.toLowerCase()}`;
      const cached = cache.get(key);
      if (cached) return res.json({ source: 'cache', data: cached });

      const data = await fetchSearch(q);
      // vendor returns { status: 'ok' | 'error', data: ... }
      cache.set(key, data);
      res.json({ source: 'vendor', data });
    } catch (err) {
      console.error('search error', err.message);
      res.status(500).json({ error: 'internal_server_error', details: err.message });
    }
  });

  // /city/:uid  -> feed for that station
  router.get('/city/:uid', async (req, res) => {
    try {
      const uid = req.params.uid;
      if (!uid) return res.status(400).json({ error: 'Missing uid parameter' });

      const key = `feed:${uid}`;
      const cached = cache.get(key);
      if (cached) return res.json({ source: 'cache', data: cached });

      const data = await fetchFeed(uid);
      cache.set(key, data);
      res.json({ source: 'vendor', data });
    } catch (err) {
      console.error('feed error', err.message);
      res.status(500).json({ error: 'internal_server_error', details: err.message });
    }
  });

  return router;
};
