// Mini serveur statique pour out/ (export statique Next) avec fallback .html
import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve("out");
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".json": "application/json", ".woff2": "font/woff2", ".txt": "text/plain", ".webmanifest": "application/manifest+json", ".ico": "image/x-icon" };

// v17.3 — Les en-têtes de cache sont LUS depuis `public/_headers` (copié en `out/_headers`).
// Une seule source de vérité : ce que Netlify/Cloudflare appliquent en production est
// exactement ce que cet audit local applique. (Avant, les règles étaient codées ici et
// pouvaient diverger de la réalité — un chunk haché revalidé à chaque navigation.)
// Correspondance : première règle qui matche (nos règles spécifiques précèdent le joker).
const FALLBACK = [
  { pattern: "/_next/static/*", cache: "public, max-age=31536000, immutable" },
  { pattern: "/sw.js", cache: "no-cache" },
  { pattern: "/*", cache: "no-cache" },
];

function loadRules() {
  try {
    const txt = readFileSync(path.join(ROOT, "_headers"), "utf8");
    const rules = [];
    let cur = null;
    for (const line of txt.split(/\r?\n/)) {
      if (!line.trim() || line.trim().startsWith("#")) continue;
      if (!/^\s/.test(line)) {
        cur = { pattern: line.trim(), cache: null };
        rules.push(cur);
        continue;
      }
      const m = line.trim().match(/^Cache-Control:\s*(.+)$/i);
      if (m && cur) cur.cache = m[1].trim();
    }
    const usable = rules.filter((r) => r.cache);
    if (usable.length) return usable;
  } catch { /* fichier absent : règles par défaut */ }
  return FALLBACK;
}

const RULES = loadRules().map((r) => ({
  re: new RegExp("^" + r.pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*") + "$"),
  cache: r.cache,
}));

const cacheFor = (url) => (RULES.find((r) => r.re.test(url)) ?? { cache: "no-cache" }).cache;

http.createServer(async (req, res) => {
  try {
    const p = decodeURIComponent(new URL(req.url, "http://x").pathname);
    let file = path.join(ROOT, p);
    if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
    let isDir = false;
    try { isDir = (await stat(file)).isDirectory(); } catch { /* n'existe pas */ }
    if (isDir) {
      if (await stat(path.join(file, "index.html")).then(() => true, () => false)) file = path.join(file, "index.html");
      else { res.writeHead(404); return res.end("404"); }
    } else if (!await stat(file).then(() => true, () => false)) {
      if (await stat(file + ".html").then(() => true, () => false)) file += ".html";
      else { res.writeHead(404, { "Content-Type": "text/html" }); return res.end(await readFile(path.join(ROOT, "404.html")).catch(() => "404")); }
    }
    const ext = path.extname(file);
    const body = await readFile(file);
    res.writeHead(200, { "Content-Type": MIME[ext] ?? "application/octet-stream", "Cache-Control": cacheFor(p) });
    res.end(body);
  } catch { res.writeHead(500); res.end(); }
}).listen(3000, "0.0.0.0", () => console.log("static out/ on :3000"));
