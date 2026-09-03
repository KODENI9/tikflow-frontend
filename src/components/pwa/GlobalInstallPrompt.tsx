"use client";

import { subscribeToPushNotifications } from "@/lib/push";
import { toast } from "sonner";
import { BellRing, CheckCircle2 } from "lucide-react";

import { useState, useEffect } from "react";
import { Download, Share, PlusSquare, X } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

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

interface GlobalInstallPromptProps {
  forceShow?: boolean;   // If true, bypasses the 3s delay and localStorage dismissal
  onDismiss?: () => void; // Called when user dismisses, in addition to internal logic
}

export function GlobalInstallPrompt({ forceShow = false, onDismiss }: GlobalInstallPromptProps = {}) {
  const { getToken, userId, isLoaded, isSignedIn } = useAuth();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isIOSChrome, setIsIOSChrome] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  
  const [showMainPrompt, setShowMainPrompt] = useState(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);
  const [showIOSChromePrompt, setShowIOSChromePrompt] = useState(false);
  
  const [isAdminTriggered, setIsAdminTriggered] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Firestore listener for admin-triggered prompt
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !userId) return;

    const docRef = doc(db, "pwa_tracking", userId);
    console.log("[GlobalInstallPrompt] Listening to Firestore for admin triggers on:", userId);
    
    const unsubscribe = onSnapshot(docRef, async (snapshot) => {
      console.log("[GlobalInstallPrompt] Received snapshot:", snapshot.exists() ? snapshot.data() : "No data");
      if (!snapshot.exists()) return;

      const data = snapshot.data();
      if (data?.install_prompt_trigger === true) {
        console.log("[GlobalInstallPrompt] Admin trigger detected! Displaying modal...");
        setIsAdminTriggered(true);
        setShowMainPrompt(true);
        const token = await getToken();
        if (token) clearTrigger(token);
      }
    });

    return () => unsubscribe();
  }, [isLoaded, isSignedIn, userId, getToken]);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone) {
      setIsStandalone(true);
      return;
    }

    // If forced by admin via props, skip the localStorage/timing checks and show immediately
    if (forceShow) {
      setShowMainPrompt(true);
    } else {
      // Check localStorage to not bother user if they dismissed recently
      const dismissedAt = localStorage.getItem("tikflow_install_dismissed");
      if (dismissedAt) {
        const daysSinceDismissed = (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60 * 24);
        if (daysSinceDismissed < 3) {
          return;
        }
      }
    }

    // Check for iOS Safari and Chrome
    const ua = window.navigator.userAgent;
    const webkit = !!ua.match(/WebKit/i);
    const isIOSDevice = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
    const isChromeIOS = isIOSDevice && !!ua.match(/CriOS/i);
    const isSafari = isIOSDevice && webkit && !isChromeIOS;

    if (isIOSDevice && isSafari) {
      setIsIOS(true);
    }
    if (isChromeIOS) {
      setIsIOSChrome(true);
    }

    // Android/Chrome beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Show the global prompt after 3 seconds (unless forced)
    const delay = forceShow ? 0 : 3500;
    const timer = setTimeout(() => {
      if (isIOSDevice || isSafari || isChromeIOS || (window as any).deferredPrompt || deferredPrompt === null) {
        if (!forceShow) setShowMainPrompt(true); // forceShow already set it above
      }
    }, delay);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, [deferredPrompt, forceShow]);

  const handleInstallClick = async () => {
    setShowMainPrompt(false);
    
    if (isIOS) {
      setShowIOSPrompt(true);
      return;
    }
    if (isIOSChrome) {
      setShowIOSChromePrompt(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  const handleSubscribe = async () => {
    if (!userId) return;
    setIsSubscribing(true);
    try {
      const token = await getToken();
      await subscribeToPushNotifications(userId, token || "");
      setNotificationPermission("granted");
      toast.success("Notifications activées avec succès !");
    } catch (error: any) {
      console.error(error);
      if (Notification.permission === "denied") {
        setNotificationPermission("denied");
        toast.error("Vous avez bloqué les notifications dans votre navigateur.");
      } else {
        toast.error(error?.message || "Erreur lors de l'activation des notifications.");
      }
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleDismiss = () => {
    setShowMainPrompt(false);
    setShowIOSPrompt(false);
    setShowIOSChromePrompt(false);
    if (!forceShow) {
      // Only save dismiss to localStorage for organic prompts, not admin-triggered ones
      localStorage.setItem("tikflow_install_dismissed", Date.now().toString());
    }
    onDismiss?.();
  };

  if (isStandalone && !isAdminTriggered) return null;
  // If not iOS and no prompt available, don't show anything (e.g. unsupported browser) unless admin triggered
  if (!isAdminTriggered && !deferredPrompt && !isIOS && !isIOSChrome) return null;

  return (
    <>
      {/* Global Bottom Banner / Modal */}
      {showMainPrompt && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className={`bg-card-bg border border-glass-border rounded-t-3xl sm:rounded-3xl p-6 w-full shadow-2xl relative animate-in slide-in-from-bottom-10 sm:zoom-in-95 ${isAdminTriggered ? 'max-w-md' : 'max-w-sm'}`}>
            <button 
              onClick={handleDismiss}
              className="absolute right-4 top-4 text-tikflow-slate hover:text-foreground"
            >
              <X size={20} />
            </button>
            
            <div className="flex flex-col items-center text-center mt-2 mb-6">
              <div className="w-16 h-16 bg-gradient-to-tr from-tikflow-primary to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-tikflow-primary/20 mb-4">
                <Download size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-black uppercase text-foreground mb-2">
                {isAdminTriggered ? "Configuration Requise" : "Installez l'Application"}
              </h3>
              <p className="text-sm font-medium text-tikflow-slate">
                {isAdminTriggered 
                  ? "Pour une expérience optimale, veuillez installer l'application et activer les notifications."
                  : "Profitez d'une expérience plus rapide, plus fluide, et recevez les notifications en temps réel."}
              </p>
            </div>
            
            <div className="space-y-3">
              {(!isStandalone && (deferredPrompt || isIOS || isIOSChrome)) && (
                <button 
                  onClick={handleInstallClick}
                  className="w-full py-3.5 bg-tikflow-primary text-white font-black uppercase rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-tikflow-primary/20 flex items-center justify-center gap-2"
                >
                  <Download size={18} /> Installer l'application
                </button>
              )}

              {isAdminTriggered && notificationPermission !== "granted" && (
                <button 
                  onClick={handleSubscribe}
                  disabled={isSubscribing}
                  className="w-full py-3.5 bg-blue-500 text-white font-black uppercase rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <BellRing size={18} /> {isSubscribing ? "Activation..." : "Activer les notifications"}
                </button>
              )}

              {isAdminTriggered && isStandalone && notificationPermission === "granted" && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-center text-green-500 font-bold text-sm flex items-center justify-center gap-2">
                  <CheckCircle2 size={18} /> L'application est parfaitement configurée !
                </div>
              )}

              <button 
                onClick={handleDismiss}
                className="w-full py-3.5 bg-foreground/5 text-foreground font-bold uppercase rounded-xl hover:bg-foreground/10 transition-colors"
              >
                Plus tard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal iOS Safari */}
      {showIOSPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card-bg border border-glass-border rounded-3xl p-6 max-w-sm w-full shadow-2xl relative">
            <button 
              onClick={handleDismiss}
              className="absolute right-4 top-4 text-tikflow-slate hover:text-foreground"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-lg font-black uppercase text-foreground mb-4 flex items-center gap-2">
              <Download className="text-tikflow-primary" />
              Installer l'application
            </h3>
            
            <p className="text-sm font-medium text-tikflow-slate mb-6">
              Pour installer TikFlow sur votre iPhone et y accéder comme une vraie application :
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-foreground/5 p-2 rounded-xl text-foreground mt-1">
                  <Share size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">1. Appuyez sur Partager</p>
                  <p className="text-xs text-tikflow-slate">Dans la barre de navigation de Safari en bas.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-foreground/5 p-2 rounded-xl text-foreground mt-1">
                  <PlusSquare size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">2. Ajouter à l'écran d'accueil</p>
                  <p className="text-xs text-tikflow-slate">Faites défiler le menu et sélectionnez cette option.</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleDismiss}
              className="w-full mt-8 py-3 bg-foreground/10 text-foreground font-black uppercase rounded-xl hover:bg-foreground/20 transition-colors"
            >
              J'ai compris
            </button>
          </div>
        </div>
      )}

      {/* Modal iOS Chrome */}
      {showIOSChromePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card-bg border border-glass-border rounded-3xl p-6 max-w-sm w-full shadow-2xl relative">
            <button 
              onClick={handleDismiss}
              className="absolute right-4 top-4 text-tikflow-slate hover:text-foreground"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-lg font-black uppercase text-foreground mb-4 flex items-center gap-2">
              <Download className="text-tikflow-primary" />
              Installer l'application
            </h3>
            
            <p className="text-sm font-medium text-tikflow-slate mb-6">
              Pour installer TikFlow depuis Chrome sur votre iPhone :
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-foreground/5 p-2 rounded-xl text-foreground mt-1">
                  <Share size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">1. Appuyez sur Partager</p>
                  <p className="text-xs text-tikflow-slate">L'icône en haut à droite dans la barre d'adresse de Chrome.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-foreground/5 p-2 rounded-xl text-foreground mt-1">
                  <PlusSquare size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">2. Ajouter à l'écran d'accueil</p>
                  <p className="text-xs text-tikflow-slate">Faites défiler le menu et sélectionnez cette option.</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleDismiss}
              className="w-full mt-8 py-3 bg-foreground/10 text-foreground font-black uppercase rounded-xl hover:bg-foreground/20 transition-colors"
            >
              J'ai compris
            </button>
          </div>
        </div>
      )}
    </>
  );
}
