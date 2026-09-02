/* Service worker maison (compatible output:'export', déployable en sous-chemin GitHub Pages).
   Stratégie : précache du shell + réseau-abord pour la navigation, repli hors-ligne.
   BASE est calculé depuis la portée d'enregistrement (robuste quel que soit le sous-chemin). */
const VERSION = "eutn-v3";
const BASE = new URL(self.registration.scope).pathname.replace(/\/$/, ""); // "" ou "/espace_urgence"
const CORE = [`${BASE}/`, `${BASE}/manifest.webmanifest`, `${BASE}/offline.html`];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting())
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
          // Pages exportées en .html : repli sur l'URL normalisée
          const norm = await caches.match(`${BASE}${url.pathname.replace(/\.html$/, "")}.html`);
          return norm || caches.match(`${BASE}/offline.html`);
        })
    );
    return;
  }

  // Assets (_next, icônes, fonts) : cache-abord avec mise à jour réseau en arrière-plan
  if (url.pathname.startsWith(`${BASE}/_next/`) || url.pathname.startsWith(`${BASE}/icons/`)) {
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
