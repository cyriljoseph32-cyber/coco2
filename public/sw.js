/* Coco AI Concierge — Service Worker
   Strategy:
   - /api/*  -> always network (chat must be live, never cached)
   - navigations (HTML) -> network first, fall back to cached shell when offline
   - other static assets -> cache first, update in background
   Bump CACHE_VERSION whenever you ship a new index.html / icons so users get the update.
*/
const CACHE_VERSION = "coco-v1";
const CORE_ASSETS = [
  "/",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-touch-icon.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET
  if (request.method !== "GET") return;

  // Never cache the API — chat must be live
  if (url.pathname.startsWith("/api/")) {
    return; // let the browser handle it normally
  }

  // HTML navigations: network first, fallback to cached shell
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((resp) => {
          const copy = resp.clone();
          caches.open(CACHE_VERSION).then((c) => c.put("/", copy));
          return resp;
        })
        .catch(() => caches.match("/").then((r) => r || caches.match(request)))
    );
    return;
  }

  // Other GET assets: cache first, refresh in background
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((resp) => {
          if (resp && resp.status === 200 && resp.type === "basic") {
            const copy = resp.clone();
            caches.open(CACHE_VERSION).then((c) => c.put(request, copy));
          }
          return resp;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
