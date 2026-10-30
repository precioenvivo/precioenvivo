// Incluye el service worker de OneSignal (notificaciones push). Si no carga, la página sigue funcionando.
try { importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js'); } catch (e) {}

// Service worker mínimo: primero red (siempre la versión nueva), y si no hay internet usa la copia guardada.
const CACHE = 'tasas-v2';
const BASE = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(BASE)).catch(() => {})); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return;   // tasas, hoja de precios y fuentes siempre van a la red
  e.respondWith(fetch(r).then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)).catch(() => {}); return res; }).catch(() => caches.match(r).then(m => m || caches.match('index.html'))));
});
