"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ShieldCheck, MessageSquare, CheckCircle2, XCircle, 
  Copy, LayoutGrid, Loader2, ArrowLeft, User, Key, Coins, Smartphone, Lock
} from "lucide-react";
import Link from "next/link";
import { adminApi } from "@/lib/api";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-hot-toast";

export default function OrderDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { getToken, isLoaded } = useAuth();
  
  const [data, setData] = useState<{transaction: any, evidence: any} | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [adminNote, setAdminNote] = useState("");

  const fetchDetails = async () => {
    if (!isLoaded) return;
    try {
      const token = await getToken();
      const res = await adminApi.getTransactionById(token!, id as string);
      setData(res);
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Impossible de charger les détails de la commande");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id, isLoaded]);

  const handleAction = async (status: 'completed' | 'rejected') => {
    if (status === 'rejected' && !adminNote) {
      alert("Veuillez saisir un motif de rejet");
      return;
    }

    if (status === 'completed' && !confirm("Voulez-vous marquer cette commande comme livrée ?")) {
      return;
    }

    try {
      setActionLoading(true);
      const token = await getToken();
      const res = await adminApi.updateTransactionStatus(token!, id as string, status, adminNote);
      toast.success(res.message || "Opération réussie !");
      router.push('/admin/transactions');
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestCode = async () => {
    try {
      setActionLoading(true);
      const token = await getToken();
      const res = await adminApi.requestCode(token!, id as string);
      toast.success(res.message || "Demande envoyée !");
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  if (!data || !data.transaction) return <div className="p-10 text-center font-bold">Commande introuvable.</div>;

  const { transaction } = data;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copié !`);
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 pb-10 px-4">
      {/* --- BREADCRUMBS --- */}
      <div className="flex justify-between items-center">
        <Link href="/admin/transactions" className="flex items-center gap-2 text-xs font-bold text-tikflow-slate hover:text-tikflow-primary transition-colors">
          <ArrowLeft size={14}/> Retour aux transactions
        </Link>
        <span className="text-[10px] font-black text-tikflow-slate/50 uppercase tracking-widest">ID Commande: {transaction.id}</span>
      </div>

      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-foreground uppercase">Achat Coins: {transaction.amount_coins} 🪙</h1>
            <span className={`px-3 py-1 text-[10px] font-black rounded-lg uppercase flex items-center gap-1.5 ${
              transaction.status === 'pending' ? 'bg-orange-500/10 text-orange-500' : 
              transaction.status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-tikflow-accent/10 text-tikflow-accent'
            }`}>
              <span className={`size-1.5 rounded-full ${transaction.status === 'pending' ? 'bg-orange-500 animate-pulse' : transaction.status === 'completed' ? 'bg-green-500' : 'bg-tikflow-accent'}`} />
              {transaction.status}
            </span>
          </div>
          <p className="text-xs font-bold text-tikflow-slate">
            Commandé le {new Date(transaction.created_at).toLocaleString('fr-FR')}
          </p>
        </div>
        
        <div className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-tighter shadow-lg shadow-blue-100">
          PAIEMENT WALLET (OK)
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          
          {/* TIKTOK CREDENTIALS CARD */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <div className="flex items-center gap-2 text-slate-900">
                <Smartphone size={20} className="text-blue-600" />
                <h2 className="font-black text-sm uppercase tracking-wider">Identifiants TikTok</h2>
              </div>
              <span className="text-[10px] font-black px-3 py-1 rounded-md bg-blue-100 text-blue-600 uppercase">
                Livraison Requise
              </span>
            </div>

            <div className="p-8 space-y-8">
              {/* Username */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-tikflow-slate uppercase tracking-widest flex items-center gap-2">
                    <User size={12} /> Nom d'utilisateur / Email
                  </label>
                  <button 
                    onClick={() => copyToClipboard(transaction.tiktok_username || '', 'Username')}
                    className="text-[10px] font-bold text-tikflow-primary hover:underline flex items-center gap-1"
                  >
                    <Copy size={10} /> Copier
                  </button>
                </div>
                <div className="bg-foreground/5 p-6 rounded-2xl border border-glass-border">
                   <p className="text-xl font-black text-foreground tracking-tight">{transaction.tiktok_username}</p>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-tikflow-slate uppercase tracking-widest flex items-center gap-2">
                    <Key size={12} /> Mot de passe
                  </label>
                  <button 
                    onClick={() => copyToClipboard(transaction.tiktok_password || '', 'Mot de passe')}
                    className="text-[10px] font-bold text-tikflow-primary hover:underline flex items-center gap-1"
                  >
                    <Copy size={10} /> Copier
                  </button>
                </div>
                <div className="bg-foreground/5 p-6 rounded-2xl border border-glass-border">
                   <p className="text-xl font-black text-foreground tracking-tight">{transaction.tiktok_password}</p>
                </div>
              </div>

              {/* Confirmation Code */}
              {(transaction.requires_code || transaction.confirmation_code) && (
                <div className={`space-y-3 p-6 rounded-3xl border-2 animate-in slide-in-from-bottom-2 duration-300 ${
                  transaction.confirmation_code ? 'bg-green-500/10 border-green-500/20' : 'bg-amber-500/10 border-amber-500/20 italic'
                }`}>
                  <div className="flex justify-between items-center">
                    <label className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${
                      transaction.confirmation_code ? 'text-green-500' : 'text-amber-500'
                    }`}>
                      <Lock size={12} /> Code de Confirmation (Gmail)
                    </label>
                    {transaction.confirmation_code && (
                      <button 
                        onClick={() => copyToClipboard(transaction.confirmation_code || '', 'Code')}
                        className="text-[10px] font-bold text-green-500 hover:underline flex items-center gap-1"
                      >
                        <Copy size={10} /> Copier
                      </button>
                    )}
                  </div>
                  <div className={`${transaction.confirmation_code ? 'bg-background' : 'bg-background/50'} p-6 rounded-2xl border border-glass-border text-center`}>
                     {transaction.confirmation_code ? (
                       <p className="text-4xl font-black text-green-500 tracking-[0.3em]">{transaction.confirmation_code}</p>
                     ) : (
                       <p className="text-sm font-bold text-amber-500">En attente du code client...</p>
                     )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ACTION SECTION */}
          {transaction.status === 'pending' && (
            <div className="space-y-4">
              <div className="bg-card-bg p-6 rounded-3xl border border-glass-border shadow-sm">
                <label className="text-[10px] font-black text-tikflow-slate uppercase mb-2 block ml-1">Note de livraison (optionnel)</label>
                <textarea 
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className="w-full bg-foreground/5 border-none rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-tikflow-primary/30 transition-all text-foreground"
                  placeholder="Ex: Livraison effectuée avec succès !"
                  rows={2}
                />
              </div>

              <div className="flex flex-col gap-4">
                <button 
                  disabled={actionLoading}
                  onClick={handleRequestCode}
                  className="w-full flex items-center justify-center gap-3 py-5 bg-amber-500 text-white rounded-2xl font-black text-sm hover:bg-amber-600 transition-all shadow-lg shadow-amber-100"
                >
                  {actionLoading ? <Loader2 className="animate-spin" /> : <MessageSquare size={20} />} 
                  Demander le code de confirmation (Gmail)
                </button>

                <div className="flex gap-4">
                  <button 
                    disabled={actionLoading}
                    onClick={() => handleAction('completed')}
                    className="flex-1 flex items-center justify-center gap-3 py-5 bg-tikflow-primary text-white rounded-2xl font-black text-sm hover:bg-tikflow-primary/90 transition-all shadow-lg shadow-tikflow-primary/10"
                  >
                    {actionLoading ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={20} />} 
                    Confirmer la Livraison
                  </button>
                  <button 
                    disabled={actionLoading}
                    onClick={() => handleAction('rejected')}
                    className="flex-1 flex items-center justify-center gap-3 py-5 bg-tikflow-accent text-white rounded-2xl font-black text-sm hover:bg-tikflow-accent/90 transition-all shadow-lg shadow-tikflow-accent/10"
                  >
                    <XCircle size={20} /> Annuler la commande
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* --- RIGHT COLUMN: ORDER DETAILS --- */}
        <div className="space-y-6">
          <div className="bg-card-bg rounded-[2rem] border border-glass-border shadow-sm p-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="size-16 rounded-2xl bg-orange-500/10 flex items-center justify-center border-2 border-glass-border shadow-md">
                 <Coins className="text-orange-500" size={32} />
              </div>
              <div>
                <p className="text-[10px] font-black text-tikflow-slate uppercase tracking-widest">Détails Pack</p>
                <h3 className="font-black text-foreground text-lg">{transaction.amount_coins} Coins TikTok</h3>
                <p className="text-xs font-bold text-tikflow-primary">{transaction.amount_cfa.toLocaleString()} XOF Payés</p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-glass-border space-y-3">
              <div className="flex justify-between items-center bg-foreground/5 p-4 rounded-xl">
                <span className="text-[10px] font-black text-tikflow-slate uppercase">Statut Paiement</span>
                <span className="text-[10px] font-black text-green-500 uppercase italic bg-green-500/10 px-2 py-1 rounded border border-green-500/20">
                  DÉBITÉ
                </span>
              </div>
              <div className="flex justify-between items-center bg-foreground/5 p-4 rounded-xl">
                <span className="text-[10px] font-black text-tikflow-slate uppercase">User ID</span>
                <span className="text-[10px] font-mono font-black text-foreground">{transaction.user_id}</span>
              </div>
            </div>

            <div className="p-5 bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-2">
               <div className="flex items-center gap-2 text-amber-500">
                 <ShieldCheck size={16} />
                 <span className="text-[10px] font-black uppercase">Consignes Admin</span>
               </div>
               <p className="text-[11px] text-amber-500 font-medium leading-relaxed">
                 Connectez-vous au compte TikTok ci-contre, rechargez les coins, puis validez la commande pour notifier le client.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
