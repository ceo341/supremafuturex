/**
 * ====================================================================
 * SUPREMA FUTURE X // SERVICE WORKER PWA ENGINE V50 EAL6+
 * GOVERNANCE: CEO GIULIANO CARATELLI
 * PROTOCOLLO: EAL6+ SOVRANO // AGGRESSIVE CACHE BUSTING & FLUSH
 * ====================================================================
 */

const CACHE_VERSION = 'v50-eal6-sovrano';
const CACHE_NAME = `sfx-cache-${CACHE_VERSION}`;

// Asset critici per funzionamento offline/PWA
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './login.html',
    './admin.html',
    './crm.html',
    './candidatura.html',
    './stile-globale.css',
    './manifest.json',
    './media/logo.png'
];

/**
 * 1. FASE DI INSTALLAZIONE: FORZATURA IMMEDIATA (SKIP WAITING)
 */
self.addEventListener('install', (event) => {
    console.log(`[SW EAL6+] Installazione Service Worker ${CACHE_VERSION}...`);
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            console.log('[SW EAL6+] Pre-caching asset primari...');
            for (const asset of ASSETS_TO_CACHE) {
                try {
                    await cache.add(new Request(asset, { cache: 'reload' }));
                } catch (err) {
                    console.warn(`[SW EAL6+] Pre-cache non bloccante su ${asset}:`, err.message);
                }
            }
        })
    );
});

/**
 * 2. FASE DI ATTIVAZIONE: DISTRUZIONE TOTALE CACHE PRECEDENTI (V42 E VECCHIE)
 */
self.addEventListener('activate', (event) => {
    console.log(`[SW EAL6+] Attivazione Service Worker ${CACHE_VERSION} - Flush vecchie cache...`);
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((existingCache) => {
                    if (existingCache !== CACHE_NAME) {
                        console.log(`[SW EAL6+] Rimozione cache obsoleta: ${existingCache}`);
                        return caches.delete(existingCache);
                    }
                })
            );
        }).then(() => {
            console.log('[SW EAL6+] Reclamo client immediato (clients.claim)...');
            return self.clients.claim();
        })
    );
});

/**
 * 3. STRATEGIA FETCH: NETWORK FIRST CON PRIORITÀ AGGIORNAMENTO LIVE
 */
self.addEventListener('fetch', (event) => {
    const requestUrl = event.request.url;

    // Esclusione chiamate dinamiche: Google Apps Script, API esterne, metodi non-GET
    if (
        event.request.method !== 'GET' ||
        requestUrl.includes('script.google.com') ||
        requestUrl.includes('api.telegram.org') ||
        requestUrl.includes('google-analytics.com')
    ) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                // Se la risposta è valida, aggiorna in background la cache per le risorse essenziali
                if (
                    networkResponse &&
                    networkResponse.status === 200 &&
                    (networkResponse.type === 'basic' || networkResponse.type === 'cors')
                ) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                // Fallback offline solo in caso di totale assenza di connettività
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // Fallback per navigazione HTML
                    if (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html')) {
                        return caches.match('./index.html');
                    }
                });
            })
    );
});

/**
 * 4. GESTORE MESSAGGI INTER-CLIENT (FORCE FLUSH SU COMANDO)
 */
self.addEventListener('message', (event) => {
    if (event.data && event.data.action === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
