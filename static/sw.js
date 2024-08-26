self.addEventListener('push', function(event) {
    const data = event.data.json();
    const options = {
        body: data.body,
        // icon: '/path/to/icon.png',
        // badge: '/path/to/badge.png',
        // Add more options as needed
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    // Handle notification click event
    // Add your custom logic here
});