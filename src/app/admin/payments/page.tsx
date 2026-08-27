"use client";

import { useEffect, useState, useMemo } from "react"; // Ajout de useMemo pour la performance
import { adminApi } from "@/lib/api";
import { useAuth } from "@clerk/nextjs";
import { History, CheckCircle2, AlertCircle, Search, RefreshCcw, Filter } from "lucide-react";
import { toast } from "react-hot-toast";

export default function PaymentsLog() {
  const { getToken } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // State pour la recherche

// 2. Modifie la fonction fetchPayments pour sécuriser la donnée
const fetchPayments = async () => {
  try {
    setLoading(true);
    const token = await getToken();
    const data = await adminApi.getReceivedPayments(token!);
    
    // SÉCURITÉ : On vérifie si 'data' est bien un tableau
    if (Array.isArray(data)) {
      setPayments(data);
    } else {
      console.error("L'API n'a pas renvoyé un tableau:", data);
      setPayments([]); // On remet à vide pour éviter le crash du .filter
    }
  } catch (error: any) {
    toast.error(error.message);
    setPayments([]); // Sécurité en cas d'erreur
  } finally {
    setLoading(false);
  }
};

// 3. Sécurise le useMemo (La ceinture et les bretelles)
const filteredPayments = useMemo(() => {
  // On vérifie que payments est un tableau avant de filtrer
  if (!Array.isArray(payments)) return [];
  
  return payments.filter((pay) => 
    pay.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pay.phone?.includes(searchTerm) ||
    pay.nomclient?.toLowerCase().includes(searchTerm.toLowerCase())
  );
}, [searchTerm, payments]);

  useEffect(() => { fetchPayments(); }, []);
  return (
    <div className="p-6 space-y-6">
      {/* Header & Barre de Recherche */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase flex items-center gap-2 text-foreground">
            <History className="text-tikflow-primary" /> Journal des Paiements (MoneyFusion)
          </h1>
          <p className="text-tikflow-slate text-sm font-medium">Suivi des sessions de paiement en ligne</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-tikflow-slate group-focus-within:text-tikflow-primary transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Rechercher un Ref ID ou numéro..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 bg-card-bg border border-glass-border rounded-2xl text-sm font-bold w-full md:w-[350px] shadow-sm focus:ring-4 ring-tikflow-primary/10 focus:border-tikflow-primary transition-all outline-none text-foreground placeholder-tikflow-slate"
            />
          </div>
          <button 
            onClick={fetchPayments}
            className="p-3 bg-card-bg border border-glass-border rounded-2xl hover:bg-foreground/5 transition-all shadow-sm active:scale-95 text-tikflow-slate"
          >
            <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Tableau des résultats */}
      <div className="bg-card-bg rounded-[2rem] border border-glass-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-foreground/5 border-b border-glass-border">
                <th className="p-5 text-[10px] font-black uppercase text-tikflow-slate tracking-wider">Date & Heure</th>
                <th className="p-5 text-[10px] font-black uppercase text-tikflow-slate tracking-wider">Commande ID</th>
                <th className="p-5 text-[10px] font-black uppercase text-tikflow-slate tracking-wider">Client & Tel</th>
                <th className="p-5 text-[10px] font-black uppercase text-tikflow-slate tracking-wider">Montant & Type</th>
                <th className="p-5 text-[10px] font-black uppercase text-tikflow-slate tracking-wider text-center">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border text-sm">
              {filteredPayments.map((pay) => (
                <tr key={pay.id} className="hover:bg-foreground/5 transition-colors">
                  <td className="p-5 font-bold text-tikflow-slate">
                    {new Date(pay.createdAt?._seconds * 1000 || pay.createdAt).toLocaleString('fr-FR')}
                  </td>
                  <td className="p-5">
                    <span className="bg-tikflow-primary/10 text-tikflow-primary px-3 py-1 rounded-lg font-mono font-black border border-tikflow-primary/20">
                      {pay.orderId}
                    </span>
                  </td>
                  <td className="p-5 text-tikflow-slate">
                    <div className="font-black text-foreground">{pay.nomclient}</div>
                    <div className="font-semibold italic text-xs">{pay.phone}</div>
                  </td>
                  <td className="p-5">
                    <div className="font-black text-foreground">{pay.amount?.toLocaleString()} XOF</div>
                    <div className="text-[10px] uppercase font-bold text-tikflow-slate mt-1">{pay.type}</div>
                  </td>
                  <td className="p-5">
                    <div className="flex justify-center">
                      {pay.status === 'PAID' ? (
                        <span className="flex items-center gap-1.5 text-[9px] font-black uppercase text-green-500 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full">
                          <CheckCircle2 size={12} /> Payé
                        </span>
                      ) : pay.status === 'PENDING' ? (
                        <span className="flex items-center gap-1.5 text-[9px] font-black uppercase text-orange-500 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-full animate-pulse">
                          <AlertCircle size={12} /> En attente
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-[9px] font-black uppercase text-red-500 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-full">
                          <AlertCircle size={12} /> {pay.status === 'FAILED' ? 'Échoué' : 'Annulé'}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredPayments.length === 0 && (
          <div className="p-20 text-center space-y-4">
             <div className="bg-foreground/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-tikflow-slate border border-glass-border">
               <Filter size={32} />
             </div>
             <div>
               <p className="text-foreground font-black uppercase text-sm">Aucun résultat trouvé</p>
               <p className="text-tikflow-slate text-xs font-medium">Essayez de modifier votre recherche pour "{searchTerm}"</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}