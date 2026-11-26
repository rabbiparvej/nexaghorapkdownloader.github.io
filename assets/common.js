import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCeju_nfB7nnf-dftrZwR5qXhssF2e9XQk",
  authDomain: "ludo-ff742.firebaseapp.com",
  projectId: "ludo-ff742",
  storageBucket: "ludo-ff742.firebasestorage.app",
  messagingSenderId: "246862675626",
  appId: "1:246862675626:web:e8bb5a705ae6fd9abc9ad3"
};
export const PREP_SECONDS = 10, FINAL_SECONDS = 5;
export const ref = doc(getFirestore(initializeApp(firebaseConfig)), "settings", "apkPage");
export { updateDoc, increment };
export const $ = document.getElementById("app");
export const stk = document.getElementById("stk");
export let data = null;
let timer = null;

export const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
export const okUrl = u => { try { return /^https?:$/.test(new URL(u).protocol); } catch { return false; } };
export const fmt = n => { n = n || 0; return n >= 1e6 ? (n / 1e6).toFixed(1) + "M" : n >= 1e3 ? (n / 1e3).toFixed(1) + "K" : String(n); };
export const ICON = "data:image/svg+xml;utf8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="120" height="120" fill="#6366F1"/><text x="60" y="78" font-size="54" text-anchor="middle" fill="#fff">A</text></svg>');
export const steps = n => `<div class="steps"><span class="${n > 1 ? "done" : "on"}">${n > 1 ? "✓" : "1"} Info</span><span class="${n > 2 ? "done" : n === 2 ? "on" : ""}">${n > 2 ? "✓" : "2"} Prepare</span><span class="${n === 3 ? "on" : ""}">3 Download</span></div>`;
const grad = '<defs><linearGradient id="gr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6366F1"/><stop offset="1" stop-color="#22D3EE"/></linearGradient></defs>';

export function toast(m) { let t = document.querySelector(".toast"); if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); } t.textContent = m; t.classList.add("on"); setTimeout(() => t.classList.remove("on"), 2200); }
export function fx() {
  document.querySelectorAll(".glass").forEach(g => g.addEventListener("pointermove", e => { const r = g.getBoundingClientRect(); g.style.setProperty("--mx", e.clientX - r.left + "px"); g.style.setProperty("--my", e.clientY - r.top + "px"); }));
  const h = document.querySelector(".hero .icon"), hc = document.querySelector(".hero");
  if (h && hc) { hc.addEventListener("pointermove", e => { const r = hc.getBoundingClientRect(); h.style.transform = `perspective(500px) rotateY(${((e.clientX - r.left) / r.width - .5) * 22}deg) rotateX(${-((e.clientY - r.top) / r.height - .5) * 22}deg)`; }); hc.addEventListener("pointerleave", () => h.style.transform = ""); }
  document.querySelectorAll("[data-n]").forEach(el => { const n = +el.dataset.n, t0 = performance.now(); const f = t => { const k = Math.min(1, (t - t0) / 1200); el.textContent = fmt(Math.round(n * (1 - Math.pow(1 - k, 3)))); if (k < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); });
}
export async function load() { const sn = await getDoc(ref); data = sn.exists() ? sn.data() : null; brand(); return data; }
function brand() {
  const n = (data && data.appName) || "APK Download", i = (data && data.icon) || ICON;
  ["hName", "fName", "fName2"].forEach(id => document.getElementById(id).textContent = n);
  ["hLogo", "fLogo"].forEach(id => document.getElementById(id).src = i);
  document.getElementById("fYear").textContent = new Date().getFullYear();
  document.title = n + " – Download APK";
}
export function ring(id, secs) {
  const r = 74, c = 2 * Math.PI * r;
  return `<div class="ring"><svg viewBox="0 0 170 170" width="170" height="170">${grad}<circle class="bg" cx="85" cy="85" r="${r}"/><circle class="pg" id="${id}Pg" cx="85" cy="85" r="${r}" stroke-dasharray="${c}" stroke-dashoffset="0"/></svg><div class="n"><span id="${id}Txt">${secs}</span><small>seconds</small></div></div>`;
}
export function countdown(id, secs, done) {
  clearInterval(timer);
  const c = 2 * Math.PI * 74; let left = secs;
  const txt = document.getElementById(id + "Txt"), pg = document.getElementById(id + "Pg");
  timer = setInterval(() => {
    left--;
    if (txt) txt.textContent = Math.max(left, 0);
    if (pg) pg.style.strokeDashoffset = c * (1 - left / secs);
    if (left <= 0) { clearInterval(timer); done(); }
  }, 1000);
}
export const showError = e => { $.innerHTML = `<div class="glass"><div class="err">ডেটা লোড হয়নি: ${esc(e.message)}</div></div>`; };
