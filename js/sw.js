const CACHE_NAME = 'LYMINA-band-cache-v0.0.5'; // Incremented cache version for custom icons
const PREVENT_CACHE = false;
const urlsToCache = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/main.js',
    '/assets/images/sun_no_glow.png',
    '/assets/images/name.png',
    '/assets/images/favicon.png',
    '/assets/icons/instagram.png',
    '/assets/icons/youtube.png',
    '/assets/icons/tiktok.png',
    '/assets/images/gallery/gallery1.jpeg',
    '/assets/images/gallery/gallery2.jpeg',
    '/assets/images/gallery/gallery3.jpeg',
    '/assets/images/gallery/gallery4.jpeg',
    '/assets/images/gallery/gallery5.jpeg',
    'https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Lato:wght@300;400&display=swap',
    'https://fonts.gstatic.com/s/montserrat/v26/JTUSjIg1_i6t8kCHKm459Wlhyw.woff2',
    'https://fonts.gstatic.com/s/lato/v24/S6uyw4BMUTPHjx4wXg.woff2'
];

// Install the service worker and cache assets
self.addEventListener('install', event => {
    if (PREVENT_CACHE) return; // Add this line
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                const requests = urlsToCache.map(url => new Request(url, {cache: 'reload'}));
                return cache.addAll(requests);
            })
    );
});

// Fetch assets from cache or network
self.addEventListener('fetch', event => {
    if (PREVENT_CACHE) return; // Add this line
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request).then(
                        (response) => {
                                if(!response || response.status !== 200 || response.type !== 'basic') {
                                        return response;
                                }
                                var responseToCache = response.clone();
                                caches.open(CACHE_NAME)
                                        .then((cache) => {
                                                cache.put(event.request, responseToCache);
                                        });
                                return response;
                        }
                );
            }
        )
    );
});

// Clean up old caches
self.addEventListener('activate', event => {
    if (PREVENT_CACHE) return; // Add this line
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});