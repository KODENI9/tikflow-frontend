// =============================================================================
// TikFlow Service Worker
// =============================================================================
// Handles:
//   - Push notifications (existing, unchanged)
//   - App badge via Badging API (new)
//   - notificationclick: open URL and clear badge when applicable (existing + badge)
//   - Fetch: basic passthrough (existing, required for PWA installability)
// =============================================================================

// ---------------------------------------------------------------------------
// Badge helpers (safe wrappers around Badging API)
// ---------------------------------------------------------------------------

/**
 * Set the PWA app badge to `count`. Silently does nothing if not supported.
 * @param {number} count
 */
function setNativeBadge(count) {
  if ('setAppBadge' in self.navigator) {
    self.navigator.setAppBadge(Math.max(0, count)).catch(() => {});
  }
}

/**
 * Clear the PWA app badge. Silently does nothing if not supported.
 */
function clearNativeBadge() {
  if ('clearAppBadge' in self.navigator) {
    self.navigator.clearAppBadge().catch(() => {});
  }
}

// ---------------------------------------------------------------------------
// Push event — existing behavior preserved, badge added
// ---------------------------------------------------------------------------

self.addEventListener('push', function(event) {
  if (!event.data) return;

  const data = event.data.json();

  const options = {
    body: data.body,
    icon: data.icon || '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/dashboard/notifications',
      // Pass the unread count from the push payload if available
      unreadCount: data.unreadCount ?? null,
    },
    requireInteraction: true,
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options).then(() => {
      // Update badge:
      // If the push payload includes an explicit unread count, use it (accurate).
      // Otherwise, fall back to reading the current badge and incrementing by 1.
      if (typeof data.unreadCount === 'number' && data.unreadCount >= 0) {
        setNativeBadge(data.unreadCount);
      } else {
        // Increment the current badge by 1 as a best-effort fallback.
        // The real count will be synced when the user opens the app.
        if ('getAppBadge' in self.navigator) {
          self.navigator.getAppBadge().then(current => {
            setNativeBadge((current || 0) + 1);
          }).catch(() => setNativeBadge(1));
        } else {
          // No getAppBadge — just set to 1 as minimum indicator
          setNativeBadge(1);
        }
      }
    })
  );
});

// ---------------------------------------------------------------------------
// Notification click — existing behavior preserved, badge updated
// ---------------------------------------------------------------------------

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/dashboard/notifications';

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(function(windowClients) {
        // If a window is already open at that URL, focus it
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // Otherwise open a new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
      .then(() => {
        // The page will sync the real badge count via Firestore once open.
        // We don't clear the badge here because there may still be other
        // unread notifications. The NotificationBell component will call
        // updateAppBadge() with the real count when it mounts.
      })
  );
});

// ---------------------------------------------------------------------------
// Message from the app — allows the page to push a badge count to the SW
// ---------------------------------------------------------------------------

self.addEventListener('message', function(event) {
  if (!event.data) return;

  if (event.data.type === 'UPDATE_BADGE') {
    const count = event.data.count;
    if (typeof count === 'number') {
      setNativeBadge(count);
    }
  }

  if (event.data.type === 'CLEAR_BADGE') {
    clearNativeBadge();
  }
});

// ---------------------------------------------------------------------------
// Fetch — required for PWA installability (passthrough)
// ---------------------------------------------------------------------------

self.addEventListener('fetch', function(event) {
  // Passthrough — no caching strategy needed
});
