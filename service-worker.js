self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("attendance-cache").then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/style.css",
        "/script.js",
        "/manifest.json",
        "/icon-192.png",
        "/icon-512.png"
        // Add any other pages or assets like attendance.html etc
      ]);
    })
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
