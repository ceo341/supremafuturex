/**
 * SUPREMA FUTURE X S.R.L. // PWA SERVICE WORKER EAL6+
 * Governance: Giuliano Caratelli CEO
 * Caching Strategico e Navigazione Offline
 */

const CACHE_NAME = 'sfx-pwa-v2026';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/admin.html',
  '/vault.html',
  '/crm.html',
  '/login.html',
  '/manifest.json',
  '/assets/logo.png',
  '/assets/hero-banner.jpg',
  '/assets/ceo-governance.jpg',
  '/assets/academy-silver.jpg',
  '/assets/academy-gold.jpg',
  '/assets/academy-premium.jpg',
  '/assets/goldcard-preview.png',
  '/assets/alison-avatar.jpg',
  '/assets/boutique-lifestyle.jpg',
  '/assets/multimedia-thumb.jpg'
];

// INSTALLAZIONE E PRE-CACHING
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SFX PWA] Pre-caching risorse di sistema completato.');
      return cache.addAll(ASSETS_TO_CACHE);
    }).catch((err) => {
      console.log('[SFX PWA] Avviso pre-caching:', err);
    })
  );
});

// ATTIVAZIONE E PULIZIA VECCHIE CACHE
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[SFX PWA] Eliminazione vecchia cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// STRATEGIA FETCH: NETWORK FIRST CON FALLBACK CACHE PER DATI DINAMICI
self.addEventListener('fetch', (event) => {
  // Ignora le chiamate API esterne (es. Google Script o Telegram) per evitare di bloccare le POST
  if (event.request.url.includes('script.google.com') || event.request.url.includes('api.telegram.org')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Se la risposta dalla rete è valida, la salva in cache
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // In caso di assenza di rete, recupera dalla cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Fallback generico per la navigazione
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
      })
  );
});
