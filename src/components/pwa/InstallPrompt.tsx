"use client";

import { useState, useEffect } from "react";
import { Download, Share, PlusSquare, X } from "lucide-react";

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone) {
      setIsStandalone(true);
      return;
    }

    // Check for iOS Safari
    const ua = window.navigator.userAgent;
    const webkit = !!ua.match(/WebKit/i);
    const isIOSDevice = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
    const isSafari = isIOSDevice && webkit && !ua.match(/CriOS/i);

    if (isIOSDevice && isSafari) {
      setIsIOS(true);
    }

    // Android/Chrome beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSPrompt(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  if (isStandalone) return null;
  if (!deferredPrompt && !isIOS) return null; // App is neither installable on Android nor iOS Safari

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-3 w-full p-4 mb-4 bg-gradient-to-r from-tikflow-primary to-orange-500 text-slate-900 rounded-2xl hover:opacity-90 transition-all font-black uppercase text-xs shadow-lg shadow-tikflow-primary/20 animate-pulse"
      >
        <Download size={18} />
        Installer l'application
      </button>

      {/* Modal iOS */}
      {showIOSPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card-bg border border-glass-border rounded-3xl p-6 max-w-sm w-full shadow-2xl relative">
            <button 
              onClick={() => setShowIOSPrompt(false)}
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
              onClick={() => setShowIOSPrompt(false)}
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
