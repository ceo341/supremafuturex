/**
 * ====================================================================
 * SUPREMA FUTURE X // SERVICE WORKER PWA ENGINE V51 EAL6+
 * GOVERNANCE: CEO GIULIANO CARATELLI
 * PROTOCOLLO: EAL6+ SOVRANO // AGGRESSIVE CACHE BUSTING & FLUSH
 * ====================================================================
 */

const CACHE_VERSION = 'v51-eal6-sovrano';
const CACHE_NAME = `sfx-cache-${CACHE_VERSION}`;

const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './login.html',
    './admin.html',
    './crm.html',
    './candidatura.html',
    './alison.html',
    './vault.html',
    './nexus-control.html',
    './stile-globale.css',
    './manifest.json',
    './media/logo.png',
    './js/code.js',
    './sfx-delta-patch.js'
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            for (const asset of ASSETS_TO_CACHE) {
                try {
                    await cache.add(new Request(asset, { cache: 'reload' }));
                } catch (err) {}
            }
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((existingCache) => {
                    if (existingCache !== CACHE_NAME) {
                        return caches.delete(existingCache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const requestUrl = event.request.url;

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
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) return cachedResponse;
                    if (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html')) {
                        return caches.match('./index.html');
                    }
                });
            })
    );
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.action === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
