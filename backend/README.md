AQI Search – Air Quality Index Finder

A full-stack web application to search and view real-time AQI data for cities worldwide.
Built using Node.js + Express (backend) and React + Vite (frontend), featuring caching, modern UI, smooth animations, recent search history, and production-ready deployment flow.

🚀 Features
🔧 Backend (Node + Express)

Fetches AQI data from AQICN API

Implements LRU caching (max entries + TTL expiry)

Clean REST API:

/api/aqi/search?q=city

/api/aqi/city/:uid

/api/aqi/health

/api/aqi/mock (optional for dev)

Handles errors, timeouts, invalid tokens

Ready for deployment (can serve frontend build)

🎨 Frontend (React + Vite)

Modern, responsive UI

Glass-styled search bar with animations

Recent-search dropdown (stored in localStorage)

Animated AQI cards with expand/collapse details

IAQI metrics display

Smooth skeleton loading

Beautiful sky-blue theme + navy fixed header

Fully mobile friendly

📁 Project Structure
AQI-Search-Project/
├── backend/
│   ├── server.js
│   ├── cache.js
│   ├── routes/
│   │    └── aqi.js
│   ├── public/          # Frontend build goes here in production
│   └── package.json
└── frontend/
    ├── src/
    │    ├── App.jsx
    │    ├── api.js
    │    ├── components/
    │    └── styles.css
    ├── index.html
    ├── vite.config.js
    └── package.json

🔑 Prerequisites

Node.js (LTS recommended)

npm

AQICN API Token → get from:
https://aqicn.org/data-platform/token/

🖥️ Backend Setup (Local)

Open terminal:

cd backend


Create .env:

PORT=4000
AQICN_TOKEN=YOUR_TOKEN_HERE
CACHE_MAX_ENTRIES=200
CACHE_TTL_MS=600000


Install dependencies:

npm install


Start server:

npm run start


Test:

http://localhost:4000/api/aqi/health

🎨 Frontend Setup (Local)

Open another terminal:

cd frontend


Install packages:

npm install


Start dev server:

npm run dev


Visit:

http://localhost:5173

🏭 Production Mode (Backend Serves Frontend)

Build frontend:

cd frontend
npm run build


Copy dist → backend/public:

Start backend:

cd ../backend
npm run start


Open:

http://localhost:4000

🌐 API Endpoints
Method	Endpoint	Description
GET	/api/aqi/health	Health + cache info
GET	/api/aqi/search?q=city	Search AQI for a city
GET	/api/aqi/city/:uid	City feed by UID

Example:

curl "http://localhost:4000/api/aqi/search?q=delhi"

⚡ Caching

Implemented with LRU-cache

Avoids repeated vendor API calls

Configurable TTL (CACHE_TTL_MS) and size (CACHE_MAX_ENTRIES)

✨ Credits

Built by Vaishnavi Gerange
<<<<<<< HEAD
Feel free to customize, extend, or add features!
=======
Feel free to customize, extend, or add features!
>>>>>>> f9fe0c6 (Project cleanup: move gitignore to root, add README, remove backend gitignore/README)
