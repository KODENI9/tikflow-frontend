"use client";

import { PlusCircle, Send, Diamond, Gift } from "lucide-react";
import { PhoneAlert } from "@/components/dashboard/PhoneAlert"; 
import { useUser } from "@clerk/nextjs";
import { fetchUserwalletBalance } from "@/lib/actions/user.actions";
import { useEffect, useState, useCallback, useRef } from "react"; // Ajout de useRef
import Link from "next/link";

export default function DashboardPage() {
  const { isLoaded, user } = useUser();
  const [balance, setBalance] = useState<number | string>("...");
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  
  // Ref pour éviter le double appel en mode Strict (dev)
  const hasFetched = useRef(false);

  const fetchwalletData = useCallback(async () => {
    try {
      // Pas besoin de remettre loading true si c'est déjà en cours (évite le clignotement)
      const data = await fetchUserwalletBalance();
      
      // Vérification robuste
      if (data && typeof data.balance === 'number') {
        setBalance(data.balance);
      } else {
        console.error("Format de réponse invalide:", data);
        setBalance(0); 
      }
    } catch (error) {
      console.error("Erreur Fetch:", error);
      setBalance("Err.");
    } finally {
      setIsLoadingBalance(false);
    }
  }, []);

  useEffect(() => {
    // On lance le fetch uniquement si :
    // 1. Clerk a fini de charger (isLoaded)
    // 2. On a un utilisateur (user)
    // 3. On n'a pas déjà fetché (hasFetched)
    if (isLoaded && user && !hasFetched.current) {
      hasFetched.current = true;
      fetchwalletData();
    }
  }, [isLoaded, user?.id, fetchwalletData]); // 👈 ASTUCE : On dépend de l'ID, pas de l'objet user entier

  // Skeleton Loader pendant le chargement de Clerk
  if (!isLoaded) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-5 pb-10 animate-pulse">
         <div className="h-64 bg-slate-100 rounded-3xl w-full mb-6"></div>
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 h-48 bg-slate-100 rounded-3xl"></div>
            <div className="lg:col-span-4 h-48 bg-slate-100 rounded-3xl"></div>
         </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-5 pb-10">
      <PhoneAlert />

      {/* Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 md:p-10 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 space-y-3">
          <p className="opacity-70 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">Tableau de Bord</p>
          <h1 className="text-2xl md:text-4xl font-black">
            Bonjour, <span className="text-[#1152d4]">{user?.firstName || "Utilisateur"}</span> 👋
          </h1>
          <p className="text-slate-400 max-w-md text-sm leading-relaxed">
            Gérez vos transactions TikTok coins et suivez vos dépenses en temps réel.
          </p>
        </div>
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#1152d4] rounded-full blur-[100px] opacity-20"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* COLONNE GAUCHE - Portefeuille */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl p-5 md:p-8 shadow-sm border border-gray-100 flex flex-col xl:flex-row gap-8 items-center">
            
            {/* Wallet Card */}
            <div className="w-full xl:w-80 h-48 rounded-2xl bg-gradient-to-br from-[#1152d4] to-[#0d3a94] p-6 text-white flex flex-col justify-between shadow-lg shadow-blue-500/20 shrink-0 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono opacity-80 uppercase tracking-tighter">TikFlow Wallet</span>
                <Diamond size={20} className="opacity-50" />
              </div>
              <div>
                <p className="text-[10px] opacity-70 mb-1 font-bold">Solde Total</p>
                {/* Gestion fine de l'affichage du solde */}
                <p className={`text-3xl font-black tracking-tight ${isLoadingBalance ? 'animate-pulse opacity-80' : ''}`}>
                  {typeof balance === 'number' ? balance.toLocaleString('fr-FR') : balance} <span className="text-lg">FCFA</span>
                </p>
              </div>
              <div className="flex justify-between items-end">
                <p className="text-[10px] font-mono tracking-widest opacity-60">•••• 4821</p>
                <div className="h-6 w-9 bg-white/10 rounded-md backdrop-blur-sm border border-white/5"></div>
              </div>
            </div>

            {/* Actions */}
            <div className="w-full flex-1 space-y-5">
              <div className="text-center xl:text-left">
                <h3 className="font-black text-gray-900 text-lg">Portefeuille Principal</h3>
                <p className="text-gray-500 text-sm mt-1">Votre solde est prêt à l'emploi pour vos achats.</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link 
                  href="/dashboard/wallet/deposit" 
                  className="flex items-center justify-center gap-2 bg-[#1152d4] text-white py-4 rounded-2xl text-sm font-black shadow-lg shadow-blue-500/10 hover:bg-blue-700 transition-all active:scale-95"
                >
                  <PlusCircle size={18} /> Recharger
                </Link>
                <button className="flex items-center justify-center gap-2 bg-gray-50 text-gray-700 py-4 rounded-2xl text-sm font-bold border border-gray-100 hover:bg-gray-100 transition-all active:scale-95">
                  <Send size={18} /> Transférer
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* PROMO SIDEBAR */}
        <div className="lg:col-span-4">
           <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white text-center relative overflow-hidden shadow-xl shadow-indigo-500/20 group">
              <div className="relative z-10 flex flex-col items-center">
                 <div className="p-4 bg-white/10 rounded-2xl mb-4 backdrop-blur-xl border border-white/20">
                    <Gift size={28} className="text-white"/>
                 </div>
                 <h4 className="font-black text-lg text-white">Promo Spéciale</h4>
                 <p className="text-indigo-100/80 text-xs mt-2 mb-6 leading-relaxed">
                   Gagnez <span className="font-bold text-white">+10% de coins</span> sur votre prochaine recharge !
                 </p>
                 <button className="w-full bg-white text-indigo-700 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider hover:shadow-2xl transition-all active:scale-95">
                   Voir l'offre
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}