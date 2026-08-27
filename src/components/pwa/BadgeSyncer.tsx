"use client";

/**
 * BadgeSyncer — Startup badge synchronization
 *
 * This component mounts once at the app root level and:
 *  1. On first load: fetches the real unread count from the backend
 *     and sets the PWA badge accordingly (source of truth sync).
 *  2. On visibility change (user returns to the app after it was
 *     backgrounded): re-fetches and re-syncs the badge so it's always
 *     accurate even after receiving pushes while the app was closed.
 *  3. On sign-out / user gone: clears the badge.
 *
 * It does NOT replace the real-time updates done by NotificationBell.
 * It's a safety net / startup sync only.
 *
 * Renders nothing visible.
 */

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { notificationApi } from "@/lib/api";
import { updateAppBadge, clearAppBadge } from "@/lib/badge";

export function BadgeSyncer() {
  const { getToken, userId, isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;

    // If user signed out, clear the badge immediately
    if (!isSignedIn || !userId) {
      clearAppBadge();
      return;
    }

    let cancelled = false;

    async function syncBadge() {
      try {
        const token = await getToken();
        if (!token || cancelled) return;

        const { count } = await notificationApi.getUnreadCount(token);
        if (!cancelled) {
          updateAppBadge(count);
        }
      } catch {
        // Silently ignore — the real-time Firestore listener in NotificationBell
        // will catch up when the component renders.
      }
    }

    // Sync on mount
    syncBadge();

    // Re-sync when the user returns to the tab / app (e.g. after receiving
    // push notifications while the app was in the background)
    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        syncBadge();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isLoaded, isSignedIn, userId, getToken]);

  // Renders nothing
  return null;
}
