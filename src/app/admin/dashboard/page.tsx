"use client";

import { useEffect, useState } from "react";
import { 
  TrendingUp, Wallet, Clock, Search, Bell, 
  Download, RefreshCcw, LayoutDashboard, ChevronRight
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

  const handleRefresh = () => setRefreshKey(prev => prev + 1);

  if (!isLoaded) return (
    <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <div className="size-12 border-4 border-tikflow-primary border-t-transparent rounded-full animate-spin" />
            <p className="font-black text-xs uppercase tracking-[0.3em] text-tikflow-slate animate-pulse">Session Handshake...</p>
        </div>
    </div>
  );
  
  return (
    <div className="space-y-10 max-w-[1600px] mx-auto pb-20">
      {/* --- PAGE HEADER --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-tikflow-primary font-black uppercase text-[10px] tracking-[0.3em] mb-1">
            <LayoutDashboard size={12} />
            Vue d'ensemble
          </div>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-black text-foreground tracking-tighter">Tableau de Bord</h1>
            <div className="flex items-center gap-2 px-3 py-1 bg-tikflow-accent/10 border border-tikflow-accent/20 rounded-full">
                <div className="size-1.5 bg-tikflow-accent rounded-full animate-pulse" />
                <span className="text-[9px] font-black text-tikflow-accent uppercase tracking-widest">Opérationnel</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative group flex-1 lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-tikflow-slate group-focus-within:text-tikflow-primary transition-all" size={18} />
            <input 
              className="w-full pl-12 pr-4 py-3.5 bg-card-bg border border-glass-border rounded-2xl text-[13px] font-bold focus:ring-4 focus:ring-tikflow-primary/10 focus:border-tikflow-primary/40 outline-none transition-all placeholder:text-tikflow-slate/50 shadow-sm" 
              placeholder="Rechercher une transaction, un utilisateur..." 
            />
          </div>
          <button 
                onClick={handleRefresh}
                className={`p-3.5 bg-card-bg border border-glass-border rounded-2xl text-tikflow-slate hover:text-tikflow-primary hover:border-tikflow-primary/30 transition-all shadow-sm active:scale-95 ${loading ? 'animate-spin border-tikflow-primary text-tikflow-primary' : ''}`}
                title="Actualiser les données"
            >
                <RefreshCcw size={18} />
          </button>
        </div>
      </div>

      {/* --- QUICK ACTION STATS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <StatCard 
          title="Transactions Aujourd'hui" 
          value={stats?.todayCount?.toLocaleString() || "0"} 
          subValue={`Volume total: ${stats?.todayVolume?.toLocaleString() || 0} CFA`} 
          trend={`${stats?.trendCount || 0}% vs hier`} 
          trendUp={stats?.trendCount >= 0} 
          icon={TrendingUp} 
          iconBg="bg-blue-500/10" 
          iconColor="text-tikflow-primary"
        />
        <StatCard 
          title="Portefeuilles Alimentés" 
          value={stats?.creditedCount?.toLocaleString() || "0"} 
          subValue={`Taux de réussite: ${stats?.successRate || 0}%`} 
          trend={`${stats?.trendSuccess || 0}% de croissance`} 
          trendUp={stats?.trendSuccess >= 0} 
          icon={Wallet} 
          iconBg="bg-blue-500/10" 
          iconColor="text-tikflow-primary"
        />
        <StatCard 
          title="Demandes en Attente" 
          value={stats?.pendingCount?.toLocaleString() || "0"} 
          subValue={stats?.pendingCount > 0 ? "Action requise immédiate" : "Tout est à jour"} 
          trend={stats?.pendingCount > 0 ? "Validation Prioritaire" : "Aucune alerte"} 
          trendUp={false} 
          icon={Clock} 
          iconBg="bg-orange-500/10" 
          iconColor="text-tikflow-secondary" 
          isAlert={stats?.pendingCount > 0}
        />
      </div>

      {/* --- TABLE CONTENT --- */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div className="flex flex-col">
                <h3 className="text-xl font-black text-foreground tracking-tight">Transactions Récentes</h3>
                <p className="text-xs font-bold text-tikflow-slate opacity-60">Dernières activités nécessitant une attention admin.</p>
            </div>
            <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background dark:bg-foreground dark:text-background rounded-xl text-[11px] font-black uppercase hover:opacity-90 transition-all shadow-lg active:scale-95">
                    <Download size={14} /> Exporter (.csv)
                </button>
            </div>
        </div>

        <div className="bg-card-bg/50 backdrop-blur-md rounded-[2.5rem] border border-glass-border shadow-xl shadow-black/5 overflow-hidden min-h-[500px] flex flex-col transition-all hover:shadow-2xl hover:shadow-tikflow-primary/5">
            <TransactionTable onActionSuccess={handleRefresh} />
            
            <div className="mt-auto border-t border-glass-border p-8 bg-foreground/[0.01] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="size-2 bg-tikflow-secondary rounded-full animate-bounce" />
                    <p className="text-[10px] font-black text-tikflow-secondary uppercase tracking-[0.2em]">
                        {loading ? "Mise à jour..." : `Total en attente: ${stats?.pendingCount || 0}`}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button className="group px-6 py-2.5 rounded-xl text-xs font-black text-tikflow-slate border border-glass-border hover:bg-foreground hover:text-background transition-all flex items-center gap-2">
                       <ChevronRight size={14} className="rotate-180 opacity-50 group-hover:opacity-100" /> Précédent
                    </button>
                    <button className="group px-6 py-2.5 rounded-xl text-xs font-black text-foreground border border-glass-border hover:bg-foreground hover:text-background transition-all flex items-center gap-2">
                       Suivant <ChevronRight size={14} className="opacity-50 group-hover:opacity-100" />
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}