'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    // Only register in production and in browser
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      registerServiceWorker();
    }
  }, []);

  const registerServiceWorker = async () => {
    try {
      console.log('[PWA] Registering Service Worker...');
      
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('[PWA] Service Worker registered successfully:', registration);

      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        if (newWorker) {
          console.log('[PWA] New Service Worker installing...');
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // New update available
                console.log('[PWA] New content available, will refresh...');
                showUpdateNotification();
              } else {
                // Content cached for first time
                console.log('[PWA] Content cached for offline use');
                showOfflineReadyNotification();
              }
            }
          });
        }
      });

      // Handle controller change (new SW activated)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('[PWA] New Service Worker activated, reloading...');
        window.location.reload();
      });

    } catch (error) {
      console.error('[PWA] Service Worker registration failed:', error);
    }
  };

  const showUpdateNotification = () => {
    // Simple notification - could be enhanced with a toast component
    if (confirm('O versiune nouă este disponibilă! Vrei să actualizezi aplicația?')) {
      // Tell the new SW to skip waiting and become active
      navigator.serviceWorker.ready.then((registration) => {
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      });
    }
  };

  const showOfflineReadyNotification = () => {
    console.log('[PWA] App is ready to work offline!');
    
    // Could show a subtle notification
    const event = new CustomEvent('pwa-offline-ready', {
      detail: { message: 'Aplicația funcționează acum și offline!' }
    });
    window.dispatchEvent(event);
  };

  // This component doesn't render anything
  return null;
}

// Listen for messages from SW
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    const { type, payload } = event.data;
    
    switch (type) {
      case 'SW_UPDATE_AVAILABLE':
        console.log('[PWA] Update available:', payload);
        break;
      case 'SW_OFFLINE_READY':
        console.log('[PWA] Offline ready:', payload);
        break;
      default:
        console.log('[PWA] SW message:', event.data);
    }
  });
}
