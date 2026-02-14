self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("irontrack-v1").then(cache => {
      return cache.addAll([
        "/irontrack/",
        "/irontrack/index.html",
        "/irontrack/styles.css",
        "/irontrack/app.js"
      ]);
    })
  );
});
