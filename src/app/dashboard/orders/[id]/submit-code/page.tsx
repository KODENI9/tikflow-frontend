"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { userApi, adminApi } from "@/lib/api";
import { 
  ShieldCheck, 
  Loader2, 
  ChevronRight, 
  Lock, 
  Mail, 
  AlertCircle,
  ArrowLeft,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function SubmitCodePage() {
  const { id } = useParams();
  const router = useRouter();
  const { getToken, isLoaded, userId } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [code, setCode] = useState("");
  const [transaction, setTransaction] = useState<any>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchTransaction = async () => {
      if (!isLoaded || !id) return;
      try {
        const token = await getToken();
        // Use userApi instead of adminApi to avoid permission issues
        const res = await userApi.getTransactionById(token!, id as string);
        setTransaction(res); // The userApi returns the transaction directly simplified in helper
      } catch (error: any) {
        console.error("Error fetching transaction:", error);
        toast.error("Impossible de récupérer les détails de la commande.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [id, isLoaded, getToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.length < 4) {
      toast.error("Veuillez entrer un code valide.");
      return;
    }

    try {
      setSubmitting(true);
      const token = await getToken();
      await userApi.submitCode(token!, id as string, code);
      toast.success("Code transmis avec succès !");
      setSuccess(true);
      // Redirect after 3 seconds
      setTimeout(() => {
        router.push("/dashboard/history");
      }, 3000);
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'envoi du code.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
      <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Initialisation sécurisée...</p>
    </div>
  );

  if (!transaction) return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-3xl border border-slate-100 shadow-xl text-center">
      <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
      <h2 className="text-lg font-black text-slate-900 uppercase">Commande introuvable</h2>
      <p className="text-slate-500 text-sm font-medium mt-2">Désolé, nous ne parvenons pas à retrouver cette transaction.</p>
      <Link href="/dashboard/history" className="mt-6 inline-flex items-center gap-2 text-blue-600 font-black text-xs uppercase hover:underline">
        <ArrowLeft size={14} /> Retour à l'historique
      </Link>
    </div>
  );

  if (success) return (
    <div className="max-w-md mx-auto mt-10 p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl text-center animate-in zoom-in duration-300">
      <div className="size-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-lg shadow-green-100">
        <CheckCircle2 size={40} className="text-green-500" />
      </div>
      <h2 className="text-2xl font-black text-slate-900 uppercase">Code Reçu !</h2>
      <p className="text-slate-500 text-sm font-bold mt-3 leading-relaxed">
        Votre code a été transmis à l'administrateur. La livraison de vos <span className="text-blue-600">{transaction.amount_coins} coins</span> va reprendre.
      </p>
      <div className="mt-8 pt-8 border-t border-slate-50">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Redirection automatique...</p>
        <Link href="/dashboard/history" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all inline-block shadow-lg">
          Voir l'historique
        </Link>
      </div>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
            Sécurisation <ShieldCheck className="text-blue-600" size={32} />
          </h1>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Étape de vérification TikTok</p>
        </div>
        <Link href="/dashboard/history" className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-colors">
          <ArrowLeft size={20} />
        </Link>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-blue-50/50 overflow-hidden">
        {/* Info Banner */}
        <div className="bg-amber-50 p-6 flex gap-4 border-b border-amber-100">
          <div className="size-12 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm">
            <Mail className="text-amber-500" size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="font-black text-sm text-amber-900 uppercase">Code de confirmation requis</h3>
            <p className="text-xs text-amber-700 font-medium leading-relaxed">
              Veuillez vérifier votre compte Gmail lié à <span className="font-bold underline text-amber-900">{transaction.tiktok_username}</span>. TikTok vient d'y envoyer un code.
            </p>
          </div>
        </div>

        <div className="p-8 md:p-12 space-y-10">
          {/* Order Brief */}
          <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center font-black text-blue-600 shadow-sm">
                 {transaction.amount_coins}
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Commande en cours</p>
                <h4 className="font-black text-slate-900 uppercase text-sm">Coins TikTok</h4>
              </div>
            </div>
            <ChevronRight className="text-slate-300" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Lock size={12} /> Entrez le code ici
              </label>
              <input 
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ex: 123456"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl py-6 px-8 text-3xl font-black text-center text-blue-600 focus:bg-white focus:border-blue-600/20 focus:ring-4 ring-blue-50 outline-none transition-all placeholder:text-slate-200 tracking-[0.5em]"
                maxLength={10}
                required
                disabled={submitting}
                autoFocus
              />
              <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                Le code permet à l'administrateur de valider la livraison sur votre profil
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-6 bg-[#1152d4] text-white rounded-[1.5rem] font-black uppercase tracking-widest text-sm shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Transmission en cours...
                </>
              ) : (
                <>
                  Envoyer le code à l'admin
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Security */}
        <div className="p-6 bg-slate-50/50 border-t border-slate-50 text-center">
            <div className="flex items-center justify-center gap-2 text-slate-400">
               <ShieldCheck size={14} />
               <span className="text-[10px] font-black uppercase tracking-widest">Espace Sécurisé TikFlow</span>
            </div>
        </div>
      </div>
    </div>
  );
}
