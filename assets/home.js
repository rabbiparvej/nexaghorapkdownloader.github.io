import { $, stk, data, load, esc, fmt, ICON, fx, toast, showError } from "./common.js";

let io = null;
const startFlow = () => { sessionStorage.setItem("dlOk", "1"); location.href = "prepare/"; };

function home() {

  if (!data) { $.innerHTML = '<div class="glass center">এখনো কোনো অ্যাপ প্রকাশ করা হয়নি।</div>'; return; }
  const icon = esc(data.icon || ICON);
  const st = [["Downloads", fmt(data.downloadCount)], ["Version", data.version], ["Size", data.size], ["Android", data.requiresAndroid]].filter(x => x[1]);
  const info = [["Developer", data.developer], ["Category", data.category], ["Requires Android", data.requiresAndroid], ["Version", data.version]].filter(x => x[1]);
  const shots = (data.screenshots || []).map(s => `<img src="${esc(s)}" alt="Screenshot" loading="lazy">`).join("");
  const long = (data.description || "").length > 220;
  $.innerHTML = `
  <div class="glass hero rv"><div class="bgimg" style="background-image:url('${icon}')"></div>
    <img class="icon" src="${icon}" alt="">
    <h1>${esc(data.appName || "App")}</h1>
    ${data.developer ? `<div class="dev">${esc(data.developer)}</div>` : ""}
    <div class="chips"><span class="chip ok">✓ Official APK</span><span class="chip">🔒 Safe &amp; Secure</span><span class="chip">⚡ Free</span></div>
    <div class="stats">${st.map(x => `<div class="st"><b ${x[0] === "Downloads" ? `data-n="${data.downloadCount || 0}"` : ""}>${esc(x[1])}</b><small>${x[0]}</small></div>`).join("")}</div>
  </div>
  <div class="glass rv"><div class="row"><button class="btn" id="dlBtn">⬇ Download APK</button><button class="btn ghost" id="shBtn" aria-label="Share">⤴</button></div><div class="note">Total ${(data.downloadCount || 0).toLocaleString("en-US")} downloads</div></div>
  ${shots ? `<div class="glass rv"><h2>Screenshots</h2><div class="shots" id="shots">${shots}</div><div class="dots" id="dots"></div></div>` : ""}
  ${data.description ? `<div class="glass rv"><h2>About this app</h2><p class="t ${long ? "clip" : ""}" id="desc">${esc(data.description)}</p>${long ? '<button class="more" id="more">আরও দেখুন ▾</button>' : ""}</div>` : ""}
  <div class="glass rv"><h2>কিভাবে ইন্সটল করবেন</h2>
    <details open><summary>১. APK ডাউনলোড করুন</summary><p>উপরের Download বাটনে ক্লিক করুন। কাউন্টডাউন শেষ হলে ফাইল ডাউনলোড শুরু হবে।</p></details>
    <details><summary>২. Unknown Sources চালু করুন</summary><p>Settings → Security (বা Apps) এ গিয়ে আপনার ব্রাউজার/ফাইল ম্যানেজারের জন্য "Install unknown apps" অনুমতি দিন।</p></details>
    <details><summary>৩. ইন্সটল করুন</summary><p>ডাউনলোড করা APK ফাইলে ট্যাপ করে Install চাপুন। শেষ হলে অ্যাপ খুলুন।</p></details></div>
  ${info.length ? `<div class="glass rv"><h2>App Information</h2><div class="info">${info.map(x => `<div><small>${x[0]}</small><span>${esc(x[1])}</span></div>`).join("")}</div></div>` : ""}`;
  document.getElementById("dlBtn").onclick = startFlow;
  stk.querySelector("button").onclick = startFlow;
  const m = document.getElementById("more");
  if (m) m.onclick = () => { document.getElementById("desc").classList.remove("clip"); m.remove(); };
  $.querySelectorAll(".shots img").forEach(im => im.onclick = () => {
    const lb = document.createElement("div"); lb.className = "lb"; lb.innerHTML = `<img src="${im.src}">`; lb.onclick = () => lb.remove(); document.body.appendChild(lb);
  });
  fx();
  const sh = document.getElementById("shots"), dt = document.getElementById("dots");
  if (sh && dt) {
    const im = sh.children; dt.innerHTML = [...im].map((_, i) => `<i class="${i ? "" : "on"}"></i>`).join("");
    sh.onscroll = () => { const k = Math.round(sh.scrollLeft / (im[0].offsetWidth + 12)); [...dt.children].forEach((d, i) => d.classList.toggle("on", i === k)); };
  }
  document.getElementById("shBtn").onclick = async () => {
    const u = location.href.split("#")[0];
    try { if (navigator.share) await navigator.share({ title: data.appName, url: u }); else { await navigator.clipboard.writeText(u); toast("লিংক কপি হয়েছে ✓"); } } catch (e) {}
  };
  io = new IntersectionObserver(e => stk.classList.toggle("on", !e[0].isIntersecting), { threshold: 0 });
  io.observe(document.getElementById("dlBtn"));
}

load().then(home).catch(showError);
