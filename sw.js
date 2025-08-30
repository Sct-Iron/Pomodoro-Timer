const CACHE_NAME = "Pomodoro version-2";
const CACHE_ASSETS = [
    'index.html',
    'manifest.JSON',
    'sw.js',
    'Icons/icon-192.png',
    'Icons/icon-512.png',
    'Sound/clock-alarm-8761(1).mp3',

]
self.addEventListener("install", e => {
    console.log("Service Worker: Installed");
 e.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache => {
        console.log("Service Worker: Caching Files");
        cache.addAll(CACHE_ASSETS);
    })
    .then(() => self.skipWaiting())
)
})
self.addEventListener("activate", e => {
    console.log("Service worker: Activated")

    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log("Service Worker: Clearing Old Cache");
                        return caches.delete(cache)
                    }
                })
            )
        }) 
    )
    self.clients.claim();
})

self.addEventListener("fetch", e => {
    console.log("Service Worker: Fetching");
   e.respondWith(fetch(e.request).catch(() => caches.match(e.request)))
})
self.addEventListener("notificationclick", e => {
    e.notification.close();
    e.waitUntil(
    client.openWindow("/")
    );  
})
   
