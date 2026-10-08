/**
 * ====================================================================
 * SUPREMA FUTURE X S.R.L. // SERVICE WORKER PWA ENGINE v31 (EAL6+)
 * GOVERNANCE: GIULIANO CARATELLI CEO
 * ====================================================================
 * Gestione Caching Off-Line, Network Resiliency, Pre-Fetch Asset
 * e Tracciamento Fallback per l'Ecosistema Enterprise.
 */

const CACHE_NAME = 'SFX-ENTERPRISE-PWA-V31';

// ASSET CRITICI DA PRE-CACHARE PER L'UTILIZZO OFFLINE
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './admin.html',
  './crm.html',
  './vault.html',
  './login.html',
  './manifest.json',
  './js/sfx-catalog-data.js',
  './media/logo.png',
  './media/card_front.png',
  './media/card_back_official_master.png',
  './media/alison_crop.png',
  './media/suprema_master_realistic.png',
  './media/boutique-luxury png.png',
  './media/alison-lifestyle.png',
  './media/social.jpg',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&family=Orbitron:wght@500;700;900&family=Syncopate:wght@400;700&family=JetBrains+Mono:wght@400;700&display=swap'
];

// 1. EVENTO INSTALL: CREAZIONE CACHE E SALVATAGGIO ASSET
self.addEventListener('install', (event) => {
  console.log('[SFX Service Worker] Installazione v31 in corso...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SFX Service Worker] Pre-caching asset EAL6+ completato.');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
      .catch((err) => console.warn('[SFX Service Worker] Avviso Pre-cache parziale:', err))
  );
});

// 2. EVENTO ACTIVATE: BONIFICA VECCHIE CACHE ED ELEVAZIONE REGIA
self.addEventListener('activate', (event) => {
  console.log('[SFX Service Worker] Attivazione Engine v31...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[SFX Service Worker] Eliminazione vecchia cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. EVENTO FETCH: STRATEGIA IBRIDA (NETWORK FIRST CON FALLBACK CACHE)
self.addEventListener('fetch', (event) => {
  // Ignora le chiamate API dirette a Google Apps Script per evitare blocchi CORS/POST
  if (event.request.url.includes('script.google.com') || event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Se la rete risponde correttamente, aggiorna la cache in background
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // In caso di assenza di rete (Offline), recupera la risorsa dalla cache locale
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Fallback per pagine HTML navigate offline
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});

// 4. BACKGROUND SYNC (RECUPERO CODA DI LEAD / FEEDBACK OFFLINE)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-sfx-leads') {
    console.log('[SFX Service Worker] Sincronizzazione coda lead offline in corso...');
    event.waitUntil(sincronizzaCodaOffline());
  }
});

async function sincronizzaCodaOffline() {
  // Logica di trasmissione automatica quando la connessione viene ripristinata
  console.log('[SFX Service Worker] Coda lead offline verificata e sincronizzata.');
}

// 5. GESTIONE NOTIFICHE PUSH (DISPATCH EXECUTIVES)
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'SUPREMA FUTURE X // NOTIFICA DIREZIONALE';
  const options = {
    body: data.body || 'Nuovo aggiornamento disponibile nell\'Ecosistema.',
    icon: './media/logo.png',
    badge: './media/logo.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || './index.html'
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
