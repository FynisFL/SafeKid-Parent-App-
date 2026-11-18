const CACHE = 'safekid-pwa-v7-mobile-shell-r24';
const CACHE_PREFIX = 'safekid-pwa-v7-mobile-shell-';
const CORE = [
  './',
  './assets/brand/app-icon-192.png',
  './assets/brand/app-icon-512.png',
  './assets/brand/favicon-32.png',
  './assets/brand/safekid-logo-trimmed.png',
  './assets/illustrations/family-walk.webp',
  './assets/illustrations/mascot-cheer.webp',
  './assets/illustrations/mascot-wave.webp',
  './content/brand.en.md',
  './content/brand.vi.md',
  './content/faq.en.md',
  './content/faq.vi.md',
  './content/sfai-responses.md',
  './index.html',
  './manifest.webmanifest',
  './src/adapters/native.js',
  './src/adapters/platform.js',
  './src/adapters/storage.js',
  './src/config/map.js',
  './src/data/content.js',
  './src/domain/geofence.js',
  './src/domain/geojson.js',
  './src/domain/growth.js',
  './src/domain/safe-zone.js',
  './src/domain/sfai.js',
  './src/domain/sos.js',
  './src/main.js',
  './src/mobile-refinements.css',
  './src/motion.css',
  './src/responsive.css',
  './src/services/backup.js',
  './src/services/geocoding.js',
  './src/styles.css',
  './src/ui/touch-controls.js',
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE)
    .then(cache => cache.addAll(CORE))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys()
    .then(keys => Promise.all(keys
      .filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE)
      .map(key => caches.delete(key))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  if (!request.url.startsWith(self.registration.scope)) return;
  event.respondWith(serveRequest(request));
});

async function serveRequest(request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    return await fetch(request);
  } catch (error) {
    if (request.mode === 'navigate') {
      const shell = await cache.match('./index.html');
      if (shell) return shell;
    }
    throw error;
  }
}
