"use client"; // Obligatoire car on utilise du state (useState)

import { useState, useEffect } from "react";
import { 
  Wallet, 
  Copy, 
  CheckCircle2, 
  Info, 
  ReceiptText, 
  Smartphone, 
  Send,
  Clock,
  Check,
  ShieldCheck,
  Loader2
} from "lucide-react";
import { createDepositAction } from "@/lib/actions/user.actions";
import { recipientsApi } from "@/lib/api";
import { Recipient } from "@/types/api";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner"; // Optionnel pour les notifications

export default function DepositPage() {
  const { getToken, isLoaded } = useAuth();
  const [selectedProvider, setSelectedProvider] = useState("flooz");

  const [referenceId, setReferenceId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeRecipients, setActiveRecipients] = useState<Recipient[]>([]);
  const [fetchingRecipients, setFetchingRecipients] = useState(true);
  const [supportPhone, setSupportPhone] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await recipientsApi.getGlobalSettings();
        if (settings?.support_phone) {
          setSupportPhone(settings.support_phone);
        }
      } catch (error) {
        console.error("Error fetching settings in DepositPage:", error);
      }
    };

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

    fetchSettings();
    if (isLoaded) fetchRecipients();
  }, [isLoaded, getToken]);

  const activeRecipient = activeRecipients.find(r => r.operator === selectedProvider);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!referenceId || !amount) {
      return alert("Veuillez remplir tous les champs");
    }

    setLoading(true);

    const result = await createDepositAction(
      selectedProvider,
      referenceId,
      Number(amount),
   );
    if (result.success) {
      alert("Paiement déclaré ! Votre solde sera mis à jour après vérification.");
      setReferenceId("");
      setAmount("");
    } else {
      alert("Erreur: " + result.error);
    }

    setLoading(false);
  };

  const copyToClipboard = async () => {
    const textToCopy = activeRecipient?.phone || "";
    if (!textToCopy) return;

    // Vérification si l'API clipboard est disponible
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(textToCopy);
        alert("✅ Numéro copié !");
      } catch (err) {
        console.error("Erreur lors de la copie : ", err);
      }
    } else {
      // Méthode de secours (Fallback) pour les environnements non-sécurisés
      const textArea = document.createElement("textarea");
      textArea.value = textToCopy;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        alert("✅ Numéro copié !");
      } catch (err) {
        console.error("Impossible de copier", err);
      }
      document.body.removeChild(textArea);
    }
  };

  // ... (Garder le reste du JSX des providers intact)
  
  const providers = [
    { id: "flooz", name: "Flooz", color: "bg-green-500", letter: "F" },
    { id: "tmoney", name: "TMoney", color: "bg-yellow-400", letter: "T" },
    { id: "wave", name: "Wave", color: "bg-blue-400", letter: "W" },
    { id: "moov", name: "Moov", color: "bg-blue-600", letter: "M" },
    { id: "orange", name: "Orange", color: "bg-orange-500", letter: "OM" },
    { id: "mtn", name: "MTN", color: "bg-yellow-300", letter: "M" },
    { id: "yas", name: "Yas", color: "bg-red-500", letter: "Y" },
    { id: "skthib", name: "SkThib", color: "bg-slate-700", letter: "S" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Recharger votre portefeuille</h1>
        <p className="mt-2 text-slate-500 text-lg">Achetez des pièces TikTok via Mobile Money en toute sécurité.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLONNE GAUCHE: Sélection & Instructions */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Étape 1: Opérateur */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="flex items-center gap-3 text-lg font-bold text-slate-900 mb-6">
              <span className="flex items-center justify-center size-7 rounded-full bg-[#1152d4] text-white text-xs font-black">1</span>
              Choisissez votre opérateur
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {providers.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProvider(p.id)}
                  className={`relative flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${
                    selectedProvider === p.id 
                    ? "border-[#1152d4] bg-blue-50/50" 
                    : "border-slate-50 bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  <div className={`size-12 mb-3 rounded-full ${p.color} flex items-center justify-center text-white font-black shadow-sm`}>
                    {p.letter}
                  </div>
                  <span className="text-sm font-bold text-slate-700">{p.name}</span>
                  {selectedProvider === p.id && (
                    <CheckCircle2 size={18} className="absolute top-2 right-2 text-[#1152d4]" />
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Étape 2: Instructions de paiement */}
          <section className="bg-blue-600 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl shadow-blue-100">
            <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            
            <h3 className="flex items-center gap-3 text-lg font-bold mb-6 relative z-10">
              <span className="flex items-center justify-center size-7 rounded-full bg-white text-blue-600 text-xs font-black">2</span>
              Instructions de paiement
            </h3>

            <div className="bg-white rounded-2xl p-5 text-slate-900 shadow-lg relative z-10">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                {fetchingRecipients ? (
                  <div className="flex items-center gap-4 py-4">
                    <Loader2 className="animate-spin text-blue-600" size={24} />
                    <p className="text-sm font-bold text-slate-400">Chargement des détails de paiement...</p>
                  </div>
                ) : activeRecipient ? (
                  <>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Envoyez le montant à ce numéro ({activeRecipient.operator.toUpperCase()})</p>
                      <div className="flex items-center gap-3">
                        <p className="text-2xl font-black tracking-tight">{activeRecipient.phone}</p>
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold">
                          <ShieldCheck size={12} /> VÉRIFIÉ
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">Bénéficiaire: <span className="font-bold text-slate-700">{activeRecipient.beneficiary_name}</span></p>
                    </div>
                    <button 
                      onClick={copyToClipboard}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-sm font-bold text-slate-700 group"
                    >
                      <Copy size={16} className="text-slate-400 group-hover:text-blue-600" /> Copier le numéro
                    </button>
                  </>
                ) : (
                  <div className="py-4">
                    <p className="text-sm font-bold text-slate-400 italic">Aucun numéro configuré pour cet opérateur pour le moment.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex items-start gap-3 text-sm text-blue-50 relative z-10 bg-blue-700/30 p-4 rounded-xl">
              <Info size={20} className="shrink-0" />
              <p>Une fois le transfert effectué, copiez le <b>numéro de référence (ID)</b> du SMS de confirmation et collez-le dans le formulaire.</p>
            </div>
          </section>
        </div>

        {/* COLONNE DROITE: Validation */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-50 p-8 sticky top-24">
            <h3 className="flex items-center gap-3 text-lg font-bold text-slate-900 mb-8">
              <span className="flex items-center justify-center size-7 rounded-full bg-[#1152d4] text-white text-xs font-black">3</span>
              Validez le paiement
            </h3>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider">ID de Référence</label>
                <div className="relative">
                  <ReceiptText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="text" 
                    value={referenceId}
                    onChange={(e) => setReferenceId(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-slate-100 bg-slate-50 focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                    placeholder="Ex: 230515102030..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Montant Envoyé (FCFA)</label>
                <div className="relative">
                  <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-slate-100 bg-slate-50 focus:ring-2 focus:ring-blue-500 transition-all font-bold text-lg"
                    placeholder="Ex: 5000"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#1152d4] hover:bg-blue-700 disabled:bg-slate-300 text-white font-black py-5 rounded-2xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                {loading ? "Traitement..." : "Déclarer le paiement"}
              </button>
            </form>
          </div>

          {/* État des transactions récentes */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h4 className="font-bold text-slate-900 mb-4">Dernières vérifications</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl border border-yellow-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg"><Clock size={16}/></div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">5,000 FCFA</p>
                    <p className="text-[10px] text-slate-400 font-mono">ID: 23948291</p>
                  </div>
                </div>
                <span className="text-[10px] font-black text-yellow-600 bg-yellow-100 px-2 py-1 rounded-md">EN ATTENTE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}