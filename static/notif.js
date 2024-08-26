function subscribe() {
    // Subscribe to push notifications
    if (Notification.permission === "granted") {
        navigator.serviceWorker.register('/static/sw.js')
            .then((registration) => {
                console.log('Service Worker registered:', registration);
                return registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: 'BOCxqPj3Gt_MwKv-xVTDGMC-jtFhdLgNLyRP6Eh8h_VPxTwJmcrfHSlP8Ml3u1iK02h8f3R6Px3PY6j-3-_Tm5Y'
                });
            })
            .then((subscription) => {
                console.log('Push notification subscription:', subscription);
                // console.log(JSON.stringify(subscription));
                fetch('/subscribe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(subscription)
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error('Failed to send subscription to application server');
                        }
                        alert('Successfully subscribed to push notifications');
                    })
            })
            .catch((error) => {
                alert('Error subscribing to push notifications:', error);
            });
    }
    else {
        // alert('You must grant permission to receive notifications');
        Notification.requestPermission()
            .then((permission) => {
                if (permission === "granted") {
                    subscribe();
                }
            });
    }
}