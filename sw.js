const CACHE_NAME = 'cham-cong-v3.30';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './github-sync.js',
    './logo.jpg',
    './manifest.json',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Outfit:wght@500;700&display=swap'
];

// Install Service Worker and cache assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate & Cleanup old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((name) => {
                    if (name !== CACHE_NAME) {
                        return caches.delete(name);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch Strategy: Stale-While-Revalidate for core files
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    const isCoreFile = ASSETS.some(asset => event.request.url.includes(asset.replace('./', '')));

    if (isCoreFile) {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                const fetchPromise = fetch(event.request).then((networkResponse) => {
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, networkResponse.clone());
                    });
                    return networkResponse;
                });
                return cachedResponse || fetchPromise;
            })
        );
    } else {
        // Cache First for external resources / fonts
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request).then(fetchResponse => {
                    return caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, fetchResponse.clone());
                        return fetchResponse;
                    });
                });
            })
        );
    }
});
