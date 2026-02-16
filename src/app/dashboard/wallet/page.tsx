"use client";
import { fetchUserwalletBalance, getTransactionHistory } from "@/lib/actions/user.actions";
import { useUser } from "@clerk/nextjs";
import { 
  Wallet, 
  PlusCircle, 
  ArrowDownCircle, 
  ShoppingCart, 
  Download, 
  Filter, 
  CreditCard, 
  AlertCircle,
  ArrowRightLeft
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Transaction } from "@/types/api";

export default function WalletPage() {
  const { user } = useUser();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ recharges: 0, expenses: 0 });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [balanceRes, historyRes] = await Promise.all([
          fetchUserwalletBalance(),
          getTransactionHistory()
        ]);

        if (balanceRes && typeof balanceRes.balance === 'number') {
          setBalance(balanceRes.balance);
        }

        if (historyRes.success) {
          const txs = historyRes.transactions;
          setTransactions(txs);

          // Calcul des stats des 30 derniers jours
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

          const monthlyStats = txs.reduce((acc: any, tx: Transaction) => {
            const txDate = new Date(tx.created_at?._seconds ? tx.created_at._seconds * 1000 : tx.created_at);
            if (txDate >= thirtyDaysAgo) {
              if (tx.type === 'recharge' && tx.status === 'completed') {
                acc.recharges += tx.amount_cfa;
              } else if (tx.type === 'achat_coins' && (tx.status === 'completed' || tx.status === 'pending')) {
                acc.expenses += tx.amount_cfa;
              }
            }
            return acc;
          }, { recharges: 0, expenses: 0 });

          setStats(monthlyStats);
        }
      } catch (error) {
        console.error("Erreur chargement wallet:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-12 h-12 border-4 border-tikflow-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-tikflow-slate font-medium">Chargement de votre portefeuille...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Top Section: Balance & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Balance Card */}
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl group min-h-[240px] flex flex-col justify-between border border-white/5">
          <div className="absolute top-0 right-0 w-2/3 h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-tikflow-primary rounded-full blur-[100px] opacity-30"></div>
          
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Solde Total disponible</p>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                {balance.toLocaleString()} <span className="text-xl md:text-2xl font-medium text-slate-500">FCFA</span>
              </h1>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
              <Wallet size={28} />
            </div>
          </div>

          <div className="relative z-10 flex justify-between items-end">
            <div className="space-y-1">
              <p className="text-[10px] text-slate-500 uppercase font-bold">ID Portefeuille</p>
              <p className="font-mono text-sm tracking-widest text-slate-200">TKF •••• {user?.id?.slice(-4) || '8492'}</p>
            </div>
            <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-[10px] font-bold text-green-400 uppercase">Compte Actif</span>
            </div>
          </div>
        </div>

        {/* Quick Monthly Stats */}
        <div className="flex flex-col gap-4">
          <div className="bg-card-bg p-5 rounded-2xl border border-glass-border shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-green-500/10 text-green-500 rounded-lg"><ArrowDownCircle size={20}/></div>
              <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-md">Ce mois</span>
            </div>
            <div>
              <p className="text-xs text-tikflow-slate font-medium">Recharges (Mois)</p>
              <p className="text-xl font-bold text-foreground">{stats.recharges.toLocaleString()} FCFA</p>
            </div>
            <div className="w-full bg-foreground/5 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-green-500 h-full transition-all duration-1000" 
                style={{ width: `${Math.min(100, (stats.recharges / 50000) * 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-card-bg p-5 rounded-2xl border border-glass-border shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-orange-500/10 text-orange-500 rounded-lg"><ShoppingCart size={20}/></div>
              <span className="text-[10px] font-bold text-tikflow-slate uppercase tracking-tighter">Dépenses</span>
            </div>
            <div>
              <p className="text-xs text-tikflow-slate font-medium">Achats Coins</p>
              <p className="text-xl font-bold text-foreground">{stats.expenses.toLocaleString()} FCFA</p>
            </div>
            <div className="w-full bg-foreground/5 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-orange-500 h-full transition-all duration-1000" 
                style={{ width: `${Math.min(100, (stats.expenses / 50000) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link 
        href="/dashboard/wallet/deposit" 
        className="flex items-center justify-center gap-3 bg-tikflow-primary hover:bg-tikflow-primary/90 text-white py-4 rounded-2xl font-bold shadow-lg shadow-tikflow-primary/10 transition-all hover:-translate-y-1">
          <PlusCircle size={20} /> Recharger le compte
        </Link>
        <button className="flex items-center justify-center gap-3 bg-card-bg border border-glass-border text-foreground py-4 rounded-2xl font-bold hover:bg-foreground/5 transition-all hover:-translate-y-1">
          <ArrowRightLeft size={20} /> Retirer / Transférer
        </button>
      </div>

      {/* Transactions Table */}
      <div className="bg-card-bg rounded-3xl shadow-sm border border-glass-border overflow-hidden">
        <div className="p-6 border-b border-glass-border flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-foreground">Mouvements du portefeuille</h3>
            <p className="text-sm text-tikflow-slate">Historique complet de vos activités financières</p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-tikflow-slate hover:bg-foreground/5 rounded-xl border border-glass-border"><Filter size={18}/></button>
            <button className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-xl text-sm font-bold hover:bg-foreground/90 transition-colors">
              <Download size={16}/> Exporter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-tikflow-slate bg-foreground/5">
                <th className="px-6 py-4 font-bold">Type / Description</th>
                <th className="px-6 py-4 font-bold">Référence</th>
                <th className="px-6 py-4 font-bold">Statut</th>
                <th className="px-6 py-4 font-bold text-right">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border">
              {transactions.length > 0 ? (
                transactions.map((tx) => {
                  const txDate = new Date(tx.created_at?._seconds ? tx.created_at._seconds * 1000 : tx.created_at);
                  const isPositive = tx.type === 'recharge';
                  
                  return (
                    <tr key={tx.id} className="hover:bg-foreground/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full group-hover:scale-110 transition-transform ${
                            isPositive ? 'bg-green-500/10 text-green-500' : 'bg-tikflow-primary/10 text-tikflow-primary'
                          }`}>
                            {isPositive ? <CreditCard size={18}/> : <ShoppingCart size={18}/>}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">
                              {tx.type === 'recharge' ? 'Recharge Compte' : `Achat ${tx.amount_coins} Coins`}
                            </p>
                            <p className="text-[10px] text-tikflow-slate capitalize">
                              {format(txDate, "dd MMM, HH:mm", { locale: fr })} • {tx.payment_method}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-[10px] text-tikflow-slate">{tx.ref_id}</td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full w-fit border text-[10px] font-bold uppercase ${
                          tx.status === 'completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                          tx.status === 'pending' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                          'bg-tikflow-accent/10 text-tikflow-accent border-tikflow-accent/20'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            tx.status === 'completed' ? 'bg-green-500' :
                            tx.status === 'pending' ? 'bg-orange-500 animate-pulse' :
                            'bg-tikflow-accent'
                          }`}></span>
                          {tx.status === 'completed' ? 'Validé' : 
                           tx.status === 'pending' ? 'En attente' : 'Refusé'}
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-right font-black ${isPositive ? 'text-green-500' : 'text-foreground'}`}>
                        {isPositive ? '+' : '-'} {tx.amount_cfa.toLocaleString()} FCFA
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                       <AlertCircle size={32} className="text-gray-200" />
                       <p className="text-sm text-gray-500 font-medium">Aucun mouvement trouvé dans votre historique.</p>
                       <Link href="/dashboard/wallet/deposit" className="text-xs text-blue-600 font-bold hover:underline mt-2">
                         Effectuer un premier dépôt
                       </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
