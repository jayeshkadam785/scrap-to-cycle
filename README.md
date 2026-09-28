# KabadiConnect

From Informal Collection to Formal Recycling. E-waste traceability platform for Kolhapur.

- `index.html` – E-Waste Intelligence Dashboard (Govt. Officer view): KPIs, trend chart, material donut, activity map, transactions, price trends, safety alerts
- `collector.html` – Collector Journey (mobile app flow): photo, AI material, weight, price intelligence, recyclers, digital passport (QR), payment
- `data.js` – shared data, icons, helpers
- `dashboard.js`, `collector.js`, `style.css`, `collector.css`

Transactions completed in the collector app are saved in the browser (localStorage) and appear in the dashboard's Recent Transactions.

## Run
Open `index.html` in a browser (internet needed for Chart.js, Leaflet map tiles, QR library, Inter font).

## Deploy
- Vercel: import the GitHub repo, no build settings needed.
- GitHub Pages: Settings > Pages > Deploy from branch > `main` / root.

## Prototype notes
- AI material detection is simulated (default PCB, 91% confidence, changeable via dropdown). Replace `render[2]` in `collector.js` with a call to your vision model or API.
- Prices, alerts and dashboard numbers are demo data in `data.js` and `dashboard.js`.
- Next step for production: Supabase (auth, lots, transactions tables) instead of localStorage.
