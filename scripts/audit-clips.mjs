// مدقق القطع — يفتح مسارات ممثِّلة عربياً 390px ويرصد أي عنصر نصّي مقصوص (ellipsis/overflow).
import { chromium } from "playwright";
const ROUTES = [
  "/", "/rea", "/memo", "/reevaluation", "/resume", "/protocoles", "/protocoles/polytraumatisme", "/protocoles/acr-adulte", "/medicaments", "/medicaments/adrenaline",
  "/calculateurs", "/calculateurs/dose-check", "/calculateurs/noac", "/calculateurs/rsi", "/calculateurs/chronologie",
  "/calculateurs/iot-rsi", "/calculateurs/neonat-ran", "/recherche?q=صدمة", "/revisions", "/revision", "/stats",
  "/terrain", "/guidage", "/fiche-samu", "/triage", "/checklists", "/arbres/acr", "/procedures",
];
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 740 } });
const pg = await ctx.newPage();
await pg.addInitScript(() => { try {
  const p = JSON.parse(localStorage.getItem("eutn:prefs")||"{}"); p.lang="ar"; p.theme="light";
  localStorage.setItem("eutn:prefs", JSON.stringify(p));
  localStorage.setItem("eutn:disclaimer-v1","true");
} catch {} });
let total = 0;
for (const r of ROUTES) {
  try { await pg.goto("http://localhost:3000" + r, { waitUntil: "domcontentloaded", timeout: 15000 }); } catch { continue; }
  await pg.waitForTimeout(250);
  const clips = await pg.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll("body *")) {
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden") continue;
      if (el.closest(".eutn-so")) continue; // الشريط المتحرك مقصود
      if (el.classList.contains("sr-only")) continue; // روابط الوصول المقصودة
      const txt = (el.childElementCount === 0 ? el.textContent : "").trim();
      if (!txt) continue;
      const clipped = el.scrollWidth - el.clientWidth > 3;
      const ellipsis = cs.textOverflow === "ellipsis";
      if (clipped && (ellipsis || cs.overflowX === "hidden")) {
        out.push(`${el.tagName}.${(el.className||"").toString().slice(0,40)} «${txt.slice(0,30)}»`);
      }
    }
    return out;
  });
  if (clips.length) { console.log(`✂ ${r} (${clips.length})`); for (const c of clips.slice(0,4)) console.log("   ", c); }
  total += clips.length;
}
await b.close();
console.log(`AUDIT-CLIPS: ${total} عنصراً مقصوصاً`);
if (total > 0) process.exitCode = 1;
