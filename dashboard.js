hydrateIcons();

/* ---------- Clock + date ---------- */
function tick() {
  const n = new Date();
  document.getElementById("today").textContent = fmtDate(n);
  document.getElementById("clock").textContent = fmtTime(n);
}
tick(); setInterval(tick, 30000);

/* ---------- Trend chart ---------- */
const GREEN = "#1f9d5b", BLUE = "#2f80ed", PURPLE = "#7b4bd6";
const base7 = {
  labels: ["22 Sep", "23 Sep", "24 Sep", "25 Sep", "26 Sep", "27 Sep", "28 Sep"],
  total: [2800, 3500, 4200, 4550, 5200, 5900, 6700],
  formal: [2200, 2700, 3200, 3500, 4000, 4500, 5000],
  recycled: [1650, 1800, 1950, 2100, 2300, 2600, 2900]
};

function series(days) {
  if (days === 7) return base7;
  const labels = [], total = [], formal = [], recycled = [];
  const step = days === 30 ? 3 : 9;
  const pts = days / step;
  for (let i = 0; i < pts; i++) {
    const d = new Date(); d.setDate(d.getDate() - (days - 1 - i * step));
    labels.push(d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }));
    const t = 1200 + (5500 / pts) * (i + 1) + Math.sin(i * 1.7) * 300;
    total.push(Math.round(t)); formal.push(Math.round(t * 0.74)); recycled.push(Math.round(t * 0.43));
  }
  total[total.length - 1] = 6700; formal[formal.length - 1] = 5000; recycled[recycled.length - 1] = 2900;
  return { labels, total, formal, recycled };
}

const mk = (label, data, color) => ({
  label, data, borderColor: color, backgroundColor: color + "22", fill: true, tension: 0.4,
  pointRadius: 3.5, pointBackgroundColor: color, borderWidth: 2
});

let trendChart = null;
try { trendChart = new Chart(document.getElementById("trend"), {
  type: "line",
  data: { labels: base7.labels, datasets: [mk("Total Collected", base7.total, GREEN), mk("Formal Channelized", base7.formal, BLUE), mk("Recycled", base7.recycled, PURPLE)] },
  options: {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, grid: { color: "#eef3f0" }, ticks: { callback: (v) => v.toLocaleString("en-IN") } }, x: { grid: { display: false } } }
  }
}); } catch (e) { console.warn("Chart.js not loaded", e); }

document.getElementById("range").addEventListener("click", (e) => {
  const b = e.target.closest("button"); if (!b) return;
  document.querySelectorAll("#range button").forEach((x) => x.classList.remove("on"));
  b.classList.add("on");
  const s = series(+b.dataset.d);
  if (!trendChart) return;
  trendChart.data.labels = s.labels;
  trendChart.data.datasets[0].data = s.total;
  trendChart.data.datasets[1].data = s.formal;
  trendChart.data.datasets[2].data = s.recycled;
  trendChart.update();
});

/* ---------- Donut ---------- */
const mat = [
  ["PCB", 3420, "#1f9d5b"], ["Cable", 2980, "#2f80ed"], ["Battery", 2100, "#f5a623"],
  ["LCD", 1540, "#7b4bd6"], ["CRT", 960, "#e0475b"], ["Motor", 640, "#b59b3c"], ["Other", 1200, "#8a97a5"]
];
const totalKg = mat.reduce((s, m) => s + m[1], 0);

try { new Chart(document.getElementById("donut"), {
  type: "doughnut",
  data: { labels: mat.map((m) => m[0]), datasets: [{ data: mat.map((m) => m[1]), backgroundColor: mat.map((m) => m[2]), borderWidth: 2, borderColor: "#fff" }] },
  options: { cutout: "66%", responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } },
  plugins: [{
    id: "center",
    afterDraw(c) {
      const { ctx, chartArea: a } = c; const x = (a.left + a.right) / 2, y = (a.top + a.bottom) / 2;
      ctx.save(); ctx.textAlign = "center"; ctx.fillStyle = "#0f1f1a";
      ctx.font = "700 17px Inter, sans-serif"; ctx.fillText(totalKg.toLocaleString("en-IN") + " kg", x, y);
      ctx.font = "400 12px Inter, sans-serif"; ctx.fillStyle = "#5d6b66"; ctx.fillText("Total", x, y + 17);
      ctx.restore();
    }
  }]
}); } catch (e) { console.warn("Donut not drawn", e); }

document.getElementById("dl").innerHTML = mat.map((m) =>
  `<li><i style="background:${m[2]}"></i><b>${m[0]}</b><span>${m[1].toLocaleString("en-IN")} kg (${(m[1] / totalKg * 100).toFixed(1)}%)</span></li>`
).join("");

/* ---------- Map (Leaflet + OpenStreetMap) ---------- */
try {
const map = L.map("map", { zoomControl: true, attributionControl: false }).setView([16.72, 74.35], 9);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18 }).addTo(map);
const risk = { Low: "#1f9d5b", Medium: "#f5a623", High: "#e0475b" };
[
  ["Kolhapur city", 16.705, 74.243, "Medium"], ["Shiroli", 16.735, 74.33, "High"],
  ["Ichalkaranji", 16.691, 74.46, "Low"], ["Sangli", 16.855, 74.565, "Low"],
  ["Gadhinglaj", 16.225, 74.35, "High"], ["Kagal", 16.575, 74.315, "Medium"],
  ["Jaysingpur", 16.777, 74.558, "Medium"], ["Panhala", 16.81, 74.11, "Low"],
  ["Hatkanangale", 16.735, 74.41, "Medium"], ["Radhanagari", 16.41, 73.995, "Low"]
].forEach(([n, la, lo, r]) =>
  L.circleMarker([la, lo], { radius: 7, color: "#fff", weight: 2, fillColor: risk[r], fillOpacity: 1 })
    .bindTooltip(`${n} – ${r} risk`).addTo(map)
);
} catch (e) { console.warn("Leaflet not loaded", e); document.getElementById("map").textContent = "Map could not load (check internet)."; }

/* ---------- Transactions ---------- */
function renderTx(filter = "") {
  const f = filter.toLowerCase();
  const rows = allTx().filter((t) => !f || [t.material, t.recycler, t.lot].join(" ").toLowerCase().includes(f)).slice(0, 5);
  document.getElementById("tx").innerHTML = rows.map((t) =>
    `<tr><td>${t.date}</td><td>${t.lot}</td><td>${t.material}</td><td>${Number(t.kg).toFixed(1)}</td><td>${t.recycler}</td><td><span class="pill ${t.status.replace(" ", "")}">${t.status}</span></td></tr>`
  ).join("") || `<tr><td colspan="6" style="color:var(--muted)">No transactions match your search.</td></tr>`;
}
renderTx();
document.getElementById("q").addEventListener("input", (e) => renderTx(e.target.value));

/* ---------- Price trends ---------- */
const priceRows = [["PCB", "105 – 115", 5], ["Cable", "420 – 510", 3], ["Battery", "75 – 105", -2], ["LCD", "120 – 160", 4], ["CRT", "60 – 85", 1]];
document.getElementById("prices").innerHTML = priceRows.map(([m, p, c]) =>
  `<tr><td>${m}</td><td>${p}</td><td class="${c >= 0 ? "up" : "down"}">${c >= 0 ? "↑ +" : "↓ "}${c}%</td></tr>`
).join("");
