"use client";

import React, { useEffect, useState, useRef } from "react";
import { Bell, Check, Info, AlertCircle, ShoppingCart, CreditCard, X, ExternalLink } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { notificationApi } from "@/lib/api";
import { Notification } from "@/types/api";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy, limit as firestoreLimit } from "firebase/firestore";

interface NotificationBellProps {
  isAdmin?: boolean;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ isAdmin = false }) => {
  const { getToken, userId, isLoaded } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoaded) return;
    if (!userId && !isAdmin) return;

    const targetId = isAdmin ? 'admin' : userId;
    if (!targetId) return;

    console.log(`[NotificationBell] Setting up real-time listener for: ${targetId}`);

    const q = query(
      collection(db, "notifications"),
      where("user_id", "==", targetId),
      orderBy("created_at", "desc"),
      firestoreLimit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore Timestamp to Date
        created_at: (doc.data() as any).created_at?.toDate ? (doc.data() as any).created_at.toDate() : (doc.data() as any).created_at
      } as Notification));
      
      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => !n.read).length);
      setError(null);
    }, (err) => {
      console.error("Firestore onSnapshot error:", err);
      if (err.code === 'failed-precondition') {
        setError("Index Firestore manquant. Veuillez créer l'index recommandé dans les logs.");
      } else {
        setError("Erreur de connexion temps réel. Vérifiez votre configuration Firebase.");
      }
    });

    return () => unsubscribe();
  }, [isAdmin, userId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      const token = await getToken();
      if (!token) return;

      await notificationApi.markAsRead(token, id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Erreur marquage lecture:", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      await notificationApi.markAllAsRead(token);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Erreur marquage tout lu:", error);
    }
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "recharge_success": return <div className="p-2 bg-green-100 text-green-600 rounded-full"><CreditCard size={16} /></div>;
      case "order_delivered": return <div className="p-2 bg-blue-100 text-blue-600 rounded-full"><ShoppingCart size={16} /></div>;
      case "payment_received": return <div className="p-2 bg-purple-100 text-purple-600 rounded-full"><Check size={16} /></div>;
      case "system_alert": return <div className="p-2 bg-red-100 text-red-600 rounded-full"><AlertCircle size={16} /></div>;
      default: return <div className="p-2 bg-gray-100 text-gray-600 rounded-full"><Info size={16} /></div>;
    }
  };


  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-foreground/60 hover:bg-foreground/5 rounded-full transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-tikflow-accent text-[10px] font-bold text-white border-2 border-background">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-card-bg rounded-xl shadow-2xl border border-glass-border overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-glass-border flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllRead}
                className="text-xs text-blue-600 hover:underline font-medium"
              >
                Tout marquer comme lu
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {error ? (
              <div className="p-8 text-center bg-red-50/50">
                <AlertCircle size={32} className="mx-auto text-red-400 mb-2" />
                <p className="text-sm text-red-600 font-medium">Erreur temps réel</p>
                <p className="text-[10px] text-red-500 mt-1">{error}</p>
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    className={`p-4 border-b border-glass-border last:border-0 hover:bg-foreground/5 transition-colors flex gap-3 cursor-pointer ${!notif.read ? 'bg-tikflow-primary/5' : ''}`}
                    onClick={() => {
                      setSelectedNotification(notif);
                      if (!notif.read) handleMarkAsRead(notif.id);
                    }}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className={`text-sm ${!notif.read ? 'font-bold' : 'font-medium'} text-foreground truncate`}>
                          {notif.title}
                        </p>
                        {!notif.read && <div className="w-2 h-2 bg-tikflow-primary rounded-full mt-1"></div>}
                      </div>
                      <p className="text-xs text-tikflow-slate line-clamp-2 mt-0.5">
                        {notif.message}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                         <span className="text-[10px] text-tikflow-slate">
                          {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: fr })}
                        </span>
                      {notif.link && (
                        <Link 
                          href={notif.link}
                          className="text-[ 10px] text-blue-600 font-semibold hover:underline"
                          onClick={() => setIsOpen(false)}
                        >
                          Voir détails
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-gray-50/50">
                <Bell size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">Aucune notification pour le moment.</p>
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 bg-foreground/5 text-center border-t border-glass-border">
               <button className="text-xs text-tikflow-slate font-medium hover:text-foreground">
                 Voir toutes les notifications
               </button>
            </div>
          )}
        </div>
      )}
      {/* MODAL DE DÉTAILS */}
      {selectedNotification && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div 
            className="bg-card-bg rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 border border-glass-border"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header du Modal */}
            <div className={`p-8 pb-6 flex justify-between items-start relative overflow-hidden`}>
              {/* Fond décoratif (subtile gradient) */}
              <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-tikflow-primary to-indigo-900" />
              
              <div className="relative z-10 flex gap-5 items-center">
                <div className="scale-125">
                  {getIcon(selectedNotification.type)}
                </div>
                <div>
                  <h2 className="text-xl font-black text-foreground tracking-tight leading-tight">
                    {selectedNotification.title}
                  </h2>
                  <p className="text-[10px] font-black text-tikflow-primary uppercase tracking-widest mt-1">
                    {selectedNotification.type.replace('_', ' ')}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setSelectedNotification(null)}
                className="relative z-10 p-2 bg-foreground/5 hover:bg-foreground/10 text-tikflow-slate rounded-full transition-all hover:rotate-90"
              >
                <X size={20} />
              </button>
            </div>

            {/* Corps du Modal */}
            <div className="p-8 pt-2 space-y-6">
              <div className="bg-foreground/5 rounded-3xl p-6 border border-glass-border italic text-foreground/80 leading-relaxed font-medium">
                "{selectedNotification.message}"
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-tikflow-slate">
                  <span className="flex items-center gap-1.5 capitalize">
                    <Check size={14} className={selectedNotification.read ? "text-tikflow-accent" : "text-tikflow-slate/20"} />
                    {selectedNotification.read ? "Lue" : "Non lue"}
                  </span>
                  <span>
                    {formatDistanceToNow(new Date(selectedNotification.created_at), { addSuffix: true, locale: fr })}
                  </span>
              </div>

              <div className="pt-4 border-t border-glass-border flex gap-3">
                {selectedNotification.link && (
                  <Link 
                    href={selectedNotification.link}
                    onClick={() => setSelectedNotification(null)}
                    className="flex-1 py-4 bg-tikflow-primary text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-tikflow-primary/20 hover:bg-tikflow-primary/90 transition-all uppercase tracking-wider"
                  >
                    <ExternalLink size={18} />
                    Voir les détails
                  </Link>
                )}
                <button 
                  onClick={() => setSelectedNotification(null)}
                  className={`py-4 px-8 border-2 border-glass-border text-foreground rounded-2xl font-black text-sm hover:bg-foreground/5 transition-all uppercase tracking-wider ${!selectedNotification.link ? 'w-full' : ''}`}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>               
      )}
    </div>
  );
};

export default NotificationBell;
