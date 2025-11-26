require('dotenv').config();
const express = require('express');
const path = require('path');

const createCache = require('./cache');
const aqiRoutesFactory = require('./routes/aqi');

const app = express();
const PORT = process.env.PORT || 4000;

const AQICN_TOKEN = process.env.AQICN_TOKEN;

// Convert env values to numbers
const CACHE_MAX_ENTRIES = Number(process.env.CACHE_MAX_ENTRIES) || 200;
const CACHE_TTL_MS = Number(process.env.CACHE_TTL_MS) || 600000;

const cache = createCache({
  max: CACHE_MAX_ENTRIES,
  ttl: CACHE_TTL_MS
});

app.use(express.json());

// ------------------------------
// CORS (only for dev usage)
// ------------------------------
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// ------------------------------
// API ROUTES
// ------------------------------
app.use('/api/aqi', aqiRoutesFactory(cache, { AQICN_TOKEN }));

// ------------------------------
// SERVE FRONTEND BUILD (PRODUCTION)
// ------------------------------
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// IMPORTANT: If the request does NOT match an API route or static file,
// send frontend index.html (supports React Router if added later)
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// ------------------------------
// START SERVER
// ------------------------------
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
