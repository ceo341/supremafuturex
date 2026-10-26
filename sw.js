/**
 * ============================================================================
 * SUPREMA FUTURE X S.R.L. // SERVICE WORKER PWA ENGINE EAL6+
 * FILE: sw.js (Root)
 * CACHE REVISION: SFX-PWA-V55.0-MASTER
 * GOVERNANCE: CEO GIULIANO CARATELLI
 * ============================================================================
 */

const CACHE_NAME = 'sfx-pwa-v55-master';

// Risorse statiche prioritarie per funzionamento PWA e offline
const STATIC_ASSETS = [
  './',
  'index.html',
  'candidatura.html',
  'alison.html',
  'login.html',
  'crm.html',
  'admin.html',
  'vault.html',
  'manifest.json',
  'sfx-delta-patch.js',
  'stile-globale.css?v=55',
  'media/logo.png',
  'js/connettore-api.js',
  'js/code.js'
];

// 1. INSTALLAZIONE: Memorizzazione immediata e skipWaiting
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW EAL6+]: Memorizzazione cache statica v55 avviata');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW EAL6+]: Asset non bloccante omesso dalla precache:', err);
      });
    })
  );
  self.skipWaiting();
});

// 2. ATTIVAZIONE: Purga totale di qualsiasi vecchia cache precedente
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[SW EAL6+]: Eliminata vecchia cache obsoleta:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. FETCH STRATEGY: Network-First per API/HTML, Cache-Fallback per Offline
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Non intercettare chiamate backend a Google Script o endpoint esterni POST
  if (url.origin.includes('script.google.com') || req.method !== 'GET') {
    return;
  }

  // Network-First con fallback su Cache per mantenere i dati sempre allineati
  event.respondWith(
    fetch(req)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const resClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, resClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Fallback offline dalla cache
        return caches.match(req).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (req.headers.get('accept') && req.headers.get('accept').includes('text/html')) {
            return caches.match('index.html');
          }
        });
      })
  );
});
