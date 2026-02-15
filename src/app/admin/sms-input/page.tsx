"use client";

import { useState } from "react";
import { MessageSquare, Send, ShieldAlert, CheckCircle, Smartphone } from "lucide-react";
import { adminApi } from "@/lib/api";
import { toast } from "react-hot-toast";

const SENDERS = [
  { id: "TMoney", name: "TMoney", color: "bg-yellow-400 text-yellow-900 border-yellow-500", icon: "T" },
  { id: "Flooz", name: "Flooz", color: "bg-blue-600 text-white border-blue-700", icon: "F" },
  { id: "Orange", name: "Orange Money", color: "bg-orange-500 text-white border-orange-600", icon: "O" },
  { id: "Wave", name: "Wave", color: "bg-sky-400 text-white border-sky-500", icon: "W" },
];

export default function SMSManualInput() {
  const [sender, setSender] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content || !sender) return toast.error("Veuillez sélectionner un expéditeur et coller le SMS.");

    try {
      setLoading(true);
      await adminApi.simulateSMS({ sender, content });
      toast.success(`Paiement ${sender} injecté avec succès !`);
      setContent(""); // Reset content only, keep sender for convenience
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      {/* HEADER */}
      <div className="flex items-center gap-4 border-b pb-4">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
          <MessageSquare size={24} />
        </div>
        <div>
          <h1 className="text-xl font-black uppercase tracking-tight">Passerelle SMS Manuelle</h1>
          <p className="text-sm text-slate-500 font-medium">Injectez les SMS de paiement reçus sur les SIMs</p>
        </div>
      </div>

      <form onSubmit={handleSend} className="space-y-8 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
        
        {/* SENDER SELECTION */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Smartphone size={16} className="text-slate-400" />
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Choisir l'opérateur</label>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {SENDERS.map((s) => {
              const isSelected = sender === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSender(s.id)}
                  className={`
                    relative group flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200
                    ${isSelected 
                      ? `${s.color} ring-4 ring-offset-2 ring-slate-100 scale-[1.02] shadow-lg` 
                      : "bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100"
                    }
                  `}
                >
                  <div className={`
                    size-10 rounded-xl flex items-center justify-center font-black text-lg shadow-sm
                    ${isSelected ? "bg-white/20 backdrop-blur-sm" : "bg-white"}
                  `}>
                    {s.icon}
                  </div>
                  <span className={`font-black text-sm tracking-wide ${isSelected ? "opacity-100" : "opacity-60 group-hover:opacity-100"}`}>
                    {s.name}
                  </span>
                  
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle size={18} className="text-white drop-shadow-md" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* CONTENT INPUT */}
        <div className="space-y-4">
           <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Contenu du SMS</label>
           <div className="relative">
             <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Ex: Tmoney: Vous avez reçu 5000 FCFA de..."
                rows={6}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"
              />
              <div className="absolute bottom-4 right-4 text-[10px] font-bold text-slate-400 uppercase bg-white/50 px-2 py-1 rounded-md backdrop-blur-sm">
                Détection Auto
              </div>
           </div>
        </div>

        {/* SUBMIT */}
        <button 
          disabled={loading || !sender || !content}
          className="w-full py-4 bg-slate-900 text-white rounded-xl font-black text-sm hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-slate-200 hover:shadow-2xl hover:shadow-slate-300 hover:-translate-y-1"
        >
          {loading ? (
             <span className="animate-pulse">Traitement en cours...</span> 
          ) : (
             <><Send size={18} /> Injecter le paiement</>
          )}
        </button>
      </form>

      {/* INFO BOX */}
      <div className="bg-amber-50 border border-amber-100 p-5 rounded-2xl flex gap-4">
        <ShieldAlert className="text-amber-500 shrink-0" size={24} />
        <div>
           <h4 className="text-xs font-black text-amber-800 uppercase mb-1">Attention Agent</h4>
           <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
             Cette interface simule la réception d'un SMS webhook. Le système va parser le message pour extraire le montant et la référence.
             Assurez-vous que le format est valide.
           </p>
        </div>
      </div>
    </div>
  );
}