self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("irontrack").then(cache => {
      return cache.addAll([
        "/",
        "/index.html",
        "/styles.css",
        "/app.js"
      ]);
    })
  );
});
