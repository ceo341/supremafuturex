// Suprema Future X - Service Worker per Installazione PWA
const CACHE_NAME = 'suprema-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/logo.png',
  '/assets/bg-sfx.jpg'
];

// Fase 1: Installazione della cache base
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fase 2: Attivazione e intercettazione chiamate offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se c'è offline, mostra la cache. Altrimenti naviga normale.
        return response || fetch(event.request);
      })
  );
});
