hydrateIcons();
const $ = (id) => document.getElementById(id);
const inr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");

const state = { step: 1, photo: null, material: "PCB", weight: 5, cond: "Good", loc: "Kolhapur, Maharashtra", rec: 0, method: "UPI", paid: false, txn: null, lot: null, t0: null };
const COND = { Good: 1, Fair: 0.93, Poor: 0.85 };

/* ---------- static icons ---------- */
$("logo").innerHTML = icon("leaf", 22);
$("badgeIco").innerHTML = icon("user", 26);
$("i1").innerHTML = icon("info", 18);
$("galleryBtn").innerHTML = icon("image", 22);
$("shutterBtn").innerHTML = icon("camera", 28);
$("flashBtn").innerHTML = icon("bolt", 22);
$("wMinus").innerHTML = icon("minus", 18);
$("wPlus").innerHTML = icon("plus", 18);
$("locIco").innerHTML = icon("pin", 18);
$("w1").innerHTML = icon("check", 14); $("w2").innerHTML = icon("check", 14); $("w3").innerHTML = icon("check", 14);
$("globe").innerHTML = icon("recycle", 56);
document.querySelectorAll("[data-back]").forEach((b) => (b.innerHTML = icon("back", 20)));
$("m2sel").innerHTML = Object.keys(MATERIALS).map((k) => `<option value="${k}">${MATERIALS[k].label}</option>`).join("");

/* ---------- helpers ---------- */
function pcbSVG() {
  let traces = "";
  for (let i = 0; i < 14; i++) traces += `<path d="M${20 + i * 26} 20 V${60 + (i % 4) * 30} H${50 + i * 24} V${190 + (i % 3) * 20}" stroke="#6ff0a8" stroke-opacity=".35" stroke-width="2" fill="none"/>`;
  return `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="300" fill="#0c6b3e"/>${traces}
    <rect x="150" y="90" width="90" height="90" rx="6" fill="#151b18"/><rect x="165" y="105" width="60" height="60" fill="#232b27"/>
    <rect x="50" y="60" width="50" height="28" rx="4" fill="#111"/><rect x="290" y="70" width="60" height="34" rx="4" fill="#1a1f1c"/>
    <rect x="70" y="200" width="70" height="30" rx="4" fill="#1a1f1c"/><rect x="270" y="190" width="80" height="40" rx="4" fill="#111"/>
    <circle cx="90" cy="140" r="14" fill="#c9a24a"/><circle cx="330" cy="150" r="12" fill="#c9a24a"/><circle cx="200" cy="230" r="10" fill="#c9a24a"/>
  </svg>`;
}
const photoHTML = () => (state.photo ? `<img src="${state.photo}" alt="Captured e-waste">` : pcbSVG());
const M = () => MATERIALS[state.material];
const mid = () => (M().min + M().max) / 2;
const mult = () => COND[state.cond];
const recRate = (r) => Math.round((M().max - r.offset) * mult());
const chosen = () => RECYCLERS[state.rec];
const matBadge = (k) => `<span class="mat-ico">${MATERIALS[k].short.slice(0, 4)}</span>`;

/* ---------- navigation ---------- */
function go(n) {
  state.step = Math.max(1, Math.min(9, n));
  document.querySelectorAll(".screen").forEach((s) => s.classList.toggle("show", +s.dataset.step === state.step));
  document.querySelectorAll("#steps li").forEach((li, i) => {
    li.classList.toggle("on", i + 1 === Math.min(state.step, 8));
    li.classList.toggle("done", i + 1 < Math.min(state.step, 9));
  });
  (render[state.step] || (() => {}))();
  document.querySelector(`.screen[data-step="${state.step}"]`).scrollTop = 0;
}
document.querySelectorAll("[data-next]").forEach((b) => b.addEventListener("click", () => go(state.step + 1)));
document.querySelectorAll("[data-back]").forEach((b) => b.addEventListener("click", () => go(state.step - 1)));

/* ---------- renderers ---------- */
const render = {
  1() { $("vf").innerHTML = `<div class="photo">${photoHTML()}</div>`; },

  2() {
    $("photo2").innerHTML = photoHTML();
    $("m2ico").textContent = M().short.slice(0, 4);
    $("m2name").textContent = M().label;
    $("m2conf").textContent = M().conf;
    $("m2bar").style.width = M().conf + "%";
    $("m2sel").value = state.material;
  },

  3() {
    $("m3ico").textContent = M().short.slice(0, 4);
    $("m3name").textContent = M().short;
    $("m3conf").textContent = M().conf;
    $("wVal").textContent = state.weight.toFixed(1);
    document.querySelectorAll("#cond button").forEach((b) => b.classList.toggle("on", b.textContent === state.cond));
    $("loc").value = state.loc;
  },

  4() {
    const m = M(), c = mult();
    $("m4ico").textContent = m.short.slice(0, 4);
    $("m4name").textContent = m.short;
    $("m4range").textContent = `${inr(m.min)} – ${inr(m.max)}`;
    $("m4chg").textContent = `${m.change >= 0 ? "↑ +" : "↓ "}${m.change}% vs last week`;
    $("m4chg").style.color = m.change >= 0 ? "" : "var(--red)";
    $("m4loc").textContent = state.loc;
    $("p1").textContent = inr(mid() * 0.95);
    $("p2").textContent = inr(mid());
    $("p3").textContent = inr(mid() * 0.995);
    $("m4kg").textContent = state.weight.toFixed(1);
    $("m4est").textContent = `${inr(m.min * state.weight * c)} – ${inr(m.max * state.weight * c)}`;
  },

  5() {
    $("recList").innerHTML = RECYCLERS.map((r, i) => {
      const cls = i === 0 ? "best" : i === 1 ? "ok" : "near";
      return `<button class="rec ${cls}" data-i="${i}">
        <span class="r-ico">${icon("factory", 20)}</span>
        <span><b>${r.name}</b><small>Authorized · Pickup available</small><small>${r.km} km · ★ ${r.rating} (${r.reviews})</small></span>
        <span class="price">${inr(recRate(r))}/kg<em>${r.tag}</em></span></button>`;
    }).join("");
    document.querySelectorAll(".rec").forEach((b) => b.addEventListener("click", () => { state.rec = +b.dataset.i; go(6); }));
  },

  6() {
    const r = chosen();
    $("s6ico").innerHTML = icon("factory", 22);
    $("s6name").textContent = r.name;
    $("s6meta").textContent = `${r.km} km · ★ ${r.rating} (${r.reviews})`;
    $("s6rate").textContent = inr(recRate(r)) + "/kg";
  },

  7() {
    if (!state.lot) { state.lot = nextLotId(); state.t0 = new Date(); }
    $("lot").textContent = state.lot;
    $("qrBox").innerHTML = "";
    new QRCode($("qrBox"), { text: `${state.lot}|${state.material}|${state.weight}kg|${chosen().name}|${state.loc}`, width: 150, height: 150, colorDark: "#0a3d2c" });
    $("m7ico").textContent = M().short.slice(0, 4);
    $("m7").textContent = `${M().short} · ${state.weight.toFixed(1)} kg`;
    $("m7loc").textContent = state.loc;
    const t1 = new Date(state.t0.getTime() + 20 * 60000);
    $("tl").innerHTML = `
      <li><span class="dot">${icon("check", 12)}</span>Collected<time>${fmtDate(state.t0)}, ${fmtTime(state.t0)}</time></li>
      <li><span class="dot">${icon("check", 12)}</span>Handed Over<time>${fmtTime(t1)}</time></li>
      <li class="pending"><span class="dot"></span>Verified by Recycler<time>Pending</time></li>`;
  },

  8() {
    const amount = Math.round(state.weight * recRate(chosen()));
    if (state.paid) {
      const n = new Date();
      $("payBody").innerHTML = `
        <div class="paid"><span class="tick">${icon("check", 28)}</span><b style="font-size:18px">Payment Successful!</b>
          <small class="muted">You have received the payment for your e-waste lot.</small><div class="big">${inr(amount)}</div>
          <small class="muted">(for ${state.weight.toFixed(1)} kg ${state.material})</small></div>
        <div class="card">
          <div class="kv"><span>Transaction ID</span><b>${state.txn}</b></div>
          <div class="kv"><span>Method</span><b>${state.method}</b></div>
          <div class="kv"><span>Date &amp; Time</span><b>${fmtDate(n)}, ${fmtTime(n)}</b></div>
        </div>
        <button class="primary" id="doneBtn">Done</button>`;
      $("doneBtn").addEventListener("click", finish);
    } else {
      $("payBody").innerHTML = `
        <div class="card"><small class="muted">Amount payable to you</small><div class="big">${inr(amount)}</div>
          <small class="muted">${state.weight.toFixed(1)} kg × ${inr(recRate(chosen()))}/kg · ${chosen().name}</small></div>
        <b class="lbl">Receive payment via</b>
        <div class="methods">${["UPI", "Bank", "Cash"].map((m) => `<button class="${m === state.method ? "on" : ""}">${m}</button>`).join("")}</div>
        <button class="primary" id="payBtn">Confirm Payment</button>`;
      document.querySelectorAll(".methods button").forEach((b) => b.addEventListener("click", () => { state.method = b.textContent; render[8](); }));
      $("payBtn").addEventListener("click", () => { state.paid = true; state.txn = "TXN" + Date.now(); render[8](); });
    }
  },

  9() {
    const amount = Math.round(state.weight * recRate(chosen()));
    $("d1").textContent = state.material;
    $("d2").textContent = state.weight.toFixed(1) + " kg";
    $("d3").textContent = inr(amount);
  }
};

/* ---------- events ---------- */
function takePhoto(file) {
  if (file) state.photo = URL.createObjectURL(file);
  go(2);
}
$("shutterBtn").addEventListener("click", () => $("camInput").click());
$("galleryBtn").addEventListener("click", () => $("galInput").click());
$("camInput").addEventListener("change", (e) => takePhoto(e.target.files[0]));
$("galInput").addEventListener("change", (e) => takePhoto(e.target.files[0]));
$("sampleBtn").addEventListener("click", () => { state.photo = null; state.material = "PCB"; go(2); });
$("flashBtn").addEventListener("click", (e) => e.currentTarget.style.background = e.currentTarget.style.background ? "" : "#178a52");

$("m2sel").addEventListener("change", (e) => { state.material = e.target.value; render[2](); });

$("wMinus").addEventListener("click", () => { state.weight = Math.max(0.5, +(state.weight - 0.5).toFixed(1)); $("wVal").textContent = state.weight.toFixed(1); });
$("wPlus").addEventListener("click", () => { state.weight = Math.min(500, +(state.weight + 0.5).toFixed(1)); $("wVal").textContent = state.weight.toFixed(1); });
$("cond").addEventListener("click", (e) => { if (e.target.tagName === "BUTTON") { state.cond = e.target.textContent; render[3](); } });
$("loc").addEventListener("input", (e) => (state.loc = e.target.value || "Kolhapur, Maharashtra"));

function finish() {
  const r = chosen();
  saveUserTx({ date: fmtDate(), lot: state.lot, material: state.material, kg: state.weight, recycler: r.name.split(" ")[0], status: "Completed" });
  go(9);
}
$("homeBtn").addEventListener("click", () => {
  Object.assign(state, { photo: null, material: "PCB", weight: 5, cond: "Good", rec: 0, method: "UPI", paid: false, txn: null, lot: null, t0: null });
  go(1);
});

go(1);
