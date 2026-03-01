// Basic Service Worker for PWA
const CACHE_NAME = 'autoexpert-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/css/output.css',
    '/manifest.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS).catch(err => console.warn('Cache addAll failed:', err));
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
