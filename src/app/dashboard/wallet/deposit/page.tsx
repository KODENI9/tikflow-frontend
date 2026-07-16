"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Zap } from "lucide-react";
import { createDepositAction } from "@/lib/actions/user.actions";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function DepositPage() {
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [nomclient, setNomclient] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !phone || !nomclient) {
      return toast.error("Veuillez remplir tous les champs.");
    }

    setLoading(true);

    const result = await createDepositAction(
      Number(amount),
      phone,
      nomclient
    );

    if (result.success && result.data?.paymentUrl) {
      toast.success("Redirection vers MoneyFusion...");
      window.location.href = result.data.paymentUrl;
    } else {
      toast.error(result.error || "Erreur lors de l'initialisation du paiement");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 pb-10">
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-100/50 border border-slate-50 overflow-hidden p-8 md:p-12">
        <div className="text-center space-y-2 mb-8">
          <div className="size-16 bg-blue-100 text-[#1152d4] rounded-full flex items-center justify-center mx-auto mb-4">
             <Zap size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-900">Recharger Wallet</h2>
          <p className="text-slate-500">Rechargez votre portefeuille instantanément via Mobile Money (MoneyFusion).</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Montant à recharger (FCFA)</label>
                <input 
                  required
                  type="number"
                  min="100"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Ex: 5000"
                  className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl text-lg font-bold"
                />
            </div>
            
            <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Numéro Mobile Money</label>
                <input 
                  required
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ex: 0102030405"
                  className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl text-lg font-bold"
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nom Complet</label>
                <input 
                  required
                  type="text"
                  value={nomclient}
                  onChange={(e) => setNomclient(e.target.value)}
                  placeholder="Ex: Jean Dupont"
                  className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl text-lg font-bold"
                />
            </div>

            <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#1152d4] text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-8 uppercase"
              >
                {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}
                {loading ? "Initialisation..." : "Procéder au paiement"}
            </button>
        </form>
      </div>
    </div>
  );
}