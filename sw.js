/**
 * ====================================================================
 * SUPREMA FUTURE X S.R.L. // SERVICE WORKER PWA ENGINE V35
 * GOVERNANCE: CEO GIULIANO CARATELLI
 * ====================================================================
 */

const CACHE_NAME = 'sfx-pwa-v35-full';

// Elenco integrale delle risorse dell'Ecosistema da memorizzare in cache
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './candidatura.html',
  './login.html',
  './vault.html',
  './admin.html',
  './crm.html',
  './stile-globale.css',
  './js/code.js',
  './sfx-delta-patch.js',
  './manifest.json',
  './media/logo.png',
  './media/alison-avatar.png',
  './media/bg-sfx.png',
  './media/bg-governance.png',
  './media/accademia-corsi.png',
  './media/suprema-gold-card.png',
  './media/boutique-luxury.png',
  './media/alison-lifestyle.png',
  './media/alison-multimedia.png',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js'
];

// FASE 1: INSTALLAZIONE SERVICE WORKER E CACHING RISORSE
self.addEventListener('install', (event) => {
  console.log('[SERVICE WORKER] Installazione in corso. Caching delle risorse PWA...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => {
      console.log('[SERVICE WORKER] ✓ Caching completato al 100%.');
      return self.skipWaiting();
    }).catch((err) => {
      console.warn('[SERVICE WORKER] ✗ Attenzione durante il caching:', err);
    })
  );
});

// FASE 2: ATTIVAZIONE E PULIZIA VECCHIE CACHE
self.addEventListener('activate', (event) => {
  console.log('[SERVICE WORKER] Attivazione in corso...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[SERVICE WORKER] Eliminazione vecchia cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// FASE 3: INTERCETTAZIONE RICHIESTE RETE (NETWORK FIRST WITH CACHE FALLBACK)
self.addEventListener('fetch', (event) => {
  // Ignora le richieste non-GET (es. POST webhook) per farle gestire alla Delta Queue
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Se la risposta è valida, aggiorna la cache in background
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // In caso di assenza di rete, recupera la risorsa dalla cache locale
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Se la pagina non è in cache ed è una navigazione, mostra index.html
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});
