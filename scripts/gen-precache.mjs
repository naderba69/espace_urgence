// v15.3 — مولّد المخزون المسبق: يجعل «100% دون اتصال» حقيقة كاملة.
// يُشغَّل بعد next build: يفحص out/ ويحقن قائمة الأصول في out/sw.js
// (أصول _next المشتركة + مستندات التبويبات الست + حمولات RSC الخاصة بها + الShell).
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";

const MAX_FILE = 1024 * 1024; // 1MB — أمان من الملفات الشاذة

// v17.0 — التخزين المسبق يشمل كل صفحات المستوى الأول (الرئيسية + الفهارس + المحاور)،
// لا ستة مسارات مفروضة يدويًا كما كان. مقاس: +2 ميغابايت فقط، مقابل أن كل صفحة فهرس
// تُفتح دون اتصال من أول زيارة.
//
// لماذا ليس كل شيء؟ صفحات التفاصيل (98 بروتوكولًا + 130 حاسبة…) تكلّف +22.6 ميغابايت
// إضافية — ثقيلة على هاتف متواضع. تبقى مبدئيًا في «زِيارة ← تخزين مؤقت» (SW: network-first).
const TAG_RE = /^(_next|icons|fonts|__|404)$/;

const files = new Map(); // rel → bytes
const collect = (dir, prefix) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = `${dir}/${e.name}`;
    const rel = `${prefix}/${e.name}`;
    if (e.isDirectory()) collect(p, rel);
    else {
      const size = statSync(p).size;
      if (size <= MAX_FILE) files.set(rel, size);
    }
  }
};

collect("out/_next", "/_next");
// v17.1 — ref-index.json : fiche de références statique (14 Ko) qui remplace
// l'index de recherche complet pour les favoris/récents. Doit être hors-ligne.
for (const f of ["/ref-index.json"]) {
  try { files.set(f, statSync(`out${f}`).size); } catch { /* غائب */ }
}
// v17.4 — un fichier de réévaluation par protocole (~1,7 Ko gzip chacun) : les précacher
// tous coûte ~110 Ko pour un gain de 70 Ko de JS en moins, et garantit qu'une fiche
// ouverte en ligne garde sa boucle de réévaluation en mode avion.
try {
  for (const f of readdirSync("out/reval")) {
    const p = `out/reval/${f}`;
    if (statSync(p).isFile()) files.set(`/reval/${f}`, statSync(p).size);
  }
} catch { /* pas encore généré */ }
// v17.4 — حمولات التنقّل الداخلي (RSC) لكل صفحات التفاصيل: `index.txt` هو ما يطلبه Router
// فعليًا عند النقر (`?_rsc=…` مُتَجاهَل عند المطابقة) و`_tree.txt` يُكمل شكل الشجرة.
// بلا هذه الخطوة تُفتح القوائم دون اتصال لكن **لا** تُفتح أي فيشة: النقر ينهار إلى تنقّل كامل
// ثم إلى صفحة «دون اتصال». الكلفة الإجمالية ~577 Ko gzip (98 بروتوكول + 74 دواء + 122 حاسبة)
// مقابل أن كل صفحة تفاصيل تُفتح دون اتصال من أول زيارة — جوهر الوعد «100 % hors-ligne».
// (HTML الكامل لهذه الصفحات يبقى خارج المخزون: +22.6 Mo، غير مبرَّر على هاتف متواضع.)
const collectRoutePayloads = (root) => {
  let n = 0;
  const walk = (dir, urlPrefix) => {
    for (const f of ["index.txt", "__next._tree.txt"]) {
      try {
        files.set(`${urlPrefix}/${f}`, statSync(`${dir}/${f}`).size);
        n++;
      } catch { /* غير موجود */ }
    }
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) walk(`${dir}/${e.name}`, `${urlPrefix}/${e.name}`);
    }
  };
  try {
    for (const e of readdirSync(`out/${root}`, { withFileTypes: true })) {
      if (e.isDirectory()) walk(`out/${root}/${e.name}`, `/${root}/${e.name}`);
    }
  } catch { /* مجلد غائب */ }
  return n;
};
const payloadCount = ["protocoles", "medicaments", "calculateurs"].reduce((a, r) => a + collectRoutePayloads(r), 0);
if (payloadCount) console.log(`PRECACHE: ${payloadCount} حمولة RSC لصفحات التفاصيل`);

for (const f of ["/offline.html", "/offline", "/manifest.webmanifest"]) {
  try { files.set(f, statSync(`out${f}`).size); } catch { /* غائب */ }
}
for (const d of ["icons", "fonts"]) {
  try { collect(`out/${d}`, `/${d}`); } catch { /* اختياري */ }
}
// v17.0 — كل مجلد من المستوى الأول يحتوي index.html = صفحة قابلة للتخزين المسبق.
// (المجلدات الفرعية تبقى خارج المخزون: صفحات التفاصيل ثقيلة ومقروءة عند الطلب.)
let tabDirs = 0;
for (const e of readdirSync("out", { withFileTypes: true })) {
  if (!e.isDirectory() || TAG_RE.test(e.name)) continue;
  const indexHtml = `out/${e.name}/index.html`;
  try {
    statSync(indexHtml); // غياب index.html ⇒ ليست صفحة مستقلة
  } catch { continue; }
  for (const f of readdirSync(`out/${e.name}`)) {
    if (f.endsWith(".txt") || f === "index.html") files.set(`/${e.name}/${f}`, statSync(`out/${e.name}/${f}`).size);
  }
  // المسار المجلدي (serve وVercel وGitHub Pages يقدّمون index.html تلقائيًا بـ 200)
  files.set(`/${e.name}/`, statSync(indexHtml).size);
  tabDirs++;
}
console.log(`PRECACHE: ${tabDirs} pages de premier niveau incluses`);

const uniq = [...files.keys()].sort();
const totalMB = ([...files.values()].reduce((a, b) => a + Math.max(b, 0), 0) / 1048576).toFixed(1);

const swPath = "out/sw.js";
let sw = readFileSync(swPath, "utf8");
const marker = "/*__PRECACHE__*/";
if (!sw.includes(`${marker}[]`)) {
  console.error("MARKER MISSING in out/sw.js — أضف const PRECACHE=/*__PRECACHE__*/[];");
  process.exit(1);
}
sw = sw.replace(`${marker}[]`, `${marker}${JSON.stringify(uniq)}`);
writeFileSync(swPath, sw);
console.log(`PRECACHE: ${uniq.length} ملفًا (~${totalMB}MB) → out/sw.js`);
