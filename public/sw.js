const CACHE_NAME = "simple-cache-v1";
const urlsToCache = ["/dashboard"];

self.addEventListener("install", (event) => {
  const preLoaded = caches
    .open(CACHE_NAME)
    .then((cache) => cache.addAll(urlsToCache));
  event.waitUntil(preLoaded);
});

self.addEventListener("fetch", (event) => {
  const response = caches
    .match(event.request)
    .then((match) => match || fetch(event.request));
  event.respondWith(response);
});

self.addEventListener("message", (event) => {
  if (event.data) {
    showLocalNotification("JWI MESSAGE", event.data, self.registration);
  } else {
    console.log("Push event but no data");
  }
  console.log("Received", event.data);
});

const showLocalNotification = (title, body, swRegistration) => {
  swRegistration.showNotification(title, body);
};

// self.addEventListener("message", function (event) {
//   self.clients.fetchAll().then((clients) => {
//     clients.forEach(function (client) {
//       client.postMessage({ msg: "Hello from SW A" });
//     });
//   });
// });
