"use client";

import { useState, useEffect } from "react";
import { 
  CheckCircle2, 
  Info, 
  Smartphone, 
  Send,
  Clock,
  Check,
  ShieldCheck,
  Loader2,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Zap
} from "lucide-react";
import { createDepositAction } from "@/lib/actions/user.actions";
import { recipientsApi } from "@/lib/api";
import { Recipient } from "@/types/api";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import Link from "next/link";

export default function DepositPage() {
  const { getToken, isLoaded } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedProvider, setSelectedProvider] = useState("tmoney");
  const [amount, setAmount] = useState("");
  const [rawSms, setRawSms] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeRecipients, setActiveRecipients] = useState<Recipient[]>([]);
  const [fetchingRecipients, setFetchingRecipients] = useState(true);

  useEffect(() => {
    const fetchRecipients = async () => {
      if (!isLoaded) return;
      try {
        setFetchingRecipients(true);
        const token = await getToken();
        if (token) {
          const recips = await recipientsApi.getActiveRecipients(token);
          setActiveRecipients(recips || []);
        }
      } catch (error) {
        console.error("Error fetching recipients:", error);
      } finally {
        setFetchingRecipients(false);
      }
    };

    if (isLoaded) fetchRecipients();
  }, [isLoaded, getToken]);

  const activeRecipient = activeRecipients.find(r => r.operator === selectedProvider);

  const generateUssdCode = () => {
    if (!activeRecipient || !amount) return "";
    let template = activeRecipient.ussd_template || "*145*1*{{number}}*{{amount}}*2#";
    return template
      .replace("{{number}}", activeRecipient.phone)
      .replace("{{amount}}", amount);
  };

  const ussdCode = generateUssdCode();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rawSms) {
      return toast.error("Veuillez coller le SMS de confirmation reçu.");
    }

    setLoading(true);

    const result = await createDepositAction(
      selectedProvider,
      "", // ref_id optionnel maintenant, sera extrait du SMS au backend
      Number(amount),
      rawSms
    );

    if (result.success) {
      toast.success("Demande envoyée ! Votre solde sera mis à jour.");
      setStep(5); // Success step
    } else {
      toast.error("Erreur: " + result.error);
    }

    setLoading(false);
  };

  const providers = [
    { id: "tmoney", name: "TMoney", color: "bg-yellow-400", letter: "T" },
    { id: "flooz", name: "Flooz", color: "bg-green-500", letter: "F" },
    { id: "moov", name: "Moov", color: "bg-blue-600", letter: "M" },
    { id: "wave", name: "Wave", color: "bg-blue-400", letter: "W" },
    { id: "orange", name: "Orange", color: "bg-orange-500", letter: "OM" },
  ];

  if (step === 5) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-6">
        <div className="size-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="text-4xl font-black text-slate-900">Demande Envoyée !</h1>
        <p className="text-slate-500 text-lg">
          Le système analyse votre SMS. Si tout est correct, votre compte sera crédité dans quelques instants. 
          Vous recevrez une notification.
        </p>
        <div className="pt-8">
          <Link href="/dashboard/wallet" className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-slate-800 transition-all inline-flex items-center gap-2">
            Retour au portefeuille <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      {/* ProgressBar */}
      <div className="flex justify-between items-center mb-10 px-4 relative">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex flex-col items-center gap-2 z-10">
            <div className={`size-10 rounded-full flex items-center justify-center font-black transition-all ${
              step >= s ? "bg-tikflow-primary text-white shadow-lg shadow-tikflow-primary/20 scale-110" : "bg-slate-100 text-slate-400"
            }`}>
              {step > s ? <Check size={18} /> : s}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${step >= s ? "text-tikflow-primary" : "text-slate-400"}`}>
              {s === 1 ? "Réseau" : s === 2 ? "Montant" : s === 3 ? "Paiement" : "SMS"}
            </span>
          </div>
        ))}
        <div className="absolute top-[20px] left-[10%] right-[10%] h-1 bg-slate-100 -z-0 rounded-full hidden md:block">
          <div className="h-full bg-tikflow-primary transition-all duration-500" style={{ width: `${(step - 1) * 33.33}%` }}></div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-100/50 border border-slate-50 overflow-hidden">
        <div className="p-8 md:p-12">
          
          {/* STEP 1: OPERATOR */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-slate-900">Quel est votre réseau ?</h2>
                <p className="text-slate-500">Choisissez l'opérateur avec lequel vous allez payer.</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {providers.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProvider(p.id)}
                    className={`relative flex flex-col items-center p-6 rounded-3xl border-2 transition-all ${
                      selectedProvider === p.id 
                      ? "border-tikflow-primary bg-blue-50/50 scale-105" 
                      : "border-slate-50 bg-slate-50 hover:bg-slate-100"
                    }`}
                  >
                    <div className={`size-14 mb-4 rounded-full ${p.color} flex items-center justify-center text-white font-black shadow-lg text-lg`}>
                      {p.letter}
                    </div>
                    <span className="text-sm font-black text-slate-700">{p.name}</span>
                    {selectedProvider === p.id && (
                      <div className="absolute top-3 right-3 bg-tikflow-primary text-white rounded-full p-1">
                        <Check size={12} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setStep(2)}
                className="w-full bg-tikflow-primary text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-tikflow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                Continuer <ChevronRight />
              </button>
            </div>
          )}

          {/* STEP 2: AMOUNT */}
          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-slate-900">Combien voulez-vous recharger ?</h2>
                <p className="text-slate-500">Le montant sera ajouté à votre solde TikFlow.</p>
              </div>
              <div className="max-w-md mx-auto relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-tikflow-primary transition-colors font-black text-xl">
                  FCFA
                </div>
                <input 
                  type="number"
                  autoFocus
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Ex: 5000"
                  className="w-full bg-slate-50 border-2 border-slate-50 focus:border-tikflow-primary focus:bg-white rounded-3xl p-8 pl-24 text-4xl font-black outline-none transition-all placeholder:text-slate-200 text-slate-900"
                />
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(1)}
                  className="flex-1 bg-slate-100 text-slate-600 py-5 rounded-2xl font-black hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                >
                  <ChevronLeft /> Retour
                </button>
                <button 
                  disabled={!amount || Number(amount) <= 0}
                  onClick={() => setStep(3)}
                  className="flex-[2] bg-tikflow-primary text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-tikflow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  Suivant <ChevronRight />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT */}
          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-slate-900">Envoyez l'argent</h2>
                <p className="text-slate-500">Cliquez sur le bouton pour lancer l'appel USSD direct.</p>
              </div>
              
              {!activeRecipient ? (
                <div className="p-8 bg-orange-50 border border-orange-100 rounded-3xl text-center">
                  <Info className="mx-auto text-orange-400 mb-4" size={32} />
                  <p className="font-bold text-orange-700">Désolé, ce réseau n'est pas encore configuré.</p>
                  <button onClick={() => setStep(1)} className="mt-4 text-orange-600 underline font-black">Changer de réseau</button>
                </div>
              ) : (
                <>
                  <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden group">
                    <div className="absolute right-0 top-0 w-32 h-full bg-tikflow-primary/20 blur-3xl group-hover:bg-tikflow-primary/40 transition-all"></div>
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                      <div className="space-y-4 text-center md:text-left">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Code USSD à composer</p>
                        <h3 className="text-3xl font-black tracking-tight font-mono">{ussdCode}</h3>
                        <div className="flex items-center gap-2 justify-center md:justify-start">
                          <span className="size-2 rounded-full bg-green-400 animate-pulse"></span>
                          <span className="text-xs font-bold text-slate-400">Bénéficiaire: {activeRecipient.beneficiary_name}</span>
                        </div>
                      </div>
                      <a 
                        href={`tel:${ussdCode.replace("#", "%23")}`}
                        className="bg-tikflow-primary text-white p-6 rounded-2xl font-black hover:scale-110 active:scale-95 transition-all shadow-xl shadow-tikflow-primary/30 flex items-center gap-3"
                      >
                         <Smartphone size={24} /> PAYER MAINTENANT
                      </a>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl flex items-start gap-4">
                    <Zap className="text-blue-600 shrink-0" size={24} />
                    <p className="text-sm text-blue-900 leading-relaxed">
                      <b>Auto-Approbation :</b> Si vous utilisez ce bouton, le système détectera automatiquement votre paiement dès que vous aurez collé le SMS à l'étape suivante.
                    </p>
                  </div>
                </>
              )}

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(2)}
                  className="flex-1 bg-slate-100 text-slate-600 py-5 rounded-2xl font-black hover:bg-slate-200 transition-all"
                >
                   <ChevronLeft /> Retour
                </button>
                <button 
                  onClick={() => setStep(4)}
                  className="flex-[2] bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
                >
                  J'ai envoyé l'argent <ChevronRight />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SMS PASTE */}
          {step === 4 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-slate-900">Collez le SMS</h2>
                <p className="text-slate-500">Copiez le SMS de confirmation reçu et collez-le ici en entier.</p>
              </div>
              
              <div className="space-y-6">
                <div className="relative">
                   <textarea
                    autoFocus
                    placeholder="Collez ici le SMS reçu (ex: Vous avez envoyé 5000 CFA à TikFlow. Ref: 23091...)"
                    value={rawSms}
                    onChange={(e) => setRawSms(e.target.value)}
                    className="w-full min-h-[200px] bg-slate-50 border-2 border-slate-100 focus:border-tikflow-primary focus:bg-white rounded-[2rem] p-8 text-sm font-medium outline-none transition-all placeholder:text-slate-300 shadow-inner"
                   />
                   {rawSms && (
                     <button 
                      onClick={() => setRawSms("")}
                      className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-xs"
                     >
                       Effacer
                     </button>
                   )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                    <div className="size-10 bg-slate-200/50 rounded-full flex items-center justify-center font-black text-slate-400 text-xs">A</div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase">Montant déclaré</p>
                      <p className="text-lg font-black text-slate-900">{amount} FCFA</p>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                    <div className="size-10 bg-slate-200/50 rounded-full flex items-center justify-center font-black text-slate-400 text-xs">P</div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase">Réseau choisi</p>
                      <p className="text-lg font-black text-slate-900">{selectedProvider.toUpperCase()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(3)}
                  className="flex-1 bg-slate-100 text-slate-600 py-5 rounded-2xl font-black hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                >
                   <ChevronLeft /> Retour
                </button>
                <button 
                  disabled={loading || !rawSms}
                  onClick={handleSubmit}
                  className="flex-[2] bg-tikflow-primary text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-tikflow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                  Soumettre pour vérification
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      <div className="flex items-center justify-center gap-8 text-slate-400 py-10">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Sécurisé SSL</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Vérification Instantanée</span>
        </div>
      </div>
    </div>
  );
}