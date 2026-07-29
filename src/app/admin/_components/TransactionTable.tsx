"use client";

import { useEffect, useState } from "react";
import { Loader2, ExternalLink, Inbox } from "lucide-react";
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
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <Loader2 className="animate-spin text-tikflow-primary" size={32} />
      <span className="text-[11px] font-black text-tikflow-slate uppercase tracking-[0.2em]">
        Synchronisation...
      </span>
    </div>
  );

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-glass-border">
            <th className="px-6 py-4 text-[10px] font-black text-tikflow-slate uppercase tracking-[0.18em]">Utilisateur & Type</th>
            <th className="px-6 py-4 text-[10px] font-black text-tikflow-slate uppercase tracking-[0.18em]">Montant</th>
            <th className="px-6 py-4 text-[10px] font-black text-tikflow-slate uppercase tracking-[0.18em]">Référence</th>
            <th className="px-6 py-4 text-[10px] font-black text-tikflow-slate uppercase tracking-[0.18em]">Statut</th>
            <th className="px-6 py-4 text-[10px] font-black text-tikflow-slate uppercase tracking-[0.18em] text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-glass-border">
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-20 text-center">
                <div className="flex flex-col items-center gap-3 opacity-40">
                  <div className="size-14 bg-white/5 rounded-full flex items-center justify-center">
                    <Inbox size={28} className="text-tikflow-slate" />
                  </div>
                  <p className="text-sm font-black text-tikflow-slate uppercase tracking-widest">
                    Aucune transaction en attente
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            transactions.map((tx) => (
              <tr
                key={tx.id || tx._id}
                className="group hover:bg-tikflow-primary/[0.02] transition-colors"
              >
                {/* User & Type */}
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-foreground truncate max-w-[160px] group-hover:text-tikflow-primary transition-colors">
                      {tx.user_id}
                    </span>
                    {/* JAUNE pour achat_coins (client), violet pour recharge */}
                    <TypeBadge type={tx.type} />
                  </div>
                </td>

                {/* Amount */}
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-black text-foreground">
                      {tx.amount_cfa?.toLocaleString()} XOF
                    </span>
                    <span className="text-[10px] text-tikflow-slate font-medium">
                      {tx.amount_coins} Coins
                    </span>
                  </div>
                </td>

                {/* Reference */}
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="inline-block px-2.5 py-1 bg-white/5 rounded-lg text-[10px] font-black text-foreground border border-glass-border w-fit">
                      {tx.ref_id}
                    </span>
                    <span className="text-[9px] font-bold text-tikflow-slate uppercase tracking-wide">
                      {tx.payment_method}
                    </span>
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <StatusBadge status={tx.status} />
                </td>

                {/* Action */}
                <td className="px-6 py-4 text-right">
                  <Link
                    href={tx.type === "achat_coins"
                      ? `/admin/orders/${tx.id}`
                      : `/admin/transactions/${tx.id}`
                    }
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-background border border-glass-border text-foreground rounded-xl text-[10px] font-black uppercase hover:bg-tikflow-primary hover:text-background hover:border-tikflow-primary transition-all group/btn"
                  >
                    Inspecter
                    <ExternalLink size={11} className="opacity-40 group-hover/btn:opacity-100" />
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

/* ── Type Badge (JAUNE pour client = achat_coins) ── */
function TypeBadge({ type }: { type: string }) {
  const isCoins = type === "achat_coins";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wide w-fit ${
        isCoins
          ? "bg-tikflow-primary/10 text-tikflow-primary"       /* Jaune — Client coins */
          : "bg-purple-500/10 text-purple-400"                  /* Violet — Recharge wallet */
      }`}
    >
      {isCoins ? "Commande Coins" : "Recharge Wallet"}
    </span>
  );
}

/* ── Status Badge ── */
function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { bg: string; dot: string; label: string }> = {
    pending:   { bg: "bg-tikflow-warning/10 text-tikflow-warning ring-1 ring-tikflow-warning/20",  dot: "bg-tikflow-warning animate-pulse", label: "En Attente" },
    completed: { bg: "bg-tikflow-accent/10  text-tikflow-accent  ring-1 ring-tikflow-accent/20",   dot: "bg-tikflow-accent",                label: "Complété"   },
    rejected:  { bg: "bg-tikflow-danger/10  text-tikflow-danger  ring-1 ring-tikflow-danger/20",   dot: "bg-tikflow-danger",                label: "Rejeté"     },
    failed:    { bg: "bg-tikflow-danger/10  text-tikflow-danger  ring-1 ring-tikflow-danger/20",   dot: "bg-tikflow-danger",                label: "Échoué"     },
  };

  const c = configs[status] ?? {
    bg: "bg-white/5 text-tikflow-slate ring-1 ring-white/10",
    dot: "bg-tikflow-slate",
    label: status,
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider w-fit ${c.bg}`}>
      <span className={`size-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}
