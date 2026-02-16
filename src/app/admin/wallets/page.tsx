"use client";

import { useEffect, useState } from "react";
import { 
  Wallet, 
  ArrowUpRight, 
  Clock, 
  TrendingUp, 
  Download, 
  PlusCircle, 
  Filter,
  MoreVertical,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { adminApi } from "@/lib/api";
import { AdminStats, Transaction } from "@/types/api";

export default function WalletManagementPage() {
  const { isLoaded, getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [methodVolumes, setMethodVolumes] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoaded) return;
      
      try {
        setLoading(true);
        const token = await getToken();
        if (!token) return;

        const [statsData, txData] = await Promise.all([
          adminApi.getStats(token),
          adminApi.getAllTransactions(token)
        ]);

        setStats(statsData);
        setTransactions(txData || []);

        // Calculer les volumes par méthode
        const volumes: Record<string, number> = {};
        (txData || []).forEach(tx => {
            if (tx.status === 'completed' && tx.type === 'recharge') {
                const method = tx.payment_method || 'other';
                volumes[method] = (volumes[method] || 0) + tx.amount_cfa;
            }
        });
        setMethodVolumes(volumes);

      } catch (error) {
        console.error("Error fetching wallet data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoaded, getToken]);

  if (loading) {
      return <div className="flex justify-center items-center h-96"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-XO', { style: 'currency', currency: 'XOF' }).format(amount).replace('XOF', 'CFA');
  };

  return (
    <div className="space-y-8">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-foreground tracking-tight">Wallet Management Overview</h1>
            <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-black rounded-lg uppercase border border-green-500/20">
              System Live
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-card-bg border border-glass-border text-tikflow-slate rounded-xl text-xs font-black hover:bg-foreground/5 transition-all">
            <Download size={16} /> Export Ledger
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-tikflow-primary text-white rounded-xl text-xs font-black hover:bg-tikflow-primary/90 transition-all shadow-lg shadow-tikflow-primary/10">
            <PlusCircle size={16} /> Manual Credit/Debit
          </button>
        </div>
      </div>

      {/* --- TOP STATS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            label: "TOTAL REVENUE", 
            val: formatCurrency(stats?.totalRevenue || 0), 
            sub: "Total earnings", 
            color: "text-tikflow-primary", 
            bg: "bg-tikflow-primary/5", 
            icon: Wallet 
          },
          { 
            label: "TODAY'S VOLUME", 
            val: formatCurrency(stats?.todayVolume || 0), 
            sub: `${stats?.todayCount || 0} transactions today`, 
            color: "text-purple-500", 
            bg: "bg-purple-500/5", 
            icon: ArrowUpRight 
          },
          { 
            label: "PENDING REQUESTS", 
            val: (stats?.pendingCount || 0).toString(), 
            sub: "Awaiting approval", 
            color: "text-orange-500", 
            bg: "bg-orange-500/5", 
            icon: Clock 
          },
          { 
            label: "SUCCESS RATE", 
            val: `${stats?.successRate || 0}%`, 
            sub: "Platform efficiency", 
            color: "text-green-500", 
            bg: "bg-green-500/5", 
            icon: TrendingUp 
          },
        ].map((stat, i) => (
          <div key={i} className="bg-card-bg p-6 rounded-[2rem] border border-glass-border shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} />
              </div>
            </div>
            <p className="text-[10px] font-black text-tikflow-slate uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-xl font-black text-foreground tracking-tight">{stat.val}</h3>
            <p className={`text-[10px] font-bold mt-1 ${stat.color}`}>{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- LEFT: SYSTEM WALLETS (FLOAT) --- */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card-bg rounded-[2.5rem] border border-glass-border shadow-sm p-8">
            <h3 className="font-black text-sm text-foreground uppercase tracking-wider mb-6">System Wallets (Inflow)</h3>
            <div className="space-y-6">
              {[
                { name: "TMoney (Togo)", sub: "AGGREGATED VOLUME", balance: methodVolumes['tmoney'] || 0, color: "text-tikflow-accent", bg: "bg-tikflow-accent", width: "w-[85%]" },
                { name: "Flooz (Moov Money)", sub: "AGGREGATED VOLUME", balance: methodVolumes['flooz'] || 0, color: "text-tikflow-primary", bg: "bg-tikflow-primary", width: "w-[65%]" },
                // { name: "MTN Mobile Money", sub: "CARRIER WALLET", balance: methodVolumes['mtn'] || 0, color: "text-green-600", bg: "bg-green-500", width: "w-[30%]" },
              ].map((wallet, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="size-10 bg-foreground/5 rounded-xl flex items-center justify-center text-[10px] font-black text-tikflow-primary border border-glass-border">
                        {wallet.name.substring(0,2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-black text-foreground">{wallet.name}</p>
                        <p className="text-[9px] font-bold text-tikflow-slate">{wallet.sub}</p>
                      </div>
                    </div>
                    {/* <span className={`text-[9px] font-black px-2 py-0.5 rounded-md bg-slate-50 ${wallet.color}`}>Active</span> */}
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <p className="text-sm font-black text-foreground">{formatCurrency(wallet.balance)}</p>
                  </div>
                  <div className="h-1.5 w-full bg-foreground/5 rounded-full overflow-hidden">
                    <div className={`h-full ${wallet.bg} w-full rounded-full opacity-80`} style={{ width: '100%' }} /> 
                    {/* Width is 100% just for visuals, normally we'd calc percentage */}
                  </div>
                </div>
              ))}
            </div>
            {/* <button className="w-full mt-8 py-3 bg-blue-50 text-blue-600 rounded-xl text-xs font-black hover:bg-blue-100 transition-all border border-blue-100/50">
              Configure Auto-Refill
            </button> */}
          </div>
        </div>

        {/* --- RIGHT: RECENT WALLET TRANSACTIONS --- */}
        <div className="lg:col-span-2 bg-card-bg rounded-[2.5rem] border border-glass-border shadow-sm flex flex-col">
          <div className="p-8 border-b border-glass-border flex justify-between items-center">
            <h3 className="font-black text-sm text-foreground uppercase tracking-wider">Recent Transactions</h3>
            <Filter size={18} className="text-tikflow-slate cursor-pointer" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-tikflow-slate uppercase tracking-widest border-b border-glass-border">
                  <th className="px-8 py-4">User ID</th>
                  <th className="px-4 py-4">Type</th>
                  <th className="px-4 py-4">Method</th>
                  <th className="px-4 py-4">Ref ID</th>
                  <th className="px-4 py-4">Amount</th>
                  <th className="px-8 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {transactions.slice(0, 10).map((tx) => (
                  <tr key={tx.id} className="text-xs font-bold text-tikflow-slate hover:bg-foreground/5 transition-colors">
                    <td className="px-8 py-4 text-foreground truncate max-w-[150px]">{tx.user_id}</td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-1 bg-tikflow-primary/10 text-tikflow-primary rounded-md text-[9px] uppercase font-black">{tx.type}</span>
                    </td>
                    <td className="px-4 py-4 flex items-center gap-2 uppercase">
                       {tx.payment_method}
                    </td>
                    <td className="px-4 py-4 text-tikflow-slate text-[10px]">{tx.ref_id}</td>
                    <td className={`px-4 py-4 font-black ${tx.type === 'achat_coins' ? 'text-foreground' : 'text-green-500'}`}>
                        {tx.type === 'recharge' ? '+' : ''} {formatCurrency(tx.amount_cfa)}
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-1.5">
                        <div className={`size-1.5 rounded-full ${
                            tx.status === 'pending' ? 'bg-orange-500 animate-pulse' : 
                            tx.status === 'completed' ? 'bg-green-500' : 
                            'bg-red-500'
                        }`} />
                        <span className={`text-[9px] font-black uppercase ${
                            tx.status === 'pending' ? 'text-orange-500' : 
                            tx.status === 'completed' ? 'text-green-600' : 
                            'text-red-500'
                        }`}>{tx.status}</span>
                      </div>
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                    <tr>
                        <td colSpan={6} className="px-8 py-8 text-center text-slate-400 text-xs">Aucune transaction récente.</td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-6 text-center border-t border-glass-border">
            <button className="text-xs font-black text-tikflow-primary hover:underline">View All Transactions</button>
          </div>
        </div>
      </div>

      {/* --- BOTTOM: REGIONAL LIQUIDITY (Removed for now as we don't have region data) --- */}
      {/* 
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
        ...
      </div> 
      */}
    </div>
  );
}