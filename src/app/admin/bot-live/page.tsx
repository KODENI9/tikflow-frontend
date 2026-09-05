"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where, limit } from "firebase/firestore";
import { botApi, adminApi } from "@/lib/api";
import { toast } from "sonner";
import {
  Bot,
  Pause,
  Play,
  XCircle,
  KeyRound,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Terminal,
  RefreshCcw,
  Loader2,
  ShieldCheck,
  MonitorPlay,
  Coins,
  Zap,
} from "lucide-react";

interface BotLog {
  timestamp: string;
  message: string;
  type: "info" | "warn" | "error" | "success";
}

interface BotTask {
  id: string;
  orderId: string;
  userId?: string;
  status: "queued" | "running" | "waiting_2fa" | "paused" | "completed" | "failed" | "cancelled";
  currentStep: string;
  stepIndex: number;
  totalSteps: number;
  logs: BotLog[];
  screenshot: string | null;
  requires2FA: boolean;
  adminControl: string;
  updatedAt: string;
  error?: string;
}

interface PendingOrder {
  id: string;
  tiktok_username?: string;
  tiktok_password?: string;
  coins_count?: number;
  amount_coins?: number;
  amount_cfa?: number;
  created_at?: any;
  user_id?: string;
}

export default function AdminBotLivePage() {
  const { getToken } = useAuth();
  const [tasks, setTasks] = useState<BotTask[]>([]);
  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([]);
  const [selectedTask, setSelectedTask] = useState<BotTask | null>(null);
  const [twoFACode, setTwoFACode] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [manualOrderId, setManualOrderId] = useState("");
  const [now, setNow] = useState(Date.now());

  // Timer tick for live countdowns
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Firestore listener for active bot tasks
  useEffect(() => {
    const q = query(collection(db, "bot_tasks"), limit(20));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loadedTasks: BotTask[] = snapshot.docs
          .map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          } as BotTask))
          .sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());

        setTasks(loadedTasks);

        if (selectedTask) {
          const updated = loadedTasks.find((t) => t.orderId === selectedTask.orderId);
          if (updated) setSelectedTask(updated);
        } else if (loadedTasks.length > 0) {
          setSelectedTask(loadedTasks[0]);
        }
      },
      (error) => {
        console.error("Firestore bot_tasks listener error:", error);
      }
    );

    return () => unsubscribe();
  }, [selectedTask?.orderId]);

  // Firestore listener for pending orders (single field query avoids missing composite index)
  useEffect(() => {
    const fetchApiPending = async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const res = await adminApi.getPendingTransactions(token);
        if (Array.isArray(res)) {
          const coinOrders = res.filter(
            (o: any) => o.type === "achat_coins" || o.type === "PURCHASE" || o.amount_coins > 0 || o.coins_count > 0
          ).map((o: any) => ({
            ...o,
            created_at: o.created_at ? new Date(o.created_at) : new Date(),
          }));
          setPendingOrders(coinOrders);
        }
      } catch (err) {
        console.error("Error fetching pending transactions via API:", err);
      }
    };

    fetchApiPending();
    const interval = setInterval(fetchApiPending, 5000);

    const q = query(
      collection(db, "transactions"),
      where("status", "==", "pending")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const orders: PendingOrder[] = snapshot.docs
          .map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              ...data,
              created_at: data.created_at?.toDate
                ? data.created_at.toDate()
                : data.created_at
                ? new Date(data.created_at)
                : new Date(),
            } as PendingOrder;
          })
          .filter(
            (o: any) => o.type === "achat_coins" || o.type === "PURCHASE" || o.amount_coins > 0 || o.coins_count > 0
          );

        if (orders.length > 0) {
          setPendingOrders(orders);
        }
      },
      (error) => {
        console.error("Firestore pending transactions listener error:", error);
      }
    );

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [getToken]);

  // Action handlers
  const handleStartBot = async (orderToStart?: PendingOrder | string) => {
    let targetId = typeof orderToStart === "string" ? orderToStart : orderToStart?.id || manualOrderId;
    if (!targetId) return toast.error("Veuillez saisir un ID de commande.");

    const orderObj = typeof orderToStart === "object" ? orderToStart : pendingOrders.find(o => o.id === targetId);

    try {
      setActionLoading(true);
      const token = await getToken();
      if (!token) return toast.error("Non autorisé");

      const res = await botApi.startBot(token, {
        orderId: targetId,
        username: orderObj?.tiktok_username,
        password: orderObj?.tiktok_password,
        coins: orderObj?.coins_count || orderObj?.amount_coins || 1000,
        userId: orderObj?.user_id,
      });

      if (res.success) {
        toast.success("Robot de livraison démarré en arrière-plan !");
        setManualOrderId("");
      }
    } catch (err: any) {
      toast.error(err.message || "Erreur lors du démarrage du robot.");
    } finally {
      setActionLoading(false);
    }
  };

  const handlePauseBot = async (orderId: string) => {
    try {
      setActionLoading(true);
      const token = await getToken();
      if (!token) return;

      const res = await botApi.pauseBot(token, orderId);
      if (res.success) {
        toast.success("Robot mis en pause. Prise en main manuelle activée.");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleResumeBot = async (orderId: string) => {
    try {
      setActionLoading(true);
      const token = await getToken();
      if (!token) return;

      const res = await botApi.resumeBot(token, orderId);
      if (res.success) {
        toast.success("Exécution du robot reprise avec succès !");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmit2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !twoFACode) return;

    try {
      setActionLoading(true);
      const token = await getToken();
      if (!token) return;

      const res = await botApi.submit2FA(token, selectedTask.orderId, twoFACode);
      if (res.success) {
        toast.success("Code 2FA transmis au robot !");
        setTwoFACode("");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelBot = async (orderId: string) => {
    if (!confirm("Voulez-vous vraiment annuler la tâche automatique ?")) return;

    try {
      setActionLoading(true);
      const token = await getToken();
      if (!token) return;

      const res = await botApi.cancelBot(token, orderId);
      if (res.success) {
        toast.success("Tâche du robot annulée.");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Helper for 5-minute auto-trigger countdown calculation
  const getAutoTriggerTimeRemaining = (createdAt: Date) => {
    const createdAtMs = new Date(createdAt).getTime();
    const timeoutMs = createdAtMs + 5 * 60 * 1000;
    const diffSec = Math.floor((timeoutMs - now) / 1000);

    if (diffSec <= 0) {
      return { expired: true, text: "Déclenchement auto en cours..." };
    }

    const min = Math.floor(diffSec / 60);
    const sec = diffSec % 60;
    return {
      expired: false,
      text: `Auto-déclenchement dans ${min}m ${sec < 10 ? "0" : ""}${sec}s`,
    };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "running":
        return <span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-xs font-bold flex items-center gap-1.5 animate-pulse"><Loader2 size={14} className="animate-spin" /> En cours</span>;
      case "waiting_2fa":
        return <span className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-xs font-bold flex items-center gap-1.5"><KeyRound size={14} /> Attente Code 2FA</span>;
      case "paused":
        return <span className="px-3 py-1 bg-purple-500/10 text-purple-500 rounded-full text-xs font-bold flex items-center gap-1.5"><Pause size={14} /> En Pause (Manuel)</span>;
      case "completed":
        return <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-bold flex items-center gap-1.5"><CheckCircle2 size={14} /> Livré à 100%</span>;
      case "failed":
      case "cancelled":
        return <span className="px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-xs font-bold flex items-center gap-1.5"><XCircle size={14} /> Échoué / Annulé</span>;
      default:
        return <span className="px-3 py-1 bg-slate-500/10 text-slate-500 rounded-full text-xs font-bold">En attente</span>;
    }
  };

  const stepsList = [
    { title: "Navigation TikTok", desc: "Chargement de la page" },
    { title: "Saisie Identifiants", desc: "Nom d'utilisateur & passe" },
    { title: "Vérification 2FA", desc: "SMS / Email" },
    { title: "Choix du Pack", desc: "Pièces TikTok" },
    { title: "Validation Livraison", desc: "Paiement & crédit" },
  ];

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card-bg border border-glass-border rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="size-14 bg-tikflow-primary/10 text-tikflow-primary rounded-2xl flex items-center justify-center">
            <Bot size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase text-foreground flex items-center gap-2">
              Robot de Livraison Live 🤖
            </h1>
            <p className="text-tikflow-slate text-xs font-medium mt-0.5">
              Supervision en temps réel des recharges automatiques TikTok Coins 24h/24 & Auto-déclenchement (5 min)
            </p>
          </div>
        </div>

        {/* Start Manual Task Bar */}
        <div className="flex items-center gap-2 bg-foreground/5 p-2 rounded-2xl border border-glass-border">
          <input
            type="text"
            placeholder="ID de Commande..."
            value={manualOrderId}
            onChange={(e) => setManualOrderId(e.target.value)}
            className="px-4 py-2 bg-transparent text-xs font-bold outline-none text-foreground w-40 placeholder:text-tikflow-slate"
          />
          <button
            onClick={() => handleStartBot()}
            disabled={actionLoading || !manualOrderId}
            className="px-4 py-2 bg-tikflow-primary hover:bg-tikflow-primary-dark text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            {actionLoading ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />} Lancer le Bot
          </button>
        </div>
      </div>

      {/* SECTION: Commandes en attente (Auto-Trigger 5 Min) */}
      <div className="bg-card-bg border border-glass-border rounded-3xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center">
              <Zap size={20} />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-foreground">
                Commandes en attente de livraison ({pendingOrders.length})
              </h2>
              <p className="text-[11px] text-tikflow-slate font-medium">
                Si aucune intervention admin sous 5 minutes, le robot démarre automatiquement la livraison.
              </p>
            </div>
          </div>
        </div>

        {pendingOrders.length === 0 ? (
          <div className="p-8 text-center bg-foreground/5 rounded-2xl border border-glass-border text-xs text-tikflow-slate font-bold">
            ✅ Aucune commande en attente. Tout est à jour !
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingOrders.map((order) => {
              const timing = getAutoTriggerTimeRemaining(order.created_at);
              const coins = order.coins_count || order.amount_coins || 1000;

              return (
                <div
                  key={order.id}
                  className="p-5 bg-foreground/5 border border-glass-border rounded-2xl space-y-3 hover:border-tikflow-primary/50 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-foreground">#{order.id.substring(0, 12)}</span>
                    <span className="px-2.5 py-1 bg-tikflow-primary/10 text-tikflow-primary rounded-lg text-xs font-black flex items-center gap-1">
                      <Coins size={12} /> {coins.toLocaleString()} Coins
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-bold text-foreground">
                      Compte : <span className="text-tikflow-primary">@{order.tiktok_username || "Non spécifié"}</span>
                    </p>
                    <p className="text-[10px] font-bold text-tikflow-slate">
                      Montant : {(order.amount_cfa || 0).toLocaleString()} FCFA
                    </p>
                  </div>

                  {/* Auto-Trigger Countdown Bar */}
                  <div className="p-2.5 rounded-xl bg-card-bg border border-glass-border space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="text-amber-500 flex items-center gap-1">
                        <Clock size={12} /> {timing.text}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartBot(order)}
                    disabled={actionLoading}
                    className="w-full py-2.5 bg-tikflow-primary hover:bg-tikflow-primary-dark text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <Play size={14} /> Lancer le Robot Maintenant
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Task List */}
        <div className="bg-card-bg border border-glass-border rounded-3xl p-6 space-y-4 shadow-sm h-fit">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-wider text-foreground flex items-center gap-2">
              <Clock size={16} className="text-tikflow-primary" /> Tâches Robot Récentes ({tasks.length})
            </h2>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {tasks.length === 0 ? (
              <div className="text-center py-12 text-tikflow-slate text-xs">
                Aucune tâche de livraison automatique récente.
              </div>
            ) : (
              tasks.map((task) => {
                const isSelected = selectedTask?.orderId === task.orderId;
                return (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? "bg-tikflow-primary/10 border-tikflow-primary/50 shadow-md"
                        : "bg-foreground/5 border-glass-border hover:border-tikflow-primary/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-foreground">Commande #{task.orderId.substring(0, 10)}</span>
                      {getStatusBadge(task.status)}
                    </div>
                    <p className="text-[11px] font-medium text-tikflow-slate truncate">{task.currentStep}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Middle & Right Column: Live Monitor & Screen */}
        <div className="lg:col-span-2 space-y-6">
          {selectedTask ? (
            <>
              {/* Task Header & Controls */}
              <div className="bg-card-bg border border-glass-border rounded-3xl p-6 space-y-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-glass-border pb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-lg font-black text-foreground uppercase">
                        Commande #{selectedTask.orderId}
                      </h2>
                      {getStatusBadge(selectedTask.status)}
                    </div>
                    <p className="text-xs font-medium text-tikflow-slate mt-1">
                      {selectedTask.currentStep}
                    </p>
                  </div>

                  {/* Admin Control Buttons */}
                  <div className="flex items-center gap-2">
                    {selectedTask.status === "running" && (
                      <button
                        onClick={() => handlePauseBot(selectedTask.orderId)}
                        disabled={actionLoading}
                        className="px-4 py-2.5 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Pause size={14} /> Pause (Prise en main)
                      </button>
                    )}

                    {selectedTask.status === "paused" && (
                      <button
                        onClick={() => handleResumeBot(selectedTask.orderId)}
                        disabled={actionLoading}
                        className="px-4 py-2.5 bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Play size={14} /> Reprendre le Bot
                      </button>
                    )}

                    {selectedTask.status !== "completed" && selectedTask.status !== "cancelled" && (
                      <button
                        onClick={() => handleCancelBot(selectedTask.orderId)}
                        disabled={actionLoading}
                        className="px-4 py-2.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <XCircle size={14} /> Annuler
                      </button>
                    )}
                  </div>
                </div>

                {/* Stepper Progress Bar */}
                <div className="grid grid-cols-5 gap-2">
                  {stepsList.map((step, idx) => {
                    const stepNum = idx + 1;
                    const isPassed = selectedTask.stepIndex > stepNum || selectedTask.status === "completed";
                    const isCurrent = selectedTask.stepIndex === stepNum && selectedTask.status !== "completed";

                    return (
                      <div key={idx} className="space-y-2 text-center">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            isPassed
                              ? "bg-green-500"
                              : isCurrent
                              ? "bg-tikflow-primary animate-pulse"
                              : "bg-foreground/10"
                          }`}
                        />
                        <p className={`text-[10px] font-bold ${isCurrent ? "text-tikflow-primary" : "text-tikflow-slate"}`}>
                          Étape {stepNum}
                        </p>
                        <p className="text-[9px] font-medium text-tikflow-slate hidden sm:block truncate">
                          {step.title}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* 2FA Input Form (If waiting 2FA) */}
                {selectedTask.status === "waiting_2fa" && (
                  <form onSubmit={handleSubmit2FA} className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase">
                      <KeyRound size={16} /> Code de vérification requis par TikTok
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Ex: 849204"
                        value={twoFACode}
                        onChange={(e) => setTwoFACode(e.target.value)}
                        className="flex-1 px-4 py-2.5 bg-card-bg border border-glass-border rounded-xl text-xs font-bold text-foreground outline-none focus:ring-2 ring-amber-500/20"
                      />
                      <button
                        type="submit"
                        disabled={actionLoading || !twoFACode}
                        className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-colors"
                      >
                        Transmettre au Bot
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Live Screenshot Preview & Console Logs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Live Screenshot Monitor */}
                <div className="bg-card-bg border border-glass-border rounded-3xl p-5 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase text-foreground flex items-center gap-2">
                      <MonitorPlay size={16} className="text-tikflow-primary" /> Aperçu Écran TikTok Live
                    </h3>
                    <span className="text-[10px] font-bold text-green-500 flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-green-500 animate-ping" /> Direct
                    </span>
                  </div>

                  <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-glass-border flex items-center justify-center">
                    {selectedTask.screenshot ? (
                      <img
                        src={selectedTask.screenshot}
                        alt="Aperçu Bot Live"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-6 space-y-2 text-tikflow-slate">
                        <Bot size={32} className="mx-auto opacity-40 animate-bounce" />
                        <p className="text-xs font-medium">Capture d'écran en cours d'initialisation...</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Console Log Feed */}
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-sm text-slate-200">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h3 className="text-xs font-black uppercase text-slate-300 flex items-center gap-2">
                      <Terminal size={16} className="text-green-400" /> Journal d'exécution (Logs)
                    </h3>
                    <span className="text-[10px] text-slate-500 font-mono">Realtime Stream</span>
                  </div>

                  <div className="h-[220px] overflow-y-auto font-mono text-[11px] space-y-2 pr-2">
                    {selectedTask.logs && selectedTask.logs.length > 0 ? (
                      selectedTask.logs.map((log, i) => (
                        <div key={i} className="flex gap-2">
                          <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                          <span
                            className={
                              log.type === "error"
                                ? "text-red-400 font-bold"
                                : log.type === "warn"
                                ? "text-amber-400 font-bold"
                                : log.type === "success"
                                ? "text-green-400 font-bold"
                                : "text-slate-300"
                            }
                          >
                            {log.message}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-slate-600 text-xs italic py-8 text-center">
                        Attente des premiers événements...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-card-bg border border-glass-border rounded-3xl p-12 text-center text-tikflow-slate space-y-3 shadow-sm">
              <Bot size={48} className="mx-auto opacity-30" />
              <p className="text-sm font-bold">Sélectionnez une tâche pour afficher la supervision en direct.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
