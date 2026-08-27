/**
 * badge.ts — Badging API utility
 *
 * Provides a single centralized function to update the PWA app badge
 * using the native Badging API (setAppBadge / clearAppBadge).
 *
 * - Works on Android (Chrome) and iOS 16.4+ with PWA installed.
 * - Silently does nothing if the API is not supported.
 * - Never throws: all errors are caught and logged.
 * - Also notifies the Service Worker via postMessage so it can
 *   update the badge even when the page is in the background.
 */

/**
 * Notify the active Service Worker of a badge count update.
 * This is a best-effort call; it will silently fail if no SW is available.
 */
function notifyServiceWorker(type: 'UPDATE_BADGE' | 'CLEAR_BADGE', count?: number): void {
  if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) return;

  try {
    navigator.serviceWorker.controller.postMessage(
      type === 'CLEAR_BADGE' ? { type } : { type, count }
    );
  } catch {
    // Silently ignore
  }
}

/**
 * Update the PWA app icon badge with the given unread count.
 * If count is 0 or negative, clears the badge entirely.
 *
 * @param count Number of unread notifications (0 = clear badge)
 */
export function updateAppBadge(count: number): void {
  if (typeof navigator === 'undefined') return;

  const safeCount = Math.max(0, count);

  if ('setAppBadge' in navigator) {
    if (safeCount > 0) {
      (navigator as any)
        .setAppBadge(safeCount)
        .catch((err: unknown) => console.warn('[Badge] setAppBadge failed:', err));
    } else {
      (navigator as any)
        .clearAppBadge()
        .catch((err: unknown) => console.warn('[Badge] clearAppBadge failed:', err));
    }
  }

  // Also inform the Service Worker so it can update the badge
  // in case the page goes to the background between calls
  if (safeCount > 0) {
    notifyServiceWorker('UPDATE_BADGE', safeCount);
  } else {
    notifyServiceWorker('CLEAR_BADGE');
  }
}

/**
 * Explicitly clear the PWA app icon badge.
 */
export function clearAppBadge(): void {
  updateAppBadge(0);
}
