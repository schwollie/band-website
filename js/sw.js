const CACHE_NAME = 'LYMINA-band-cache-v0.1.015'; // WebP format update
const PREVENT_CACHE = false;
const urlsToCache = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/css/gallery.css',
    '/js/main.js',
    '/js/background.js',
    '/js/gallery.js',
    '/js/tour.js',
    '/assets/images/clouds/cloud1.png',
    '/assets/images/clouds/cloud2.png',
    '/assets/images/clouds/cloud3.png',
    '/assets/images/sun_no_glow.webp',
    '/assets/images/sun_no_glow.png',
    '/assets/images/name.webp',
    '/assets/images/name.png',
    '/assets/images/favicon.png',
    '/assets/icons/instagram.png',
    '/assets/icons/youtube.png',
    '/assets/icons/tiktok.png',
    '/assets/videos/film-grain.mp4',
    '/assets/images/gallery/FeaturedImage.webp',
    '/assets/images/gallery/FeaturedImage.jpg',
    '/assets/images/gallery/galery1.webp',
    '/assets/images/gallery/galery1.jpg',
    '/assets/images/gallery/galery2.webp',
    '/assets/images/gallery/galery2.jpg',
    '/assets/images/gallery/galery3.webp',
    '/assets/images/gallery/galery3.jpg',
    '/assets/images/gallery/galery4.webp',
    '/assets/images/gallery/galery4.jpg',
    '/assets/images/gallery/galery5.webp',
    '/assets/images/gallery/galery5.jpg',
    '/assets/images/gallery/galery6.webp',
    '/assets/images/gallery/galery6.jpg',
    '/assets/images/gallery/galery7.webp',
    '/assets/images/gallery/galery7.jpg',
    '/assets/images/gallery/galery8.webp',
    '/assets/images/gallery/galery8.jpg',
    '/assets/images/gallery/galery9.webp',
    '/assets/images/gallery/galery9.jpg',
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