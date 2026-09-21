// تدقيق الروابط — كل href داخلي يقابل مساراً موجوداً (صفحات ثابتة + تفاصيل ديناميكية من data).
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
const files = [];
(function walk(d) { for (const f of readdirSync(d, { withFileTypes: true })) {
  const p = join(d, f.name);
  if (f.isDirectory()) { if (!/node_modules|\.next|out|shots/.test(p)) walk(p); }
  else if (/\.tsx?$/.test(f.name)) files.push(p);
} })(".");
const known = new Set(["/"]);
for (const d of readdirSync("app")) if (existsSync(`app/${d}/page.tsx`)) known.add("/" + d);
for (const s of readdirSync("app/calculateurs")) if (existsSync(`app/calculateurs/${s}/page.tsx`)) known.add(`/calculateurs/${s}`);
const idsFrom = (pat) => { const set = new Set(); for (const f of readdirSync("data")) if (pat.test(f)) for (const m of readFileSync("data/" + f, "utf8").matchAll(/^ {4}id: "([a-z0-9-]+)",$/gm)) set.add(m[1]); return set; };
for (const id of idsFrom(/^protocols/)) known.add(`/protocoles/${id}`);
for (const id of idsFrom(/^medications/)) known.add(`/medicaments/${id}`);
for (const id of idsFrom(/^procedures/)) known.add(`/procedures/${id}`);
for (const m of readFileSync("data/trees.ts", "utf8").matchAll(/^  id: "([a-z0-9-]+)",$/gm)) known.add(`/arbres/${m[1]}`);
const hrefs = new Map();
for (const f of files) {
  const s = readFileSync(f, "utf8");
  for (const m of s.matchAll(/href\s*[:=]\s*[`"'{]{1,2}(\/[a-z0-9\-\/]+)/g)) {
    const h = m[1];
    if (!hrefs.has(h)) hrefs.set(h, f);
  }
}
let bad = 0;
for (const [h, f] of [...hrefs].sort()) {
  if (!h.startsWith("/") || h.startsWith("//") || h === "/") continue;
  if (/\.(png|svg|ico|css|js|webmanifest)$/.test(h)) continue;
  if (known.has(h)) continue;
  if (h.endsWith("/")) {
    // بادئة قالب ديناميكي (/seg/${id}) — أصلها مسار معروف
    const parent = h.replace(/\/$/, "");
    if (known.has(parent)) continue;
  }
  if (h.includes("${")) continue; // قوالب ديناميكية
  console.log("LIEN MORT", h, "←", f);
  bad++;
}
console.log(`AUDIT-LINKS: ${hrefs.size} hrefs — ${bad} ميتة`);
if (bad > 0) process.exitCode = 1;
