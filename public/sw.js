const CACHE_NAME = "little-ears-storybox-v6";
const SCOPE_PATH = new URL(self.registration.scope).pathname.replace(/\/$/, "");
const scopedPath = (path) => `${SCOPE_PATH}${path}`;
const CORE_ASSETS = [
  scopedPath("/"),
  scopedPath("/index.html"),
  scopedPath("/manifest.webmanifest"),
  scopedPath("/icon-192.svg"),
  scopedPath("/icon-512.svg")
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);

  if (
    event.request.headers.has("range") ||
    event.request.destination === "audio" ||
    url.pathname.endsWith(".mp3")
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (!response.ok || response.type !== "basic") {
          return response;
        }
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(() => {
          // Some browser responses are not cacheable; network playback should continue.
        });
        return response;
      })
      .catch(() =>
        caches.match(event.request).then((cached) => cached || caches.match(scopedPath("/index.html")))
      )
  );
});
