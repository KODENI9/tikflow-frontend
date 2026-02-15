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

      // 1. On récupère les stats et les transactions en parallèle
      const [statsRes, transRes] = await Promise.all([
        adminApi.getStats(token),
        adminApi.getAllTransactions(token) // Assure-toi d'avoir cette méthode dans adminApi
      ]);

      setStats(statsRes);
      setTransactions(transRes);
    } catch (error) {
      console.error("Erreur de chargement:", error);
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
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
          <span>Admin</span> › <span className="text-slate-900">Transactions</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              className="pl-10 pr-4 py-2 bg-white border border-slate-100 rounded-xl text-sm outline-none w-64" 
              placeholder="Rechercher par ID ou User..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <RefreshCw 
            onClick={fetchData} 
            className="text-slate-400 cursor-pointer hover:rotate-180 transition-all" 
            size={20} 
          />
        </div>
      </div>

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Transactions</h1>
          <p className="text-slate-500 text-sm font-medium">Flux financiers en temps réel.</p>
        </div>
      </div>

      {/* --- STATS CARDS (Données réelles) --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "VOLUME TOTAL", val: `${stats?.totalVolume?.toLocaleString() || 0} XOF`, icon: Wallet, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "TRANSACTIONS", val: stats?.totalTransactions || 0, icon: Calendar, color: "text-orange-600", bg: "bg-orange-50" },
          { label: "EN ATTENTE", val: stats?.pendingTransactions || 0, icon: Clock, color: "text-orange-500", bg: "bg-orange-50" },
          { label: "UTILISATEURS", val: stats?.totalUsers || 0, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
        ].map((s, i) => (
          <div key={i} className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
              <span className="text-xl font-black text-slate-900">{s.val}</span>
            </div>
            <div className={`p-3 ${s.bg} ${s.color} rounded-xl`}><s.icon size={20} /></div>
          </div>
        ))}
      </div>

      {/* --- TABLE (Données réelles) --- */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-50">
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Utilisateur</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase text-center">Montant</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase text-center">Ref ID</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase text-center">Statut</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredTransactions.map((trx) => (
              <tr key={trx.id} className="hover:bg-slate-50/50 transition-colors text-xs">
                <td className="px-6 py-5">
                  <p className="font-black text-slate-900">{trx.user_id}</p>
                  <p className="text-slate-400 font-bold">{trx.payment_method}</p>
                </td>
                <td className="px-6 py-5 text-center font-black">{trx.amount_cfa?.toLocaleString()} XOF</td>
                <td className="px-6 py-5 text-center">
                  <span className="bg-slate-100 px-2 py-1 rounded font-mono text-slate-500">{trx.ref_id}</span>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                    trx.status === "completed" ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"
                  }`}>
                    {trx.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <Link 
                    href={trx.type === 'achat_coins' ? `/admin/orders/${trx.id}` : `/admin/transactions/${trx.id}`} 
                    className="text-blue-600 hover:underline font-bold"
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