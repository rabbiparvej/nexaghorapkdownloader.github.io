import { $, data, load, steps, ring, countdown, fx, showError, PREP_SECONDS } from "./common.js";

function prepare() {
  if (!data || sessionStorage.getItem("dlOk") !== "1") { location.replace("../"); return; }
  $.innerHTML = `${steps(2)}<div class="glass center rv"><h2 style="justify-content:center">ডাউনলোড প্রস্তুত হচ্ছে…</h2>${ring("p", PREP_SECONDS)}<p class="msg">${PREP_SECONDS} সেকেন্ড পর Download Page এ যাবেন</p></div>`;
  fx();
  countdown("p", PREP_SECONDS, () => { sessionStorage.setItem("dlPage", "1"); location.href = "../download/"; });
}

load().then(prepare).catch(showError);
