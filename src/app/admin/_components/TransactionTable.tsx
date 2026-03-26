"use client";

import { useEffect, useState } from "react";
import { Loader2, ExternalLink, ChevronRight } from "lucide-react";
import { adminApi } from "@/lib/api";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

export function TransactionTable({ onActionSuccess }: { onActionSuccess?: () => void }) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { getToken, isLoaded } = useAuth();

  const fetchTransactions = async () => {
    if (!isLoaded) return;
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) return;

      const response = await adminApi.getPendingTransactions(token);
      setTransactions(response || []);
    } catch (error) {
      console.error("Erreur chargement transactions:", error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [isLoaded]);

  if (loading) return (
    <div className="flex-1 flex flex-col items-center justify-center p-20 space-y-4">
      <Loader2 className="animate-spin text-tikflow-primary" size={40} />
      <span className="text-sm font-black text-tikflow-slate uppercase tracking-widest opacity-60">Synchronisation des données...</span>
    </div>
  );

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-glass-border bg-foreground/[0.02]">
            <th className="px-8 py-5 text-[10px] font-black text-tikflow-slate uppercase tracking-[0.2em]">Utilisateur & Type</th>
            <th className="px-8 py-5 text-[10px] font-black text-tikflow-slate uppercase tracking-[0.2em]">Montant & Coins</th>
            <th className="px-8 py-5 text-[10px] font-black text-tikflow-slate uppercase tracking-[0.2em]">Référence / Méthode</th>
            <th className="px-8 py-5 text-[10px] font-black text-tikflow-slate uppercase tracking-[0.2em]">État Actuel</th>
            <th className="px-8 py-5 text-[10px] font-black text-tikflow-slate uppercase tracking-[0.2em] text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-glass-border">
          {(transactions || []).length === 0 ? (
            <tr>
              <td colSpan={5} className="px-8 py-20 text-center">
                <div className="flex flex-col items-center justify-center opacity-40">
                  <div className="size-16 bg-foreground/5 rounded-full flex items-center justify-center mb-4">
                    <ChevronRight size={32} className="rotate-90 text-tikflow-slate" />
                  </div>
                  <p className="text-sm font-black text-tikflow-slate uppercase tracking-widest">Aucune transaction en attente</p>
                </div>
              </td>
            </tr>
          ) : (
            transactions.map((tx) => (
              <tr key={tx.id || tx._id} className="group hover:bg-tikflow-primary/[0.02] transition-colors cursor-default">
                <td className="px-8 py-5">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-foreground truncate max-w-[150px] mb-1 group-hover:text-tikflow-primary transition-colors">
                      {tx.user_id}
                    </span>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md w-fit ${
                      tx.type === 'achat_coins' ? 'bg-blue-500/10 text-blue-500' : 'bg-orange-500/10 text-orange-500'
                    }`}>
                      {tx.type === 'achat_coins' ? 'Commande Coins' : 'Recharge Wallet'}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex flex-col">
                    <span className="text-base font-black text-foreground">{tx.amount_cfa?.toLocaleString()} XOF</span>
                    <span className="text-[10px] text-tikflow-slate font-black opacity-60 tracking-tight">{tx.amount_coins} Coins redistribués</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex flex-col gap-1.5">
                    <div className="px-2.5 py-1 bg-foreground/5 rounded-lg text-[10px] font-black text-foreground border border-glass-border w-fit shadow-sm">
                      {tx.ref_id}
                    </div>
                    <span className="text-[9px] font-black text-tikflow-slate uppercase opacity-70 flex items-center gap-1.5">
                      <div className="size-1 rounded-full bg-tikflow-primary/50" />
                      {tx.payment_method}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5">
                   <StatusBadge status={tx.status} />
                </td>
                <td className="px-8 py-5 text-right">
                   <Link 
                     href={tx.type === 'achat_coins' ? `/admin/orders/${tx.id}` : `/admin/transactions/${tx.id}`}
                     className="inline-flex items-center gap-2 px-4 py-2 bg-foreground/5 text-foreground rounded-xl text-[10px] font-black uppercase hover:bg-tikflow-primary hover:text-white transition-all border border-glass-border group/btn"
                   >
                     Inspecter
                     <ExternalLink size={12} className="opacity-40 group-hover/btn:opacity-100" />
                   </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isPending = status === 'pending';
  const isCompleted = status === 'completed';
  const isRejected = status === 'rejected' || status === 'failed';

  let colorClasses = "bg-slate-500/10 text-slate-500 ring-1 ring-slate-500/20";
  let dotClasses = "bg-slate-500";

  if (isPending) {
    colorClasses = "bg-orange-500/10 text-orange-500 ring-1 ring-orange-500/20 shadow-lg shadow-orange-500/5";
    dotClasses = "bg-orange-500 animate-pulse";
  } else if (isCompleted) {
    colorClasses = "bg-green-500/10 text-green-500 ring-1 ring-green-500/20";
    dotClasses = "bg-green-500";
  } else if (isRejected) {
    colorClasses = "bg-tikflow-danger/10 text-tikflow-danger ring-1 ring-tikflow-danger/20";
    dotClasses = "bg-tikflow-danger";
  }

  return (
    <span className={`px-3 py-1.5 rounded-[0.75rem] text-[9px] font-black uppercase flex items-center gap-2 w-fit tracking-wider ${colorClasses}`}>
      <span className={`size-1.5 rounded-full ${dotClasses}`} />
      {status === 'pending' ? 'En Attente' : status}
    </span>
  );
}
