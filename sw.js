/**
 * ====================================================================
 * SUPREMA FUTURE X S.R.L. // SERVICE WORKER PWA ENGINE V35
 * GOVERNANCE: CEO GIULIANO CARATELLI
 * PROTOCOLLO: EAL6+ SOVRANO // CACHE STRATEGY & OFFLINE RESILIENCE
 * ====================================================================
 */

const CACHE_NAME = 'sfx-pwa-v35-eal6';
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
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&family=Orbitron:wght@500;700;900&family=Syncopate:wght@400;700&family=JetBrains+Mono:wght@400;700&display=swap'
];

/**
 * 1. FASE DI INSTALLAZIONE SERVICE WORKER (PRE-CACHING CRITICO)
 */
self.addEventListener('install', (event) => {
    console.log('[SW EAL6+] Inizializzazione installazione Service Worker V35...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW EAL6+] Pre-caching asset della piattaforma in corso...');
            return cache.addAll(ASSETS_TO_CACHE);
        }).then(() => {
            return self.skipWaiting();
        }).catch((err) => {
            console.warn('[SW EAL6+] Attenzione: alcuni asset non sono stati pre-caricati:', err);
        })
    );
});

/**
 * 2. FASE DI ATTIVAZIONE (PULIZIA VECCHIE CACHE)
 */
self.addEventListener('activate', (event) => {
    console.log('[SW EAL6+] Attivazione Service Worker EAL6+...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('[SW EAL6+] Rimozione vecchia cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => {
            return self.clients.claim();
        })
    );
});

/**
 * 3. STRATEGIA FETCH INTERCETTAZIONE (NETWORK FIRST CON FALLBACK CACHE)
 */
self.addEventListener('fetch', (event) => {
    // Escludi chiamate Webhook Google Apps Script e metodi non-GET dal Service Worker
    if (event.request.method !== 'GET' || event.request.url.includes('script.google.com')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                // Se la risposta dalla rete è valida, la aggiorniamo in cache
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                // In caso di assenza di rete, restituisci la risorsa dalla cache
                console.log('[SW EAL6+] Connessione assente. Recupero risorsa dalla Cache:', event.request.url);
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // Fallback se la risorsa non è in cache ed è una pagina HTML
                    if (event.request.headers.get('accept').includes('text/html')) {
                        return caches.match('./index.html');
                    }
                });
            })
    );
});
