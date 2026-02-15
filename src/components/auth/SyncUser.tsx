"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import { syncUserWithBackend } from "@/lib/actions/user.actions";

export const SyncUser = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  // On stocke l'ID synchronisé pour être sûr de ne pas le refaire pour le même user
  const lastSyncedId = useRef<string | null>(null);

  useEffect(() => {
    const sync = async () => {
      // 1. On vérifie si tout est chargé
      // 2. On vérifie si l'ID actuel est différent du dernier ID synchronisé
      if (isLoaded && isSignedIn && user && lastSyncedId.current !== user.id) {
        
        // On verrouille immédiatement avant l'appel await
        lastSyncedId.current = user.id;

        const userData = {
          email: user.primaryEmailAddress?.emailAddress || "",
          fullname: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          phoneNumber: user.primaryPhoneNumber?.phoneNumber || "",
        };

        try {
          await syncUserWithBackend(userData);
        } catch (error) {
          // En cas d'erreur, on reset pour permettre une tentative au prochain refresh
          lastSyncedId.current = null;
          console.error("❌ Échec de la synchronisation:", error);
        }
      }
    };

    sync();
  }, [isLoaded, isSignedIn, user]); 

  return null;
};