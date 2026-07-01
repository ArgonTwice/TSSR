// sw.js — Service Worker TSSR offline-first
const CACHE = 'tssr-v29';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js?v=4',
  './data.js?v=4',
  './diagrams.js?v=4',
  './sw.js',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Inter:wght@400;500;600;700;800&display=swap',
  './favicon.svg',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (!e.request.url.startsWith('http')) return;
  // Ne pas intercepter les appels Firebase API (Firestore, Auth)
  if (e.request.url.includes('googleapis.com') ||
      e.request.url.includes('firebaseio.com') ||
      e.request.url.includes('firebaseapp.com')) return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      const net = fetch(e.request).then(res => {
        if (res.ok && e.request.method === 'GET') {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => cached);
      return cached || net;
    })
  );
});
