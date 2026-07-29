"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp, Wallet, Clock,
  Search, Download, RefreshCcw,
  LayoutDashboard, ChevronRight,
  Activity,
} from "lucide-react";
import { StatCard } from "../_components/StatCard";
import { TransactionTable } from "../_components/TransactionTable";
import { adminApi } from "@/lib/api";
import { useAuth } from "@clerk/nextjs";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const { getToken, isLoaded, userId } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoaded || !userId) return;
      setLoading(true);
      try {
        const token = await getToken();
        if (!token) return;
        const response = await adminApi.getStats(token);
        setStats(response);
      } catch (error) {
        console.error("Erreur stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refreshKey, isLoaded, userId]);

  const handleRefresh = () => setRefreshKey((prev) => prev + 1);

  if (!isLoaded) return (
    <div className="flex h-[80vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="size-10 border-2 border-tikflow-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-tikflow-slate animate-pulse">
          Chargement...
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-20">

      {/* ── PAGE HEADER ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-tikflow-primary font-black uppercase text-[10px] tracking-[0.28em] mb-2">
            <LayoutDashboard size={11} />
            Vue d'ensemble
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-foreground tracking-tight">
              Tableau de Bord
            </h1>
            {/* Live badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-tikflow-accent/10 border border-tikflow-accent/20 rounded-full">
              <span className="size-1.5 bg-tikflow-accent rounded-full animate-pulse" />
              <span className="text-[9px] font-black text-tikflow-accent uppercase tracking-widest">
                Live
              </span>
            </div>
          </div>
        </div>

        {/* Search + Refresh */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80 group">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-tikflow-slate group-focus-within:text-tikflow-primary transition-colors"
              size={16}
            />
            <input
              className="w-full pl-10 pr-4 py-2.5 bg-background-3 border border-glass-border rounded-xl text-[13px] text-foreground placeholder:text-tikflow-slate font-medium focus:outline-none focus:ring-2 focus:ring-tikflow-primary/20 focus:border-tikflow-primary/40 transition-all"
              placeholder="Rechercher..."
            />
          </div>
          <button
            onClick={handleRefresh}
            title="Actualiser"
            className={`p-2.5 bg-background-3 border border-glass-border rounded-xl text-tikflow-slate hover:text-tikflow-primary hover:border-tikflow-primary/30 transition-all active:scale-95 ${
              loading ? "animate-spin text-tikflow-primary border-tikflow-primary/40" : ""
            }`}
          >
            <RefreshCcw size={16} />
          </button>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard
          title="Transactions Aujourd'hui"
          value={loading ? "—" : (stats?.todayCount?.toLocaleString() ?? "0")}
          subValue={`Volume: ${stats?.todayVolume?.toLocaleString() ?? 0} XOF`}
          trend={`${stats?.trendCount ?? 0}% vs hier`}
          trendUp={(stats?.trendCount ?? 0) >= 0}
          icon={TrendingUp}
          iconBg="bg-blue-500/10"
          iconColor="text-blue-400"
        />
        <StatCard
          title="Wallets Crédités"
          value={loading ? "—" : (stats?.creditedCount?.toLocaleString() ?? "0")}
          subValue={`Réussite: ${stats?.successRate ?? 0}%`}
          trend={`${stats?.trendSuccess ?? 0}% croissance`}
          trendUp={(stats?.trendSuccess ?? 0) >= 0}
          icon={Wallet}
          iconBg="bg-tikflow-primary/10"
          iconColor="text-tikflow-primary"
        />
        <StatCard
          title="En Attente"
          value={loading ? "—" : (stats?.pendingCount?.toLocaleString() ?? "0")}
          subValue={
            (stats?.pendingCount ?? 0) > 0 ? "Action requise" : "Tout est à jour"
          }
          trend={
            (stats?.pendingCount ?? 0) > 0 ? "Prioritaire" : "Aucune alerte"
          }
          trendUp={false}
          icon={Clock}
          iconBg="bg-tikflow-warning/10"
          iconColor="text-tikflow-warning"
          isAlert={(stats?.pendingCount ?? 0) > 0}
        />
      </div>

      {/* ── RECENT TRANSACTIONS ── */}
      <div className="space-y-4">
        {/* Section header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-tikflow-slate text-[10px] font-black uppercase tracking-[0.2em] mb-1">
              <Activity size={11} />
              Activité Récente
            </div>
            <h2 className="text-lg font-black text-foreground tracking-tight">
              Transactions en Attente
            </h2>
          </div>

          <button className="inline-flex items-center gap-2 px-4 py-2 bg-tikflow-primary text-background rounded-xl text-[11px] font-black uppercase tracking-wide hover:bg-tikflow-primary-dark transition-all active:scale-95 shadow-lg shadow-tikflow-primary/20">
            <Download size={13} />
            Exporter CSV
          </button>
        </div>

        {/* Table container */}
        <div className="bg-background-3 rounded-2xl border border-glass-border overflow-hidden shadow-xl shadow-black/20">
          <TransactionTable onActionSuccess={handleRefresh} />

          {/* Table footer */}
          <div className="border-t border-glass-border px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {(stats?.pendingCount ?? 0) > 0 && (
                <span className="size-1.5 bg-tikflow-warning rounded-full animate-pulse" />
              )}
              <span className="text-[11px] font-bold text-tikflow-slate">
                {loading
                  ? "Chargement..."
                  : `${stats?.pendingCount ?? 0} transaction(s) en attente`}
              </span>
            </div>

            <div className="flex gap-2">
              <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-bold text-tikflow-slate border border-glass-border hover:bg-white/[0.04] hover:text-foreground transition-all">
                <ChevronRight size={13} className="rotate-180" />
                Précédent
              </button>
              <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-bold text-tikflow-slate border border-glass-border hover:bg-white/[0.04] hover:text-foreground transition-all">
                Suivant
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}