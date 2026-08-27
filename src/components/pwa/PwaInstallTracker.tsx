"use client";

/**
 * PwaInstallTracker
 *
 * Invisible component that listens for the `appinstalled` browser event
 * and also checks on mount if the app is already running in standalone mode.
 *
 * When either condition is true, it sends a POST to the backend so the
 * admin tracking dashboard can record this user as having the PWA installed.
 *
 * Renders nothing visible.
 */

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/$/, "");

async function reportInstall(
  token: string,
  event_type: "installed" | "standalone_open"
) {
  try {
    await fetch(`${BACKEND_URL}/api/tracking/pwa-install`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        event_type,
        platform: getPlatform(),
        userAgent: navigator.userAgent,
      }),
    });
  } catch {
    // Silently ignore — tracking is non-critical
  }
}

function getPlatform(): string {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  if (/Windows/i.test(ua)) return "windows";
  if (/Mac/i.test(ua)) return "mac";
  return "unknown";
}

function isRunningStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true
  );
}

export function PwaInstallTracker() {
  const { getToken, isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    // Check if already running as installed PWA (e.g. user reopened the app)
    if (isRunningStandalone()) {
      getToken().then((token) => {
        if (token) reportInstall(token, "standalone_open");
      });
    }

    // Listen for the install event (fires once when user taps "Add to Home Screen")
    const handleInstalled = () => {
      getToken().then((token) => {
        if (token) reportInstall(token, "installed");
      });
    };

    window.addEventListener("appinstalled", handleInstalled);
    return () => window.removeEventListener("appinstalled", handleInstalled);
  }, [isLoaded, isSignedIn, getToken]);

  return null;
}
