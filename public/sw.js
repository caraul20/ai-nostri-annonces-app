// Service Worker pentru Ai Nostri PWA
// Version: 1.0.0

const CACHE_NAME = 'ai-nostri-v1';
const OFFLINE_URL = '/offline.html';

// Resurse pentru pre-cache
const PRECACHE_URLS = [
  '/',
  '/new',
  '/login',
  '/offline.html',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-256.png',
  '/icons/icon-384.png',
  '/icons/icon-512.png',
];

// Install event - pre-cache resurse esențiale
self.addEventListener('install', (event) => {
  console.log('[SW] Install event');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Pre-caching resources');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => {
        // Force activate new SW
        return self.skipWaiting();
      })
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Take control of all clients
        return self.clients.claim();
      })
  );
});

// Fetch event - cache strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip Chrome extensions
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  event.respondWith(handleFetch(request));
});

async function handleFetch(request) {
  const url = new URL(request.url);
  
  try {
    // Strategy 1: Static assets (CSS, JS, fonts) - Stale While Revalidate
    if (isStaticAsset(url)) {
      return await staleWhileRevalidate(request);
    }
    
    // Strategy 2: Images (local and remote) - Cache First
    if (isImage(url)) {
      return await cacheFirst(request);
    }
    
    // Strategy 3: HTML pages - Network First with offline fallback
    if (isHTMLRequest(request)) {
      return await networkFirstWithOfflineFallback(request);
    }
    
    // Strategy 4: API calls - Network Only (mock data)
    if (isAPIRequest(url)) {
      return await fetch(request);
    }
    
    // Default: Network First
    return await networkFirst(request);
    
  } catch (error) {
    console.error('[SW] Fetch error:', error);
    
    // Fallback pentru HTML requests
    if (isHTMLRequest(request)) {
      const cache = await caches.open(CACHE_NAME);
      return await cache.match(OFFLINE_URL);
    }
    
    throw error;
  }
}

// Cache Strategies

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  });
  
  return cachedResponse || fetchPromise;
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  const networkResponse = await fetch(request);
  
  if (networkResponse.ok) {
    // Cache images with size limit
    const cacheSize = await getCacheSize(cache);
    if (cacheSize < 200) { // Max 200 entries
      cache.put(request, networkResponse.clone());
    }
  }
  
  return networkResponse;
}

async function networkFirstWithOfflineFallback(request) {
  const cache = await caches.open(CACHE_NAME);
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback to offline page for navigation requests
    if (request.mode === 'navigate') {
      return await cache.match(OFFLINE_URL);
    }
    
    throw error;
  }
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Helper functions

function isStaticAsset(url) {
  return url.pathname.startsWith('/_next/static/') ||
         url.pathname.startsWith('/icons/') ||
         url.pathname.endsWith('.css') ||
         url.pathname.endsWith('.js') ||
         url.pathname.endsWith('.woff') ||
         url.pathname.endsWith('.woff2') ||
         url.pathname === '/manifest.webmanifest';
}

function isImage(url) {
  return url.pathname.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i) ||
         url.hostname === 'images.unsplash.com' ||
         url.hostname === 'firebasestorage.googleapis.com';
}

function isHTMLRequest(request) {
  return request.mode === 'navigate' ||
         request.headers.get('accept')?.includes('text/html');
}

function isAPIRequest(url) {
  return url.pathname.startsWith('/api/');
}

async function getCacheSize(cache) {
  const keys = await cache.keys();
  return keys.length;
}

// Background sync for offline actions (future enhancement)
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // TODO: Sync offline actions when back online
  console.log('[SW] Performing background sync');
}

// Push notifications (future enhancement)
self.addEventListener('push', (event) => {
  console.log('[SW] Push received');
  
  const options = {
    body: 'Anunț nou în comunitatea ta!',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Vezi anunțul',
        icon: '/icons/icon-192.png'
      },
      {
        action: 'close',
        title: 'Închide',
        icon: '/icons/icon-192.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Ai Nostri', options)
  );
});

console.log('[SW] Service Worker loaded successfully');
