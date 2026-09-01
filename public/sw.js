/* Service worker maison (compatible output:'export', sans next-pwa).
   Stratégie : précache du shell + network-first sur la navigation, repli hors-ligne. */
const VERSION = "eutn-v1";
const CORE = ["/", "/manifest.webmanifest", "/offline.html"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || !req.url.startsWith(location.origin)) return;

  // Navigations : réseau d'abord, sinon cache, sinon page hors-ligne
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(req, copy));
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(req);
          return cached || caches.match("/offline.html");
        })
    );
    return;
  }

  // Assets : cache d'abord, mise à jour en arrière-plan
  event.respondWith(
    caches.match(req).then((cached) => {
      const fetching = fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => cached);
      return cached || fetching;
    })
  );
});
