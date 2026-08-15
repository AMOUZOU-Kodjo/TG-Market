/* global self, clients */
import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from "workbox-precaching";
import { registerRoute, NavigationRoute } from "workbox-routing";

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

registerRoute(new NavigationRoute(createHandlerBoundToURL("index.html")));

const APP_URL = self.location.origin;

function buildNotification(payload) {
  const data = payload?.data ?? {};
  return {
    title: payload?.title || "TG-Market",
    body: payload?.body || "",
    icon: `${APP_URL}/logo-tg.png`,
    badge: `${APP_URL}/pwa-192x192.png`,
    data,
    tag: payload?.tag || undefined,
    renotify: Boolean(payload?.tag),
    timestamp: Date.now(),
  };
}

self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? JSON.parse(event.data.text()) : {};
  } catch {
    // payload vide : notification par défaut
  }
  const { title, ...options } = buildNotification(payload);
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          if ("focus" in client) {
            client.focus();
            client.navigate(url);
            return;
          }
        }
        return clients.openWindow(url);
      }),
  );
});