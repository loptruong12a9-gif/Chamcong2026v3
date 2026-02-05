const CACHE_NAME = 'cham-cong-v3.15';
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

// Fetch Strategy: Network First for main files, Cache First for static assets
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Check if it's one of our core files
    const isCoreFile = ASSETS.some(asset => event.request.url.includes(asset.replace('./', '')));

    if (isCoreFile && !url.href.includes('fonts.googleapis.com')) {
        // Network First for main logic/layout
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    const clonedResponse = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clonedResponse));
                    return response;
                })
                .catch(() => caches.match(event.request))
        );
    } else {
        // Cache First for fonts, images, etc.
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
