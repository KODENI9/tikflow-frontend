"use client";

import React, { useEffect, useState, useMemo } from "react";
import { 
  Bell, 
  CheckCheck, 
  Sparkles, 
  ShoppingCart, 
  CreditCard, 
  AlertCircle, 
  Info, 
  ExternalLink, 
  Search, 
  Check, 
  Trash2, 
  Flame, 
  ArrowRight,
  Filter,
  Clock,
  Radio
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { notificationApi } from "@/lib/api";
import { Notification } from "@/types/api";
import { formatDistanceToNow, format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  limit as firestoreLimit,
  doc,
  deleteDoc 
} from "firebase/firestore";
import { toast } from "sonner";
import { updateAppBadge } from "@/lib/badge";

type FilterType = "all" | "unread" | "announcements" | "transactions";

export default function UserNotificationsPage() {
  const { getToken, userId, isLoaded } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  // Écoute en temps réel Firestore
  useEffect(() => {
    if (!isLoaded || !userId) return;

    console.log(`[NotificationsPage] Real-time listener for: ${userId}`);

    const q = query(
      collection(db, "notifications"),
      where("user_id", "==", userId),
      orderBy("created_at", "desc"),
      firestoreLimit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          created_at: data.created_at?.toDate ? data.created_at.toDate() : (data.created_at ? new Date(data.created_at) : new Date())
        } as Notification;
      });

      setNotifications(notifs);
      const unread = notifs.filter(n => !n.read).length;
      updateAppBadge(unread);
      setIsLoading(false);
    }, (err) => {
      console.error("Firestore onSnapshot error:", err);
      // Fallback API en cas d'erreur de snapshot
      fetchViaApi();
    });

    return () => unsubscribe();
  }, [isLoaded, userId]);

  const fetchViaApi = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const data = await notificationApi.getNotifications(token);
      if (Array.isArray(data)) {
        setNotifications(data.map(n => ({
          ...n,
          created_at: n.created_at ? new Date(n.created_at) : new Date()
        })));
      }
    } catch (e) {
      console.error("Erreur API notifications:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const token = await getToken();
      if (token) {
        await notificationApi.markAsRead(token, id);
      }
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      toast.success("Notification marquée comme lue");
    } catch (error) {
      console.error("Erreur marquage lecture:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadNotifs = notifications.filter(n => !n.read);
    if (unreadNotifs.length === 0) {
      toast.info("Toutes les notifications sont déjà lues");
      return;
    }

    setIsMarkingAll(true);
    try {
      const token = await getToken();
      if (token) {
        await notificationApi.markAllAsRead(token);
      }
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      updateAppBadge(0);
      toast.success("Toutes les notifications ont été marquées comme lues");
    } catch (error) {
      console.error("Erreur tout marquer comme lu:", error);
      toast.error("Impossible de tout marquer comme lu");
    } finally {
      setIsMarkingAll(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteDoc(doc(db, "notifications", id));
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success("Notification supprimée");
    } catch (error) {
      console.error("Erreur suppression:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  // Filtrage et Recherche
  const filteredNotifications = useMemo(() => {
    return notifications.filter(notif => {
      // 1. Filtre catégorie
      if (activeFilter === "unread" && notif.read) return false;
      if (activeFilter === "announcements" && !['announcement', 'marketing', 'system_alert', 'info'].includes(notif.type)) return false;
      if (activeFilter === "transactions" && !['recharge_success', 'recharge_error', 'order_delivered', 'payment_received'].includes(notif.type)) return false;

      // 2. Recherche textuelle
      if (searchQuery.trim()) {
        const queryLower = searchQuery.toLowerCase();
        const matchTitle = (notif.title || "").toLowerCase().includes(queryLower);
        const matchMsg = (notif.message || "").toLowerCase().includes(queryLower);
        return matchTitle || matchMsg;
      }

      return true;
    });
  }, [notifications, activeFilter, searchQuery]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const announcementCount = notifications.filter(n => ['announcement', 'marketing', 'system_alert', 'info'].includes(n.type)).length;
  const transactionCount = notifications.filter(n => ['recharge_success', 'recharge_error', 'order_delivered', 'payment_received'].includes(n.type)).length;

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'announcement':
      case 'marketing':
        return <Sparkles className="size-5 text-purple-400" />;
      case 'recharge_success':
      case 'payment_received':
      case 'success':
        return <CheckCheck className="size-5 text-emerald-400" />;
      case 'order_delivered':
        return <ShoppingCart className="size-5 text-sky-400" />;
      case 'recharge_error':
      case 'warning':
        return <AlertCircle className="size-5 text-amber-400" />;
      default:
        return <Bell className="size-5 text-tikflow-primary" />;
    }
  };

  const getNotifBadgeStyle = (type: string) => {
    switch (type) {
      case 'announcement':
      case 'marketing':
        return 'bg-purple-500/10 border-purple-500/20 text-purple-400';
      case 'recharge_success':
      case 'payment_received':
      case 'success':
        return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
      case 'order_delivered':
        return 'bg-sky-500/10 border-sky-500/20 text-sky-400';
      case 'recharge_error':
      case 'warning':
        return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
      default:
        return 'bg-tikflow-primary/10 border-tikflow-primary/20 text-tikflow-primary';
    }
  };

  const getNotifTypeLabel = (type: string) => {
    switch (type) {
      case 'announcement': return 'Annonce';
      case 'marketing': return 'Offre Spéciale';
      case 'recharge_success': return 'Recharge Réussie';
      case 'payment_received': return 'Paiement Reçu';
      case 'order_delivered': return 'Commande Livrée';
      case 'recharge_error': return 'Erreur Recharge';
      case 'warning': return 'Avertissement';
      default: return 'Notification';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      
      {/* En-tête de la page */}
      <div className="bg-[#0a0b10] dark:bg-card-bg text-white rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="flex size-2 rounded-full bg-tikflow-primary animate-pulse"></span>
            <p className="text-white/70 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">
              Espace Client
            </p>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
            <Bell className="size-8 text-tikflow-primary" />
            Centre de Notifications
          </h1>
          <p className="text-white/60 max-w-xl text-sm leading-relaxed">
            Consultez toutes vos annonces, promotions exclusives, alertes système et suivis de transactions en temps réel.
          </p>
        </div>

        {/* Action Tout marquer comme lu */}
        <div className="relative z-10 flex items-center gap-3 shrink-0">
          <button
            onClick={handleMarkAllAsRead}
            disabled={isMarkingAll || unreadCount === 0}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md ${
              unreadCount > 0
                ? "bg-tikflow-primary hover:bg-tikflow-primary/90 text-white shadow-tikflow-primary/20 hover:scale-[1.02] cursor-pointer"
                : "bg-white/5 text-white/40 border border-white/5 cursor-not-allowed"
            }`}
          >
            <CheckCheck size={16} />
            {isMarkingAll ? "Mise à jour..." : "Tout marquer comme lu"}
          </button>
        </div>

        {/* Effet lumineux de fond */}
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-tikflow-primary rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
      </div>

      {/* Barre d'outils : Filtres + Recherche */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Onglets Filtres */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${
              activeFilter === "all"
                ? "bg-foreground text-background shadow-sm"
                : "bg-card-bg text-tikflow-slate hover:text-foreground border border-glass-border hover:bg-foreground/5"
            }`}
          >
            Toutes
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              activeFilter === "all" ? "bg-background/20 text-background" : "bg-foreground/10 text-foreground"
            }`}>
              {notifications.length}
            </span>
          </button>

          <button
            onClick={() => setActiveFilter("unread")}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${
              activeFilter === "unread"
                ? "bg-tikflow-primary text-white shadow-md shadow-tikflow-primary/20"
                : "bg-card-bg text-tikflow-slate hover:text-foreground border border-glass-border hover:bg-foreground/5"
            }`}
          >
            Non lues
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] animate-pulse font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveFilter("announcements")}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${
              activeFilter === "announcements"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                : "bg-card-bg text-tikflow-slate hover:text-foreground border border-glass-border hover:bg-foreground/5"
            }`}
          >
            <Sparkles size={14} />
            Annonces & Promos
            <span className="px-1.5 py-0.5 rounded-full bg-foreground/10 text-[10px]">
              {announcementCount}
            </span>
          </button>

          <button
            onClick={() => setActiveFilter("transactions")}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${
              activeFilter === "transactions"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-card-bg text-tikflow-slate hover:text-foreground border border-glass-border hover:bg-foreground/5"
            }`}
          >
            <CreditCard size={14} />
            Transactions
            <span className="px-1.5 py-0.5 rounded-full bg-foreground/10 text-[10px]">
              {transactionCount}
            </span>
          </button>
        </div>

        {/* Champ de recherche */}
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-tikflow-slate" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher..."
            className="w-full pl-9 pr-4 py-2 bg-card-bg border border-glass-border rounded-xl text-sm text-foreground placeholder:text-tikflow-slate/60 focus:outline-none focus:border-tikflow-primary/50 transition-colors"
          />
        </div>
      </div>

      {/* Liste des Notifications */}
      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 bg-card-bg rounded-2xl border border-glass-border w-full"></div>
          ))}
        </div>
      ) : filteredNotifications.length === 0 ? (
        /* État Vide */
        <div className="bg-card-bg rounded-3xl border border-glass-border p-12 text-center flex flex-col items-center justify-center gap-4 shadow-sm">
          <div className="size-16 rounded-2xl bg-tikflow-primary/10 flex items-center justify-center text-tikflow-primary shadow-inner">
            <Bell size={32} />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground">
              {searchQuery ? "Aucune notification correspondante" : "Vous êtes à jour !"}
            </h3>
            <p className="text-sm text-tikflow-slate max-w-sm">
              {searchQuery 
                ? "Essayez de modifier votre terme de recherche." 
                : "Toutes vos nouvelles notifications et alertes système apparaîtront ici."}
            </p>
          </div>
        </div>
      ) : (
        /* Liste des cartes de notification */
        <div className="space-y-3">
          {filteredNotifications.map((notif) => {
            const isUnread = !notif.read;
            const notifDate = notif.created_at ? new Date(notif.created_at) : new Date();

            return (
              <div
                key={notif.id}
                onClick={() => isUnread && handleMarkAsRead(notif.id)}
                className={`group relative bg-card-bg rounded-2xl p-5 md:p-6 border transition-all duration-200 hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isUnread 
                    ? "border-tikflow-primary/40 bg-tikflow-primary/[0.02] shadow-sm" 
                    : "border-glass-border opacity-90 hover:opacity-100"
                }`}
              >
                {/* Indicateur visuel non lu (barre à gauche) */}
                {isUnread && (
                  <div className="absolute left-0 top-3 bottom-3 w-1 bg-tikflow-primary rounded-r-full"></div>
                )}

                {/* Contenu principal */}
                <div className="flex items-start gap-4 flex-1">
                  {/* Icône de type */}
                  <div className={`size-11 rounded-xl flex items-center justify-center shrink-0 border ${getNotifBadgeStyle(notif.type)}`}>
                    {getNotifIcon(notif.type)}
                  </div>

                  {/* Textes */}
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${getNotifBadgeStyle(notif.type)}`}>
                        {getNotifTypeLabel(notif.type)}
                      </span>
                      <span className="text-xs text-tikflow-slate flex items-center gap-1 font-medium">
                        <Clock size={12} />
                        {formatDistanceToNow(notifDate, { addSuffix: true, locale: fr })}
                      </span>
                      {isUnread && (
                        <span className="size-2 rounded-full bg-tikflow-primary animate-pulse ml-1" title="Non lu"></span>
                      )}
                    </div>

                    <h4 className={`text-base font-bold text-foreground ${isUnread ? "font-black" : "font-bold"}`}>
                      {notif.title}
                    </h4>

                    <p className="text-sm text-tikflow-slate leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                </div>

                {/* Actions & Liens */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-glass-border w-full md:w-auto justify-end">
                  {/* Bouton d'action si un lien existe */}
                  {notif.link && (
                    <Link
                      href={notif.link}
                      onClick={() => isUnread && handleMarkAsRead(notif.id)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-tikflow-primary/10 hover:bg-tikflow-primary text-tikflow-primary hover:text-white font-bold text-xs uppercase tracking-wider transition-all"
                    >
                      <span>Consulter</span>
                      <ArrowRight size={14} />
                    </Link>
                  )}

                  {/* Bouton marquer comme lu */}
                  {isUnread && (
                    <button
                      onClick={(e) => handleMarkAsRead(notif.id, e)}
                      title="Marquer comme lu"
                      className="p-2 rounded-xl text-tikflow-slate hover:text-foreground hover:bg-foreground/5 transition-colors cursor-pointer"
                    >
                      <Check size={18} />
                    </button>
                  )}

                  {/* Bouton supprimer */}
                  <button
                    onClick={(e) => handleDelete(notif.id, e)}
                    title="Supprimer la notification"
                    className="p-2 rounded-xl text-tikflow-slate hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
