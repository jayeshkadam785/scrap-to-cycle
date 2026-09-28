/* KabadiConnect – shared data + helpers (used by dashboard and collector app) */

const ICONS = {
  home: "M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z",
  recycle: "M21 12a9 9 0 1 1-3-6.7M21 4v5h-5",
  trend: "M3 17l6-6 4 4 8-8M15 7h6v6",
  users: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8",
  factory: "M2 20V9l6 4V9l6 4V5h4v15zM2 20h20",
  list: "M4 4h16v16H4zM8 9h8M8 13h8M8 17h5",
  pin: "M12 22s8-6 8-12a8 8 0 1 0-16 0c0 6 8 12 8 12zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4",
  chart: "M4 20V10M10 20V4M16 20v-8M22 20H2",
  alert: "M12 3l10 18H2zM12 10v5M12 18h.01",
  cog: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2",
  bell: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 0 0 4 0",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16M21 21l-4.3-4.3",
  camera: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8",
  back: "M15 18l-6-6 6-6",
  check: "M20 6L9 17l-5-5",
  image: "M3 3h18v18H3zM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M21 15l-5-5L5 21",
  bolt: "M13 2L3 14h9l-1 8 10-12h-9z",
  leaf: "M11 20A7 7 0 0 1 4 13c0-6 6-9 16-9 0 10-3 16-9 16zM4 21c3-5 6-8 11-11",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  wallet: "M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM16 14h2M4 7l12-4v4",
  down: "M6 9l6 6 6-6",
  right: "M9 6l6 6-6 6",
  up: "M12 19V5M5 12l7-7 7 7",
  dn: "M12 5v14M19 12l-7 7-7-7",
  alertc: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20M12 8v4M12 16h.01",
  calendar: "M3 5h18v16H3zM3 10h18M8 3v4M16 3v4",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20M12 6v6l4 2",
  doc: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h8",
  box: "M21 8l-9-5-9 5v8l9 5 9-5zM3 8l9 5 9-5M12 13v9",
  info: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20M12 16v-4M12 8h.01",
  minus: "M5 12h14",
  plus: "M12 5v14M5 12h14",
  truck: "M1 3h15v13H1zM16 8h4l3 3v5h-7zM5.5 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4M18.5 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8"
};

function icon(name, size = 18) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${ICONS[name] || ""}"/></svg>`;
}

function hydrateIcons(root = document) {
  root.querySelectorAll("i[data-i]").forEach((el) => {
    el.innerHTML = icon(el.dataset.i, +el.dataset.s || 18);
    el.classList.add("ic");
  });
}

/* Material price table (₹ per kg) */
const MATERIALS = {
  PCB:   { label: "PCB (Printed Circuit Board)", short: "PCB", min: 100, max: 115, change: 5,  conf: 91 },
  Cable: { label: "Cable & Wires", short: "Cable", min: 420, max: 510, change: 3,  conf: 93 },
  Battery: { label: "Battery", short: "Battery", min: 75, max: 105, change: -2, conf: 89 },
  LCD:   { label: "LCD / LED Screen", short: "LCD", min: 120, max: 160, change: 4,  conf: 90 },
  CRT:   { label: "CRT Monitor", short: "CRT", min: 60, max: 85, change: 1,  conf: 88 },
  Motor: { label: "Motor / Compressor", short: "Motor", min: 180, max: 240, change: 2, conf: 87 }
};

/* Authorized recyclers – offset is subtracted from the top of the material's price range */
const RECYCLERS = [
  { name: "GreenCycle Recyclers", km: 8,  rating: 4.8, reviews: 124, offset: 3,  pickup: true,  tag: "Best Match" },
  { name: "EcoZen Recyclers",     km: 12, rating: 4.5, reviews: 96,  offset: 7,  pickup: true,  tag: "Good Option" },
  { name: "Shree Recycle Hub",    km: 15, rating: 4.2, reviews: 76,  offset: 13, pickup: true,  tag: "Nearby" }
];

const SEED_TX = [
  { date: "28 Sep 2026", lot: "KC-2026-0145", material: "PCB", kg: 5.2, recycler: "EnviroRecyclers", status: "Completed" },
  { date: "27 Sep 2026", lot: "KC-2026-0144", material: "Cable", kg: 18.0, recycler: "GreenCycle", status: "Handover" },
  { date: "26 Sep 2026", lot: "KC-2026-0143", material: "Battery", kg: 12.0, recycler: "RecycleMart", status: "In Progress" },
  { date: "25 Sep 2026", lot: "KC-2026-0142", material: "LCD", kg: 8.5, recycler: "EcoTech", status: "Completed" },
  { date: "24 Sep 2026", lot: "KC-2026-0141", material: "Mixed E-Waste", kg: 15.0, recycler: "CleanEarth", status: "Completed" }
];

const TX_KEY = "kc_transactions";

function loadUserTx() {
  try { return JSON.parse(localStorage.getItem(TX_KEY)) || []; } catch (e) { return []; }
}
function saveUserTx(tx) {
  try {
    const all = loadUserTx();
    all.unshift(tx);
    localStorage.setItem(TX_KEY, JSON.stringify(all.slice(0, 50)));
  } catch (e) { /* storage unavailable – ignore */ }
}
function allTx() { return [...loadUserTx(), ...SEED_TX]; }

function fmtDate(d = new Date()) {
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
function fmtTime(d = new Date()) {
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}
function nextLotId() {
  const n = 145 + loadUserTx().length + 1;
  return `KC-${new Date().getFullYear()}-${String(n).padStart(4, "0")}`;
}
