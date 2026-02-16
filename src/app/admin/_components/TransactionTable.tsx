"use client";

import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { adminApi } from "@/lib/api";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

export function TransactionTable({ onActionSuccess }: { onActionSuccess?: () => void }) {
  const [transactions, setTransactions] = useState<any[]>([]); // Initialisé à tableau vide
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { getToken, isLoaded } = useAuth();

  const fetchTransactions = async () => {
    if (!isLoaded) return;
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) return;

      const response = await adminApi.getPendingTransactions(token);
      
      // On vérifie la structure : soit response.data, soit response directement
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


  if (loading) return <div className="p-10 text-center animate-pulse font-bold text-tikflow-slate">CHARGEMENT...</div>;

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-glass-border text-[10px] font-black text-tikflow-slate uppercase tracking-widest">
            <th className="px-6 py-5">User ID</th>
            <th className="px-6 py-5">Amount (CFA)</th>
            <th className="px-6 py-5">Ref ID / Method</th>
            <th className="px-6 py-5">Status</th>
            <th className="px-6 py-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {/* Sécurité : on vérifie que transactions existe avant .length */}
          {(transactions || []).length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-10 text-center text-slate-400 text-sm font-medium">
                Aucune transaction en attente.
              </td>
            </tr>
          ) : (
            transactions.map((tx) => (
              <tr key={tx.id || tx._id} className="group hover:bg-foreground/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-foreground truncate max-w-[120px]">{tx.user_id}</span>
                    <span className="text-[10px] text-tikflow-primary font-bold uppercase">{tx.type}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-foreground">{tx.amount_cfa?.toLocaleString()} XOF</span>
                    <span className="text-[10px] text-tikflow-slate font-bold">{tx.amount_coins} Coins</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="px-2 py-0.5 bg-foreground/5 rounded text-[10px] font-bold text-tikflow-slate w-fit">
                      {tx.ref_id}
                    </span>
                    <span className="text-[9px] font-black text-tikflow-slate uppercase mt-1">{tx.payment_method}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                   <StatusBadge status={tx.status} />
                </td>
                <td className="px-6 py-4 text-right">
                   <div className="flex items-center justify-end gap-3">
                     <Link 
                       href={tx.type === 'achat_coins' ? `/admin/orders/${tx.id}` : `/admin/transactions/${tx.id}`}
                       className="text-[11px] font-black text-blue-600 hover:underline"
                     >
                       Détails
                     </Link>
                   </div>
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
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5 w-fit ${isPending ? 'bg-tikflow-accent/10 text-tikflow-accent' : 'bg-green-500/10 text-green-500'}`}>
      <span className={`size-1.5 rounded-full ${isPending ? 'bg-tikflow-accent animate-pulse' : 'bg-green-500'}`} />
      {status}
    </span>
  );
}