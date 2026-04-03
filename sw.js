const CACHE_NAME = "author-card-prototype-v5-2026-04-03-B";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css?v=LOCAL-2026-04-03-B",
  "./app.js?v=LOCAL-2026-04-03-B",
  "./manifest.webmanifest?v=LOCAL-2026-04-03-B",
  "./phaser/game.js?v=LOCAL-2026-04-03-B"
];
const SHELL_ASSET_PATHS = new Set(["/", "/index.html", "/styles.css", "/app.js", "/manifest.webmanifest"]);

function isShellAsset(requestUrl) {
  const url = new URL(requestUrl);
  return SHELL_ASSET_PATHS.has(url.pathname);
}

function isVersionedAppAsset(requestUrl) {
  const url = new URL(requestUrl);
  if (url.origin !== self.location.origin) return false;
  return (
    isShellAsset(requestUrl) ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".html") ||
    url.pathname.endsWith(".webmanifest")
  );
}

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const isHtmlRequest =
    event.request.mode === "navigate" ||
    (event.request.headers.get("accept") || "").includes("text/html");

  if (isHtmlRequest) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match("./index.html")))
    );
    return;
  }

  if (isVersionedAppAsset(event.request.url)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request).then((response) => {
        const cloned = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
        return response;
      });
      return cached || networkFetch;
    })
  );
});
