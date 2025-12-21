
const CACHE_NAME = 'kitchen-vault-v3';
const ASSETS = [
  './',
  './index.html',
  './book.svg',
  './chef_2.svg',
  './healthy-food_3.svg',
  './cooking_tools.svg',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // 使用相對路徑確保在子目錄下也能正確載入
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // 網路優先策略或快取優先，這裡使用簡單的快取優先
      return response || fetch(event.request);
    })
  );
});
