// Audit D — زحف حيوي: كل صفحة عربياً (RTL) — أخطاء الكونسول، استثناءات، HTTP≥400، تحذيرات الترطيب.
import { chromium } from "playwright";
import { readdirSync, readFileSync, existsSync, writeFileSync } from "node:fs";
const routes = [];
for (const d of readdirSync("app")) if (existsSync(`app/${d}/page.tsx`)) routes.push("/" + d);
for (const s of readdirSync("app/calculateurs")) if (existsSync(`app/calculateurs/${s}/page.tsx`)) routes.push(`/calculateurs/${s}`);
const idsFrom = (pat) => { const set = new Set(); for (const f of readdirSync("data")) if (pat.test(f)) for (const m of readFileSync("data/"+f,"utf8").matchAll(/^ {4}id: "([a-z0-9-]+)",$/gm)) set.add(m[1]); return [...set]; };
for (const id of idsFrom(/^protocols/)) routes.push(`/protocoles/${id}`);
for (const id of idsFrom(/^medications/)) routes.push(`/medicaments/${id}`);
for (const id of idsFrom(/^procedures/)) routes.push(`/procedures/${id}`);
for (const m of readFileSync("data/trees.ts","utf8").matchAll(/^  id: "([a-z0-9-]+)",$/gm)) routes.push(`/arbres/${m[1]}`);
console.log("ROUTES", routes.length);
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 740 } });
const pg = await ctx.newPage();
const lang = "ar";
await pg.addInitScript(() => { try {
  const p = JSON.parse(localStorage.getItem("eutn:prefs")||"{}"); p.lang = "ar"; p.theme = "light";
  localStorage.setItem("eutn:prefs", JSON.stringify(p));
  localStorage.setItem("eutn:disclaimer-v1", "true");
} catch { /* noop */ } });
const problems = [];
let loaded = 0;
pg.on("pageerror", (e) => problems.push([lang, "PAGEERROR", pg.url(), String(e).slice(0,160)]));
pg.on("console", (msg) => {
  const t = msg.type();
  if (t === "error") problems.push([lang, "CONSOLE-ERR", pg.url(), msg.text().slice(0,160)]);
  else if (t === "warning" && /hydrat|did not match|extra nodes|validateDOM/i.test(msg.text()))
    problems.push([lang, "HYDRATION", pg.url(), msg.text().slice(0,160)]);
});
pg.on("response", (r) => { if (r.status() >= 400) problems.push([lang, "HTTP-" + r.status(), r.url(), ""]); });
for (const r of routes) {
  try {
    await pg.goto("http://localhost:3000" + r, { waitUntil: "domcontentloaded", timeout: 15000 });
    loaded++;
  } catch (e) {
    problems.push([lang, "NAV-FAIL", r, String(e).slice(0,100)]);
  } finally {
    writeFileSync("/tmp/crawl-report.json", JSON.stringify(problems));
    await pg.waitForTimeout(25);
  }
}
await b.close();
const seen = new Set();
for (const [, kind, where, txt] of problems) {
  const key = kind + "|" + where.replace(/#.*$/, "") + "|" + txt.slice(0, 60);
  if (seen.has(key)) continue;
  seen.add(key);
  console.log(`${kind} ${where.replace("http://localhost:3000", "")} ${txt}`);
}
writeFileSync("/tmp/crawl-report.json", JSON.stringify(problems));
console.log(`CRAWL DONE: ${loaded}/${routes.length} — ${problems.length} خام (${seen.size} فريدة)`);
