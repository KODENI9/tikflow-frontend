"use client";

import { useEffect, useState } from "react";
import { 
  Search, Bell, Download, Calendar, RefreshCw, Eye, 
  CheckCircle2, ChevronLeft, ChevronRight, Wallet, Clock, Loader2 
} from "lucide-react";
import Link from "next/link";
import { adminApi } from "@/lib/api";
import { useAuth } from "@clerk/nextjs";

export default function TransactionsListPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { getToken, isLoaded } = useAuth();

  const fetchData = async () => {
    if (!isLoaded) return;
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) return;

      // 1. Fetch Stats (Can fail if index is missing)
      try {
        const statsRes = await adminApi.getStats(token);
        setStats(statsRes);
      } catch (error) {
        console.error("⚠️ Failed to load stats:", error);
        // We don't stop execution here, we just log and continue to transactions
      }

      // 2. Fetch Transactions (Critical)
      try {
        const transRes = await adminApi.getAllTransactions(token);
        setTransactions(transRes || []);
      } catch (error) {
        console.error("❌ Failed to load transactions:", error);
      }

    } catch (error) {
      console.error("Erreur générale de chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isLoaded]);

  // Filtrage local pour la recherche
  const filteredTransactions = transactions.filter(trx => 
    trx.user_id?.toLowerCase().includes(search.toLowerCase()) ||
    trx.ref_id?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-xs font-bold text-tikflow-slate">
          <span>Admin</span> › <span className="text-foreground">Transactions</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-tikflow-slate" size={16} />
            <input 
              className="pl-10 pr-4 py-2 bg-card-bg border border-glass-border rounded-xl text-sm outline-none w-64 text-foreground placeholder-tikflow-slate focus:ring-2 focus:ring-tikflow-primary/20" 
              placeholder="Rechercher par ID ou User..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <RefreshCw 
            onClick={fetchData} 
            className="text-tikflow-slate cursor-pointer hover:rotate-180 transition-all" 
            size={20} 
          />
        </div>
      </div>

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Transactions</h1>
          <p className="text-tikflow-slate text-sm font-medium">Flux financiers en temps réel.</p>
        </div>
      </div>

      {/* --- STATS CARDS (Données réelles) --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "VOLUME TOTAL", val: `${stats?.totalVolume?.toLocaleString() || 0} XOF`, icon: Wallet, color: "text-tikflow-primary", bg: "bg-tikflow-primary/5" },
          { label: "TRANSACTIONS", val: stats?.totalTransactions || 0, icon: Calendar, color: "text-tikflow-accent", bg: "bg-tikflow-accent/5" },
          { label: "EN ATTENTE", val: stats?.pendingTransactions || 0, icon: Clock, color: "text-orange-500", bg: "bg-orange-500/5" },
          { label: "UTILISATEURS", val: stats?.totalUsers || 0, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/5" },
        ].map((s, i) => (
          <div key={i} className="bg-card-bg p-5 rounded-[1.5rem] border border-glass-border shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-tikflow-slate uppercase tracking-widest mb-1">{s.label}</p>
              <span className="text-xl font-black text-foreground">{s.val}</span>
            </div>
            <div className={`p-3 ${s.bg} ${s.color} rounded-xl`}><s.icon size={20} /></div>
          </div>
        ))}
      </div>

      {/* --- TABLE (Données réelles) --- */}
      <div className="bg-card-bg rounded-[2rem] border border-glass-border shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-foreground/5 border-b border-glass-border">
              <th className="px-6 py-4 text-[10px] font-black text-tikflow-slate uppercase">Utilisateur</th>
              <th className="px-6 py-4 text-[10px) font-black text-tikflow-slate uppercase text-center">Montant</th>
              <th className="px-6 py-4 text-[10px] font-black text-tikflow-slate uppercase text-center">Ref ID</th>
              <th className="px-6 py-4 text-[10px] font-black text-tikflow-slate uppercase text-center">Statut</th>
              <th className="px-6 py-4 text-[10px] font-black text-tikflow-slate uppercase text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-glass-border">
            {filteredTransactions.map((trx) => (
              <tr key={trx.id} className="hover:bg-foreground/5 transition-colors text-xs">
                <td className="px-6 py-5">
                  <p className="font-black text-foreground">{trx.user_id}</p>
                  <p className="text-tikflow-slate font-bold">{trx.payment_method}</p>
                </td>
                <td className="px-6 py-5 text-center font-black text-foreground">{trx.amount_cfa?.toLocaleString()} XOF</td>
                <td className="px-6 py-5 text-center">
                  <span className="bg-foreground/5 px-2 py-1 rounded font-mono text-tikflow-slate border border-glass-border">{trx.ref_id}</span>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                    trx.status === "completed" ? "bg-green-500/10 text-green-500" : 
                    trx.status === "pending" ? "bg-orange-500/10 text-orange-500" : 
                    "bg-tikflow-danger/10 text-tikflow-danger"
                  }`}>
                    {trx.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <Link 
                    href={trx.type === 'achat_coins' ? `/admin/orders/${trx.id}` : `/admin/transactions/${trx.id}`} 
                    className="text-tikflow-primary hover:underline font-bold"
                  >
                    Détails
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}