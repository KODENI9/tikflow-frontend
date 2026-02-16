"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ShieldCheck, MessageSquare, CheckCircle2, XCircle, 
  Copy, LayoutGrid, Loader2, ArrowLeft, AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { adminApi } from "@/lib/api";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-hot-toast";

export default function TransactionDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { getToken, isLoaded } = useAuth();
  
  // State pour stocker la structure { transaction, evidence }
  const [data, setData] = useState<{transaction: any, evidence: any} | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [adminNote, setAdminNote] = useState("");

  const fetchDetails = async () => {
    if (!isLoaded) return;
    try {
      const token = await getToken();
      const res = await adminApi.getTransactionById(token!, id as string);
      // Le backend renvoie maintenant { success: true, data: { transaction, evidence } }
      setData(res);
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Impossible de charger les détails");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id, isLoaded]);

 const handleAction = async (status: 'completed' | 'rejected') => {
    // 1. Sécurité Motif de Rejet
    if (status === 'rejected' && !adminNote) {
      alert("Veuillez saisir un motif de rejet");
      return;
    }

    // 2. Confirmation pour la validation
    if (status === 'completed' && !confirm("Voulez-vous vraiment valider et créditer cette transaction ?")) {
      return;
    }

   try {
    setActionLoading(true);
    const token = await getToken();
    
    const res = await adminApi.updateTransactionStatus(token!, id as string, status, adminNote);

    toast.success(res.message || "Opération réussie !");
    router.push('/admin/transactions');

  } catch (error: any) {
    // ICI : Gestion ultra-précise
    console.error("Détails de l'erreur:", error);

    const errorMessage = error.message || "Erreur inconnue";

    if (errorMessage.includes("insuffisant")) {
       alert(`💰 SOLDE SMS : ${errorMessage}`);
      //  alert(`💰 SOLDE SMS : ${errorMessage}`, { duration: 6000 });
    } else if (error.status === 404) {
       toast.error("❌ Erreur : La transaction n'existe plus sur le serveur.");
    } else {
       toast.error(`L'API a dit : ${errorMessage}`);
    }
  } finally {
    setActionLoading(false);
  } }


  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  if (!data) return <div className="p-10 text-center font-bold">Transaction introuvable.</div>;

  const { transaction, evidence } = data;
  const matchFound = !!evidence;

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 pb-10 px-4">
      {/* --- BREADCRUMBS --- */}
      <div className="flex justify-between items-center">
        <Link href="/admin/transactions" className="flex items-center gap-2 text-xs font-bold text-tikflow-slate hover:text-tikflow-primary transition-colors">
          <ArrowLeft size={14}/> Retour aux transactions
        </Link>
        <span className="text-[10px] font-black text-tikflow-slate/50 uppercase tracking-widest">ID Interne: {transaction.id}</span>
      </div>

      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-foreground uppercase">Réf: {transaction.ref_id}</h1>
            <span className={`px-3 py-1 text-[10px] font-black rounded-lg uppercase flex items-center gap-1.5 ${
              transaction.status === 'pending' ? 'bg-orange-500/10 text-orange-500' : 
              transaction.status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-tikflow-accent/10 text-tikflow-accent'
            }`}>
              <span className={`size-1.5 rounded-full ${transaction.status === 'pending' ? 'bg-orange-500 animate-pulse' : transaction.status === 'completed' ? 'bg-green-500' : 'bg-tikflow-accent'}`} />
              {transaction.status}
            </span>
          </div>
          <p className="text-xs font-bold text-tikflow-slate">
            Soumis le {new Date(transaction.created_at).toLocaleString('fr-FR')}
          </p>
        </div>
        
        {/* Badge Type de commande */}
        <div className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-tighter">
          TYPE: {transaction.type.replace('_', ' ')}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          
          {/* VALIDATION MATCH CARD */}
          <div className="bg-card-bg rounded-[2rem] border border-glass-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-glass-border flex justify-between items-center">
              <div className="flex items-center gap-2 text-tikflow-primary">
                <ShieldCheck size={20} />
                <h2 className="font-black text-sm uppercase tracking-wider">Réconciliation SMS</h2>
              </div>
              <span className={`text-[10px] font-black px-3 py-1 rounded-md ${matchFound ? 'bg-green-500/10 text-green-500' : 'bg-tikflow-accent/10 text-tikflow-accent'}`}>
                {matchFound ? "MATCH SCORE: 100%" : "MATCH SCORE: 0%"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* User Claim (Frontend) */}
              <div className="p-8 border-r border-glass-border space-y-6">
                <div className="flex items-center gap-2 text-tikflow-slate font-bold text-[10px] uppercase tracking-widest">
                  <LayoutGrid size={14} /> Déclaration Client
                </div>
                <div className="bg-tikflow-primary/10 p-6 rounded-2xl border border-tikflow-primary/20 space-y-1">
                  <p className="text-[10px] font-black text-tikflow-primary uppercase">Réf. Saisie</p>
                  <p className="text-2xl font-black text-foreground tracking-tighter italic">{transaction.ref_id}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-black text-tikflow-slate uppercase">Montant payé</p>
                    <p className="text-lg font-black text-foreground">{transaction.amount_cfa.toLocaleString()} XOF</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-tikflow-slate uppercase">Coins à livrer</p>
                    <p className="text-lg font-black text-tikflow-primary">{transaction.amount_coins} 🪙</p>
                  </div>
                </div>
              </div>

              {/* System Evidence (Backend SMS) */}
              <div className={`p-8 space-y-6 ${matchFound ? 'bg-green-500/5' : 'bg-tikflow-accent/5'}`}>
                <div className="flex items-center gap-2 text-tikflow-slate font-bold text-[10px] uppercase tracking-widest">
                  <MessageSquare size={14} /> Preuve Système
                </div>
                
                {matchFound ? (
                  <>
                    <div className="bg-green-500/10 p-6 rounded-2xl border border-green-500/20 space-y-1">
                      <p className="text-[10px] font-black text-green-500 uppercase">Réf. Extraite</p>
                      <div className="flex items-center gap-2">
                        <p className="text-2xl font-black text-foreground tracking-tighter">{evidence.ref_id}</p>
                        <CheckCircle2 size={18} className="text-green-500" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-tikflow-slate uppercase flex justify-between">
                        SMS Reçu de: <span className="text-foreground">{evidence.sender_phone}</span>
                      </p>
                      <div className="bg-background text-tikflow-slate p-4 rounded-xl font-mono text-[11px] leading-relaxed relative group border-l-4 border-green-500 border border-glass-border">
                        {evidence.raw_sms}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-10 text-center">
                    <AlertTriangle size={40} className="text-tikflow-accent mb-2 opacity-50" />
                    <p className="text-xs font-black text-tikflow-accent uppercase">Aucun SMS trouvé avec cet ID de transaction</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ACTION SECTION */}
          {(transaction.status === 'pending' || transaction.status === 'rejected') && (
            <div className="space-y-4">
              <div className="bg-card-bg p-6 rounded-3xl border border-glass-border shadow-sm">
                <label className="text-[10px] font-black text-tikflow-slate uppercase mb-2 block ml-1">Notes Admin / Motif de rejet</label>
                <textarea 
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className="w-full bg-foreground/5 border-none rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 ring-tikflow-primary/30 transition-all text-foreground"
                  placeholder="Ex: Numéro incorrect, SMS non trouvé, etc..."
                  rows={3}
                />
              </div>

              <div className="flex gap-4">
                <button 
                  disabled={actionLoading || !matchFound}
                  onClick={() => handleAction('completed')}
                  className="flex-1 flex items-center justify-center gap-3 py-5 bg-green-500 text-white rounded-2xl font-black text-sm hover:bg-green-600 transition-all shadow-lg shadow-green-500/10 disabled:opacity-30 disabled:grayscale"
                >
                  {actionLoading ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={20} />} 
                  Valider & Créditer
                </button>
                <button 
                  disabled={actionLoading}
                  onClick={() => handleAction('rejected')}
                  className="flex-1 flex items-center justify-center gap-3 py-5 bg-tikflow-accent text-white rounded-2xl font-black text-sm hover:bg-tikflow-accent/90 transition-all shadow-lg shadow-tikflow-accent/10 disabled:opacity-50"
                >
                  <XCircle size={20} /> Rejeter la commande
                </button>
              </div>
              {!matchFound && (
                <p className="text-center text-[10px] font-black text-tikflow-accent uppercase italic">
                  La validation est bloquée car aucune preuve SMS n'a été trouvée.
                </p>
              )}
            </div>
          )}
        </div>

        {/* --- RIGHT COLUMN: USER INFO --- */}
        <div className="space-y-6">
          <div className="bg-card-bg rounded-[2rem] border border-glass-border shadow-sm p-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="size-16 rounded-2xl bg-tikflow-primary/10 flex items-center justify-center border-2 border-glass-border shadow-md">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${transaction.user_id}`} alt="User" />
              </div>
              <div>
                <p className="text-[10px] font-black text-tikflow-primary uppercase tracking-widest">Client</p>
                <h3 className="font-black text-foreground text-lg">ID: {transaction.user_id.substring(0, 8)}...</h3>
                <p className="text-xs font-bold text-tikflow-slate">@{transaction.tiktok_username || 'no_username'}</p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-glass-border space-y-3">
              <div className="flex justify-between items-center bg-foreground/5 p-3 rounded-xl">
                <span className="text-[10px] font-black text-tikflow-slate uppercase">Méthode</span>
                <span className="text-xs font-black text-foreground uppercase italic bg-background px-2 py-1 rounded shadow-sm border border-glass-border">
                  {transaction.payment_method}
                </span>
              </div>
              <div className="flex justify-between items-center bg-foreground/5 p-3 rounded-xl">
                <span className="text-[10px] font-black text-tikflow-slate uppercase">Téléphone</span>
                <span className="text-xs font-black text-foreground">{transaction.phone_number || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}