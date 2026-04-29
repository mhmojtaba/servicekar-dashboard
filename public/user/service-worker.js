self.addEventListener("push", (event) => {
  console.log("Push event received", event);
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon || "/dashboard/icons/icon-192.png",
      data: data.url || "/dashboard/",
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data));
});
