/**
 * Kill switch for the Create React App service worker this site used to ship.
 *
 * That worker precached the app shell, so visitors who loaded the site while it
 * was registered keep being served the old HTML and JS — new deploys never
 * reach them, and the unregister call in src/index.jsx cannot help because it
 * lives in the bundle the worker refuses to update.
 *
 * Browsers poll this URL for worker updates. Serving this file instead means
 * the old worker installs it, at which point it deletes every cache, removes
 * its own registration, and reloads any open tab onto the live site.
 *
 * Safe to delete once traffic from that period has aged out.
 */
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();

      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach((client) => client.navigate(client.url));
    })()
  );
});
