
const CACHE_NAME = 'kitchen-vault-v1';
const ASSETS = [
  './',
  './index.html',
  './book.svg',
  './chef_2.svg',
  './cooking_tools.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
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
