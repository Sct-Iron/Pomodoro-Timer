const CACHE_NAME = "Pomodoro version-2";
const CACHE_ASSETS = [
    '/',
    'index.html',
    'manifest.json',
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
   e.respondWith(caches.match(e.request).then(res => {
    return res || fetch(e.request)
   }))
})
self.addEventListener("message", e => {
  if (!e.data) return;

  if (e.data.type === 'timer-ended') {
    const { mode, longCycle } = e.data;

    let body = "Time's up ⏰";
    if (mode === 'pomodoro') {
      body = longCycle
        ? "🎉 Four Pomodoros done! Time for a long break!"
        : "Pomodoro complete — take a short break.";
    } else if (mode === 'shortBreak') {
      body = "Short break over — back to focus! 💪";
    } else if (mode === 'longBreak') {
      body = "Long break finished — ready for deep work? 🎯";
    }

    self.registration.showNotification("Pomodoro Timer", {
      body,
      icon: "Icons/icon-192.png",
      badge: "Icons/icon-192.png"
    });
  }
});


self.addEventListener("notificationclick", e => {
    e.notification.close();
    e.waitUntil(
    clients.openWindow("/")
    );  
})
   
