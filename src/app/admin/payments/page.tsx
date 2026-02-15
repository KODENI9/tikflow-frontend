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
    pay.ref_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pay.sender_phone?.includes(searchTerm)
  );
}, [searchTerm, payments]);

  useEffect(() => { fetchPayments(); }, []);
  return (
    <div className="p-6 space-y-6">
      {/* Header & Barre de Recherche */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase flex items-center gap-2">
            <History className="text-blue-600" /> Journal des Flux SMS
          </h1>
          <p className="text-slate-500 text-sm font-medium">Réconciliation des paiements en temps réel</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Rechercher un Ref ID ou numéro..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold w-full md:w-[350px] shadow-sm focus:ring-4 ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
            />
          </div>
          <button 
            onClick={fetchPayments}
            className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Tableau des résultats */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-wider">Date & Heure</th>
                <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-wider">Référence ID</th>
                <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-wider">Montant</th>
                <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-wider">Source</th>
                <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-wider text-center">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {filteredPayments.map((pay) => (
                <tr key={pay.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-5 font-bold text-slate-600">
                    {new Date(pay.received_at?._seconds * 1000 || pay.received_at).toLocaleString('fr-FR')}
                  </td>
                  <td className="p-5">
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-mono font-black border border-blue-100">
                      {pay.ref_id}
                    </span>
                  </td>
                  <td className="p-5 font-black text-slate-900">
                    {pay.amount?.toLocaleString()} XOF
                  </td>
                  <td className="p-5 text-slate-500 font-semibold italic">
                    {pay.sender_phone}
                  </td>
                  <td className="p-5">
                    <div className="flex justify-center">
                      {pay.status === 'used' ? (
                        <span className="flex items-center gap-1.5 text-[9px] font-black uppercase text-emerald-600 bg-emerald-100/50 border border-emerald-200 px-3 py-1.5 rounded-full">
                          <CheckCircle2 size={12} /> Utilisé
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-[9px] font-black uppercase text-amber-600 bg-amber-100/50 border border-amber-200 px-3 py-1.5 rounded-full animate-pulse">
                          <AlertCircle size={12} /> Orphelin
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
             <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-slate-400">
               <Filter size={32} />
             </div>
             <div>
               <p className="text-slate-900 font-black uppercase text-sm">Aucun résultat trouvé</p>
               <p className="text-slate-400 text-xs font-medium">Essayez de modifier votre recherche pour "{searchTerm}"</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}