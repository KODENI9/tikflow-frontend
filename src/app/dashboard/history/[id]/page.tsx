"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Loader2, 
  Wallet, 
  ShoppingBag, 
  ArrowUpRight, 
  AlertCircle,
  Calendar,
  Hash,
  CreditCard,
  User,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { getTransactionByIdAction } from "@/lib/actions/user.actions";
import { toast } from "react-hot-toast";

const getTxnConfig = (type: string) => {
  switch (type) {
    case "recharge":
      return { icon: Wallet, color: "text-green-600 bg-green-50", label: "Recharge Wallet" };
    case "achat_coins":
    case "purchase": 
      return { icon: ShoppingBag, color: "text-indigo-600 bg-indigo-50", label: "Achat TikTok" };
    case "transfer":
      return { icon: ArrowUpRight, color: "text-orange-600 bg-orange-50", label: "Retrait" };
    default: 
      return { icon: AlertCircle, color: "text-slate-600 bg-slate-50", label: "Transaction" };
  }
};

export default function TransactionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState<any>(null);

  useEffect(() => {
    const fetchTransaction = async () => {
      const result = await getTransactionByIdAction(id as string);
      if (result.success) {
        setTransaction(result.transaction);
      } else {
        toast.error(result.error || "Impossible de charger les détails");
        router.push("/dashboard/history");
      }
      setLoading(false);
    };

    fetchTransaction();
  }, [id, router]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
      <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Chargement des détails...</p>
    </div>
  );

  if (!transaction) return null;

  const config = getTxnConfig(transaction.type);
  const txnDate = transaction.created_at?._seconds 
    ? new Date(transaction.created_at._seconds * 1000) 
    : new Date(transaction.created_at);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Back Button */}
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard/history" 
          className="p-2 hover:bg-white rounded-xl transition-colors text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-100"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">Détails de la transaction</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Référence: {transaction.ref_id || transaction.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Status & Amount Card */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 pointer-events-none opacity-50"></div>
            
            <div className="relative z-10 space-y-8">
              <div className="flex justify-between items-start">
                <div className={`size-16 rounded-3xl flex items-center justify-center ${config.color}`}>
                  <config.icon size={32} />
                </div>
                <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${
                  transaction.status === 'completed' ? 'bg-green-100 text-green-700' : 
                  transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                }`}>
                  {transaction.status === 'pending' && <span className="size-2 rounded-full bg-yellow-500 animate-pulse"></span>}
                  {transaction.status === 'completed' ? 'Succès' : transaction.status === 'pending' ? 'En cours' : 'Échoué'}
                </div>
              </div>

              <div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Montant de la transaction</p>
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
                  {transaction.type === 'recharge' ? '+' : '-'} {(transaction.amount_cfa || 0).toLocaleString()} <span className="text-lg text-slate-400">FCFA</span>
                </h2>
                {transaction.amount_coins > 0 && (
                  <div className="flex items-center gap-2 mt-2 text-blue-600 font-bold">
                    <span className="text-sm">🪙 {transaction.amount_coins.toLocaleString()} Coins TikTok</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-50">
                <div className="space-y-1">
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                    <Calendar size={12} /> Date & Heure
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    {txnDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-xs font-medium text-slate-500">
                    {txnDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="space-y-1 text-right md:text-left">
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 justify-end md:justify-start">
                    <Hash size={12} /> Méthode
                  </p>
                  <p className="text-sm font-bold text-slate-900 uppercase italic">
                    {transaction.payment_method || 'Wallet TikFlow'}
                  </p>
                  <p className="text-xs font-medium text-slate-500">
                    {transaction.phone_number || 'Paiement Interne'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info / Description */}
          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm space-y-6">
            <h3 className="font-black text-sm uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <AlertCircle size={18} /> Information Complémentaire
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <span className="text-xs font-bold text-slate-500 uppercase">Type d'opération</span>
                <span className="text-sm font-black text-slate-900 uppercase">{config.label}</span>
              </div>
              
              {transaction.tiktok_username && (
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <span className="text-xs font-bold text-slate-500 uppercase">Compte TikTok</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-blue-600">@{transaction.tiktok_username}</span>
                  </div>
                </div>
              )}

              {transaction.admin_note && (
                <div className="p-6 bg-red-50 rounded-2xl border border-red-100 space-y-2">
                  <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Note de l'administration</p>
                  <p className="text-sm font-bold text-red-700 leading-relaxed">{transaction.admin_note}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl shadow-slate-200 space-y-6 relative overflow-hidden group">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full -mb-16 -mr-16 blur-2xl group-hover:bg-white/10 transition-colors"></div>
            
            <div className="space-y-4 relative z-10">
              <div className="size-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <AlertCircle size={24} className="text-blue-400" />
              </div>
              <div>
                <h4 className="font-black text-lg">Besoin d'aide ?</h4>
                <p className="text-xs text-slate-400 font-medium leading-relaxed mt-1">
                  Une question sur cette transaction ? Notre équipe est là pour vous aider.
                </p>
              </div>
              <button className="w-full py-3 bg-white text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all">
                Contact Support
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm space-y-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Sécurité</p>
            <div className="flex items-center gap-4 p-3 bg-green-50 rounded-2xl">
              <div className="size-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                <CreditCard size={20} />
              </div>
              <p className="text-[10px] font-bold text-green-700 leading-tight">
                Cette transaction est sécurisée et protégée par TikFlow Cryptography.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
