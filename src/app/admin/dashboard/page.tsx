"use client";

import { useEffect, useState } from "react";
import { 
  TrendingUp, Wallet, Clock, Search, Bell, 
  MessageSquare, Download, RefreshCcw
} from "lucide-react";
import { StatCard } from "../_components/StatCard";
import { TransactionTable } from "../_components/TransactionTable";
import { adminApi } from "@/lib/api";
import { useAuth } from "@clerk/nextjs";

export default function AdminDashboard() {
const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0); 
  
  const { getToken, isLoaded, userId } = useAuth(); // isLoaded permet de savoir quand Clerk est prêt

  useEffect(() => {
    const fetchData = async () => {
      // 1. Attendre que Clerk soit chargé
      if (!isLoaded || !userId) return;

      setLoading(true);
      try {
        // 2. Récupérer le token RÉEL (on l'attend avec await)
        const token = await getToken();
        if (!token) {
          console.error("Impossible de générer le token");
          return;
        }

        // 3. Appel API avec le token frais
        const response = await adminApi.getStats(token);
        
        // On vérifie si ton backend renvoie .data ou l'objet directement
        setStats(response);
        
      } catch (error) {
        console.error("Erreur stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshKey, isLoaded, userId]); // On ajoute les dépendances d'auth

  const handleRefresh = () => setRefreshKey(prev => prev + 1);

  // Écran de chargement initial si Clerk n'est pas prêt
  if (!isLoaded) return <div className="p-20 text-center font-black">CHARGEMENT DE LA SESSION...</div>;
  
  return (
    <div className="space-y-8">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
          <span className="px-3 py-1 bg-green-100 text-green-600 text-[10px] font-black rounded-lg uppercase border border-green-200">
            System Healthy
          </span>
          <button 
            onClick={handleRefresh}
            className={`p-2 text-slate-400 hover:text-blue-600 transition-all ${loading ? 'animate-spin' : ''}`}
          >
            <RefreshCcw size={18} />
          </button>
        </div>
        
        {/* Recherche & Notifs */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input 
              className="w-full pl-12 pr-4 py-3 bg-slate-100/50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-600/20 outline-none transition-all font-medium" 
              placeholder="Search Ref ID or User..." 
            />
          </div>
          <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 shadow-sm relative">
            <Bell size={20} />
            <span className="absolute top-3 right-3 size-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>

      {/* --- STATS GRID (Données réelles du backend) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Transactions Today" 
          value={stats?.todayCount?.toLocaleString() || "0"} 
          subValue={`Value: ${stats?.todayVolume?.toLocaleString() || 0} XOF`} 
          trend={`${stats?.trendCount || 0}% from yesterday`} 
          trendUp={stats?.trendCount >= 0} 
          icon={TrendingUp} 
          iconBg="bg-green-50" 
          iconColor="text-green-600"
        />
        <StatCard 
          title="Wallets Credited" 
          value={stats?.creditedCount?.toLocaleString() || "0"} 
          subValue={`Success Rate: ${stats?.successRate || 0}%`} 
          trend={`${stats?.trendSuccess || 0}% from yesterday`} 
          trendUp={stats?.trendSuccess >= 0} 
          icon={Wallet} 
          iconBg="bg-blue-50" 
          iconColor="text-blue-600"
        />
        <StatCard 
          title="Pending Orders" 
          value={stats?.pendingCount?.toLocaleString() || "0"} 
          subValue="Action Required" 
          trend="Requires Validation" 
          trendUp={false} 
          icon={Clock} 
          iconBg="bg-orange-50" 
          iconColor="text-orange-600" 
          isAlert={stats?.pendingCount > 0}
        />
      </div>

      {/* --- FILTERS --- */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select className="bg-white border border-slate-100 rounded-xl text-xs font-bold px-4 py-2.5 outline-none shadow-sm">
            <option>Status: All</option>
            <option>Success</option>
            <option>Pending</option>
          </select>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-[#1152d4] text-white rounded-xl text-xs font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* --- TABLE (Chargement des transactions réelles) --- */}
      <div className="bg-white rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
        {/* On passe handleRefresh pour pouvoir recharger la liste après une validation */}
        <TransactionTable onActionSuccess={handleRefresh} />
        
        <div className="mt-auto border-t border-slate-50 p-6 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-400">
              {loading ? "Chargement..." : `Total Pending: ${stats?.pendingCount || 0}`}
            </p>
            <div className="flex gap-2">
                <button className="px-5 py-2 rounded-xl text-xs font-bold text-slate-400 border border-slate-100 hover:bg-slate-50 transition-colors">Previous</button>
                <button className="px-5 py-2 rounded-xl text-xs font-bold text-slate-900 border border-slate-100 hover:bg-slate-50 transition-colors">Next</button>
            </div>
        </div>
      </div>
    </div>
  );
}