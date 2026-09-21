// تدقيق الترجمة — كل t("…") يوجد في القاموسين fr و ar.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
const i18n = readFileSync("lib/i18n.ts", "utf8");
const block = (name) => i18n.slice(i18n.indexOf(`${name}:`), i18n.indexOf("};", i18n.indexOf(`${name}:`)));
const keysOf = (b) => new Set([...b.matchAll(/^\s*"?([a-zA-Z0-9.\-]+)"?\s*:/gm)].map(m => m[1]));
const fr = keysOf(block("fr")), ar = keysOf(block("ar"));
const files = [];
(function walk(d) { for (const f of readdirSync(d, { withFileTypes: true })) {
  const p = join(d, f.name);
  if (f.isDirectory()) { if (!/node_modules|\.next|out|shots/.test(p)) walk(p); }
  else if (/\.tsx?$/.test(f.name)) files.push(p);
} })(".");
const used = new Set();
for (const f of files) for (const m of readFileSync(f, "utf8").matchAll(/\bt\(\s*"([^"]+)"/g)) used.add(m[1]);
let miss = 0;
for (const k of [...used].sort()) {
  if (!fr.has(k)) { console.log("MISSING fr:", k); miss++; }
  if (!ar.has(k)) { console.log("MISSING ar:", k); miss++; }
}
console.log(`AUDIT-DICT: ${used.size} مفاتيح مستعملة — ${miss} ناقصة`);
if (miss > 0) process.exitCode = 1;
