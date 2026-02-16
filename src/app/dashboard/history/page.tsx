"use client";

import { getTransactionHistory } from "@/lib/actions/user.actions";
import { 
  Filter, 
  Calendar, 
  FileDown, 
  ShoppingBag, 
  Wallet, 
  ArrowUpRight, 
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Loader2,
  ChevronRight
} from "lucide-react";
import { useEffect, useState } from "react";

// Helper pour mapper les icônes et couleurs selon les types Firebase
const getTxnConfig = (type: string) => {
  switch (type) {
    case "recharge":
      return { icon: Wallet, color: "text-green-600 bg-green-50", label: "Recharge Wallet" };
    case "achat_coins":
    case "purchase": 
      return { icon: ShoppingBag, color: "text-tikflow-primary bg-tikflow-primary/10", label: "Achat TikTok" };
    case "transfer":
      return { icon: ArrowUpRight, color: "text-orange-500 bg-orange-500/10", label: "Retrait" };
    default: 
      return { icon: AlertCircle, color: "text-tikflow-slate bg-foreground/5", label: "Transaction" };
  }
};

export default function HistoryPage() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalRecharged: 0, totalSpent: 0 });

useEffect(() => {
  const fetchHistory = async () => {
    // On appelle l'action
    const result = await getTransactionHistory();
    
    console.log("Résultat de l'action :", result);

    if (result.success) {
      // On utilise la clé 'transactions' qu'on a définie dans l'action simplifiée
      setTransactions(result.transactions);

      // Calcul des stats sur le tableau propre
      const recharged = result.transactions
        .filter((t: any) => t.type === "recharge" && t.status === "completed")
        .reduce((acc: number, t: any) => acc + (t.amount_cfa || 0), 0);

      const spent = result.transactions
        .filter((t: any) => (t.type === "achat_coins" || t.type === "purchase") && t.status === "completed")
        .reduce((acc: number, t: any) => acc + (t.amount_cfa || 0), 0);
      
      setStats({ totalRecharged: recharged, totalSpent: spent });
    } else {
      console.error("Erreur lors de la récupération :", result.error);
    }
    
    setLoading(false);
  };

  fetchHistory();
}, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96">
      <Loader2 className="animate-spin text-tikflow-primary mb-4" size={40} />
      <p className="text-tikflow-slate font-bold uppercase text-xs tracking-widest">Chargement de l'historique...</p>
    </div>
  );
  
  return (
    <div className="space-y-6 pb-10">
      {/* Stats Cards Dynamiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card-bg p-6 rounded-3xl border border-glass-border shadow-sm flex items-center justify-between relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="relative z-10">
            <p className="text-tikflow-slate text-xs font-black uppercase tracking-widest mb-1">Total Rechargé</p>
            <h3 className="text-3xl font-black text-foreground">+ {stats.totalRecharged.toLocaleString()} <span className="text-sm text-tikflow-slate font-bold">FCFA</span></h3>
            <div className="flex items-center gap-1 mt-2 text-green-500 text-[10px] font-black bg-green-500/10 px-2 py-1 rounded-lg w-fit">
              <TrendingUp size={14} /> <span>MIS À JOUR EN TEMPS RÉEL</span>
            </div>
          </div>
          <div className="size-14 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center shrink-0 border border-green-500/20">
            <Wallet size={28} />
          </div>
        </div>

        <div className="bg-card-bg p-6 rounded-3xl border border-glass-border shadow-sm flex items-center justify-between relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="relative z-10">
            <p className="text-tikflow-slate text-xs font-black uppercase tracking-widest mb-1">Total Dépensé</p>
            <h3 className="text-3xl font-black text-foreground">- {stats.totalSpent.toLocaleString()} <span className="text-sm text-tikflow-slate font-bold">FCFA</span></h3>
            <div className="flex items-center gap-1 mt-2 text-orange-500 text-[10px] font-black bg-orange-500/10 px-2 py-1 rounded-lg w-fit">
              <TrendingDown size={14} /> <span>DÉPENSES CUMULÉES</span>
            </div>
          </div>
          <div className="size-14 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 border border-orange-500/20">
            <ShoppingBag size={28} />
          </div>
        </div>
      </div>

      {/* Toolbar / Filters */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-card-bg p-4 rounded-2xl border border-glass-border shadow-sm">
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 flex-1">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-tikflow-slate" size={18} />
            <select className="pl-10 pr-8 py-2.5 bg-foreground/5 border-none rounded-xl text-sm font-bold text-foreground focus:ring-2 focus:ring-tikflow-primary/20 w-full sm:w-44 appearance-none">
              <option>Tous les types</option>
              <option>Recharge</option>
              <option>Achat Coins</option>
            </select>
          </div>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-black text-background bg-foreground hover:bg-foreground/90 rounded-xl transition-all shadow-lg shadow-tikflow-primary/5 uppercase tracking-tighter">
          <FileDown size={18} /> Exporter PDF
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-card-bg rounded-3xl shadow-sm border border-glass-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-black text-tikflow-slate uppercase tracking-widest border-b border-glass-border bg-foreground/5">
                <th className="px-6 py-5">Type / Description</th>
                <th className="px-6 py-5">Référence</th>
                <th className="px-6 py-5">Date</th>
                <th className="px-6 py-5">Statut</th>
                <th className="px-6 py-5 text-right">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-tikflow-slate font-bold italic">Aucune transaction trouvée</td>
                </tr>
              ) : transactions.map((txn) => {
                const config = getTxnConfig(txn.type);
                
                // Gestion sécurisée des dates Firebase Timestamp
                const txnDate = txn.created_at?._seconds 
                  ? new Date(txn.created_at._seconds * 1000) 
                  : new Date(txn.created_at);

                return (
                  <tr 
                    key={txn.id} 
                    className="group hover:bg-foreground/5 transition-all cursor-pointer relative"
                    onClick={() => window.location.href = `/dashboard/history/${txn.id}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${config.color} border border-tikflow-primary/10`}>
                          <config.icon size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground text-sm">{config.label}</span>
                          <span className="text-[10px] text-tikflow-slate font-bold uppercase">{txn.payment_method || 'TikFlow'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-tikflow-slate">{txn.ref_id || txn.id.substring(0, 10)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-tikflow-slate">
                        {txnDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        txn.status === 'completed' ? 'bg-green-500/10 text-green-500' : 
                        txn.status === 'pending' ? 'bg-orange-500/10 text-orange-500' : 'bg-tikflow-accent/10 text-tikflow-accent'
                      }`}>
                        {txn.status === 'pending' && <span className="size-1.5 rounded-full bg-orange-500 animate-pulse"></span>}
                        {txn.status === 'completed' ? 'Succès' : txn.status === 'pending' ? 'En cours' : 'Échoué'}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-right font-black text-sm ${txn.type === 'recharge' ? 'text-green-500' : 'text-foreground'}`}>
                      <div className="flex items-center justify-end gap-2">
                        <span>{txn.type === 'recharge' ? "+" : "-"} {(txn.amount_cfa || 0).toLocaleString()} FCFA</span>
                        <ChevronRight size={14} className="text-tikflow-slate opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}