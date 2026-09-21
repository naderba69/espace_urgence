import { chromium } from "playwright";
const ROUTES = ["/", "/protocoles", "/protocoles/avc", "/protocoles/intoxication-organophosphores", "/medicaments", "/medicaments/adrenaline", "/calculateurs", "/calculateurs/gazometrie", "/calculateurs/ventilateur", "/calculateurs/broselow", "/calculateurs/rcp-peds", "/calculateurs/perfusions", "/terrain", "/guidage", "/quiz", "/recherche", "/arbres", "/ecg", "/checklists", "/fiche-samu", "/triage", "/procedures", "/changelog", "/parametres", "/stats", "/pediatrie", "/obstetrique"];
const WIDTHS = [320, 360, 768];
const b = await chromium.launch();
for (const langToggle of [false, true]) {
  for (const w of WIDTHS) {
    const ctx = await b.newContext({ viewport: { width: w, height: 740 } });
    const p = await ctx.newPage();
    let ar = false;
    for (const r of ROUTES) {
      await p.goto("http://localhost:3000" + r, { waitUntil: "domcontentloaded" }).catch(() => {});
      const d = p.locator('[role=alertdialog] button').first();
      // v9.2 — robustesse : l'hydratation peut être lente (serveur statique) → retries
      for (let i = 0; i < 4 && (await p.locator('[role=alertdialog]').count()); i++) {
        await d.click({ timeout: 4000 }).catch(() => {});
        await p.waitForTimeout(350);
      }
      if (langToggle && !ar) { const t = p.locator("button", { hasText: /^ع$/ }).first(); if (await t.count()) { await t.click({ timeout: 8000 }).catch(() => {}); ar = true; } }
      await p.waitForTimeout(220);
      const res = await p.evaluate(() => {
        const iw = innerWidth;
        const scrollable = (el) => {
          for (let a = el.parentElement; a; a = a.parentElement) {
            const st = getComputedStyle(a);
            if (st.overflowX === "auto" || st.overflowX === "scroll") return true;
          }
          return false;
        };
        const main = document.getElementById("contenu");
        const mo = main ? main.scrollWidth - main.clientWidth : 0;
        const bad = [];
        for (const el of document.querySelectorAll("body *")) {
          const st = getComputedStyle(el);
          if (st.overflowX === "auto" || st.overflowX === "scroll" || scrollable(el)) continue;
          const r = el.getBoundingClientRect();
          if (r.height > 0 && r.width > 0 && (r.right > iw + 2 || r.left < -2)) {
            bad.push(el.tagName + "." + String(el.className).split(" ").slice(0, 3).join(".").slice(0, 50) + `[${Math.round(r.left)},${Math.round(r.right)}]`);
            if (bad.length >= 3) break;
          }
        }
        return { mo, bad };
      });
      if (res.mo > 1 || res.bad.length) console.log(`${langToggle ? "AR" : "FR"} ${w}px ${r} mainOver=${res.mo} ${res.bad.join(" | ")}`);
    }
    await ctx.close();
  }
}
await b.close();
console.log("AUDIT2 DONE");

// ── eutn-dyn-sweep : كل صفحات الحاسبات عربياً 390px — رصد أي تجاوز أفقي ──
import { readdirSync } from "node:fs";
{
  const b2 = await chromium.launch();
  const ctx = await b2.newContext({ viewport: { width: 390, height: 740 } });
  const pg = await ctx.newPage();
  await pg.addInitScript(() => {
    try { const p = JSON.parse(localStorage.getItem("eutn:prefs") || "{}"); p.lang = "ar"; p.theme = "light"; localStorage.setItem("eutn:prefs", JSON.stringify(p)); } catch {}
  });
  let over = 0, n = 0;
  for (const slug of readdirSync("app/calculateurs")) {
    const r = `/calculateurs/${slug}`;
    try {
      await pg.goto(`http://localhost:3000${r}`, { waitUntil: "load", timeout: 15000 });
      await pg.waitForTimeout(120);
      const sw = await pg.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth));
      n++;
      if (sw > 391) { over++; console.log(`  OVERFLOW ${r} scrollWidth=${sw}`); }
    } catch { console.log(`  SKIP ${r}`); }
  }
  await b2.close();
  console.log(`DYN SWEEP: ${n} pages, ${over} overflow`);
  if (over > 0) process.exitCode = 1;
}
