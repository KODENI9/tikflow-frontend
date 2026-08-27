"use client";

/**
 * RemoteInstallListener
 *
 * Listens in real-time to the user's `pwa_tracking` Firestore document.
 * When the admin sets `install_prompt_trigger: true`, this component
 * immediately shows the GlobalInstallPrompt modal on the user's screen.
 *
 * After showing it, it clears the trigger on the backend so the popup
 * won't appear again on the next load.
 *
 * Renders nothing visible itself.
 */

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { GlobalInstallPrompt } from "./GlobalInstallPrompt";

const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/$/, "");

async function clearTrigger(token: string) {
  try {
    await fetch(`${BACKEND_URL}/api/tracking/clear-trigger`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    // Silently ignore
  }
}

export function RemoteInstallListener() {
  const { getToken, userId, isLoaded, isSignedIn } = useAuth();
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !userId) return;

    // Listen to the user's pwa_tracking document in real-time
    const docRef = doc(db, "pwa_tracking", userId);

    const unsubscribe = onSnapshot(docRef, async (snapshot) => {
      if (!snapshot.exists()) return;

      const data = snapshot.data();

      // If admin triggered the install prompt
      if (data?.install_prompt_trigger === true) {
        // Show the prompt
        setShowPrompt(true);

        // Acknowledge + clear the trigger so it doesn't re-appear
        const token = await getToken();
        if (token) clearTrigger(token);
      }
    });

    return () => unsubscribe();
  }, [isLoaded, isSignedIn, userId, getToken]);

  if (!showPrompt) return null;

  // Reuse GlobalInstallPrompt but force it to show immediately (bypass the 3s delay + localStorage check)
  return <GlobalInstallPrompt forceShow onDismiss={() => setShowPrompt(false)} />;
}
