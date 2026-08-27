"use client";

import { useState, useEffect } from "react";
import { Bell, BellRing, X } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { subscribeToPushNotifications } from "@/lib/push";
import { toast } from "sonner";

export function NotificationPrompt() {
  const { user } = useUser();
  const [showPrompt, setShowPrompt] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window && "serviceWorker" in navigator) {
      setPermission(Notification.permission);
      
      // Show prompt if permission hasn't been requested yet and user is logged in
      if (Notification.permission === "default" && user) {
        // Wait a bit before showing to not overwhelm the user on first load
        const timer = setTimeout(() => setShowPrompt(true), 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [user]);

  const handleSubscribe = async () => {
    if (!user) return;
    
    setIsSubscribing(true);
    try {
      await subscribeToPushNotifications(user.id);
      setPermission("granted");
      setShowPrompt(false);
      toast.success("Notifications activées avec succès !");
    } catch (error: any) {
      console.error(error);
      if (Notification.permission === "denied") {
        setPermission("denied");
        toast.error("Vous avez bloqué les notifications dans votre navigateur.");
      } else {
        toast.error("Erreur lors de l'activation des notifications.");
      }
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleLater = () => {
    setShowPrompt(false);
    // Could save to localStorage to not bother them again for X days
  };

  if (!showPrompt || permission !== "default") return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-card-bg border border-glass-border shadow-2xl rounded-2xl p-5 z-50 animate-in slide-in-from-bottom-5 fade-in">
      <button 
        onClick={handleLater}
        className="absolute top-3 right-3 text-tikflow-slate hover:text-foreground transition-colors"
      >
        <X size={18} />
      </button>
      
      <div className="flex items-start gap-4 mb-4">
        <div className="bg-tikflow-primary/10 text-tikflow-primary p-3 rounded-xl">
          <BellRing size={24} />
        </div>
        <div>
          <h3 className="font-bold text-foreground">Activez les notifications</h3>
          <p className="text-xs text-tikflow-slate mt-1 leading-relaxed">
            Recevez des alertes instantanées concernant le statut de vos commandes, vos livraisons TikTok Coins et vos paiements.
          </p>
        </div>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={handleSubscribe}
          disabled={isSubscribing}
          className="flex-1 bg-tikflow-primary text-white py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isSubscribing ? "Activation..." : "Activer"}
        </button>
        <button
          onClick={handleLater}
          className="flex-1 bg-foreground/5 text-foreground py-2.5 rounded-xl font-bold text-sm hover:bg-foreground/10 transition-colors"
        >
          Plus tard
        </button>
      </div>
    </div>
  );
}
