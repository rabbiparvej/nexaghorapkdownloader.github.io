import { $, data, load, esc, okUrl, steps, ring, countdown, fx, showError, ICON, FINAL_SECONDS, ref, updateDoc, increment } from "./common.js";

function download() {
  if (!data || sessionStorage.getItem("dlPage") !== "1") { location.replace("../"); return; }
  const valid = okUrl(data.directUrl);
  $.innerHTML = `${steps(3)}<div class="glass center rv">
    <img class="icon" style="width:96px;height:96px;border-radius:24px" src="${esc(data.icon || ICON)}" alt="">
    <h1 style="font-size:1.35rem">${esc(data.appName || "App")}</h1>
    <div class="chips"><span class="chip">${esc(data.version || "")}</span><span class="chip">⬇ ${(data.downloadCount || 0).toLocaleString("en-US")} downloads</span></div>
    <div id="area" style="margin-top:20px">${valid ? '<button class="btn" id="finalBtn">⬇ Download Now</button><div class="note">ক্লিক করলে ৫ সেকেন্ড পর ডাউনলোড শুরু হবে</div>' : '<div class="err">Download লিংক সেট করা নেই।</div>'}</div></div>`;
  fx();
  const btn = document.getElementById("finalBtn"); if (!btn) return;
  btn.onclick = () => {
    document.getElementById("area").innerHTML = ring("f", FINAL_SECONDS) + `<p class="msg">${FINAL_SECONDS} সেকেন্ড পর Download শুরু হবে</p>`;
    countdown("f", FINAL_SECONDS, async () => {
      const w = window.open(data.directUrl, "_blank", "noopener");
      document.getElementById("area").innerHTML = `<div class="done-ic">✓</div><p class="msg">${w ? "Download লিংক খোলা হয়েছে।" : "ব্রাউজার ব্লক করলে নিচের লিংকে ক্লিক করুন:"}</p><a class="lnk" href="${esc(data.directUrl)}" target="_blank" rel="noopener">Direct Download Link</a>`;
      const key = "counted_" + (data.version || "");
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
      try { await updateDoc(ref, { downloadCount: increment(1) }); } catch (e) { console.warn("Count failed:", e.message); }
    });
  };
}

load().then(download).catch(showError);
