/* Service worker maison (compatible output:'export', déployable en sous-chemin GitHub Pages).
   Stratégie : précache du shell + réseau-abord pour la navigation, repli hors-ligne.
   BASE est calculé depuis la portée d'enregistrement (robuste quel que soit le sous-chemin). */
const VERSION = "eutn-v18.1"; // مُزامن مع lib/version.ts — حارس الاختبار يفشل عند الانفراق
const BASE = new URL(self.registration.scope).pathname.replace(/\/$/, ""); // "" ou "/espace_urgence"
const CORE = [`${BASE}/`, `${BASE}/manifest.webmanifest`, `${BASE}/offline.html`];
const PRECACHE = /*__PRECACHE__*/[]; // يُحقن بعد البناء بواسطة scripts/gen-precache.mjs (v15.3)

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => Promise.allSettled([...CORE, ...PRECACHE.map((p) => `${BASE}${p}`)].map((u) => cache.add(u)))).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  // Navigations : réseau d'abord, cache ensuite, page hors-ligne en dernier recours
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(VERSION).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(async () => {
          const hit = await caches.match(req, { ignoreSearch: true });
          if (hit) return hit;
          // v15.3 — صيغ بديلة: ملف .html ثم الصيغة المجلدية، ثم صفحة الإيقاف (المسار المباشر أولًا
          // لأن نسخة offline.html المتحيّلة عبر 301 يرفضها المتصفح للتنقّل)، وأخيرًا ارتداد تركيبي مضمّن.
          // v17.4 — الصيغ الأربع كلّها تُجرَّب: التنقّل الداخلي الفاشل يعيد المتصفح إلى تنقّل كامل
          // بعنوان ينتهي بشرطة مائلة (`/protocoles/acr-adulte/`) بينما الزيارة المباشرة تُخزَّن بلا
          // شرطة (`/protocoles/acr-adulte`) — بلا هذا التطبيع تُخدَم صفحة «دون اتصال» لفيشة مخزَّنة.
          const clean = url.pathname.replace(/\.html$/, "").replace(/\/+$/, "");
          const cands = [
            `${BASE}${clean}`,
            `${BASE}${clean}/`,
            `${BASE}${clean}.html`,
            `${BASE}${clean}/index.html`,
          ];
          for (const c of cands) {
            const m = await caches.match(c, { ignoreSearch: true });
            if (m) return m;
          }
          const off = (await caches.match(`${BASE}/offline`)) || (await caches.match(`${BASE}/offline.html`));
          return norm || dir || off || new Response(`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>دون اتصال</title></head><body style="font-family:system-ui,sans-serif;display:grid;place-items:center;height:100vh;margin:0;background:#0A0F15;color:#E9EFF6"><div style="text-align:center;padding:24px"><div style="font-size:44px">📡</div><p style="font-size:18px;font-weight:800;margin:12px 0 4px">لا يوجد اتصال — Hors-ligne</p><p style="opacity:.7;font-size:13px;margin:0">هذه الصفحة لم تُخزَّن بعد — الصفحات المفتوحة سابقًا تبقى متاحة دون اتصال.</p></div></body></html>`, { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } });
        })
    );
    return;
  }

  // v17.4 — حمولات RSC لـ Next (تنقّل داخلي بين القائمة والفيشة): تُخزَّن كالأصول، وإلا فشل
  // النقر على بطاقة دون اتصال ثم تحوّل Router إلى تنقّل كامل انتهى بصفحة «دون اتصال».
  // المفتاح يُسجَّل بلا معامل `_rsc` (يتغيّر في كل طلب) والمطابقة تتجاهل الاستعلام.
  if (req.headers.get("RSC") === "1" || url.pathname.endsWith(".txt")) {
    const key = new Request(new URL(url.pathname, url.origin).href);
    event.respondWith(
      caches
        .match(req, { ignoreSearch: true })
        .then((hit) => {
          const refresh = fetch(req)
            .then((res) => {
              if (res.ok) {
                const copy = res.clone();
                caches.open(VERSION).then((c) => c.put(key, copy));
              }
              return res;
            })
            .catch(() => null);
          return hit || refresh;
        })
        .then((res) => res || Response.error())
    );
    return;
  }

  // Assets (_next, icônes, fonts) : cache-abord avec mise à jour réseau en arrière-plan.
  // v17.4 — ref-index.json est ajouté : sans cette branche, il n'est ni intercepté ni
  // servi hors-ligne (favoris et récents disparaîtraient en mode avion).
  // v17.4 — /reval/ (un fichier par protocole) : même traitement, sinon la boucle de
  // réévaluation disparaîtrait d'une fiche rouverte hors-ligne.
  if (
    url.pathname.startsWith(`${BASE}/_next/`) ||
    url.pathname.startsWith(`${BASE}/icons/`) ||
    url.pathname.startsWith(`${BASE}/reval/`) ||
    url.pathname === `${BASE}/ref-index.json`
  ) {
    event.respondWith(
      caches.match(req).then((hit) => {
        const refresh = fetch(req).then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(VERSION).then((c) => c.put(req, copy));
          }
          return res;
        });
        return hit || refresh;
      })
    );
    return;
  }
});
