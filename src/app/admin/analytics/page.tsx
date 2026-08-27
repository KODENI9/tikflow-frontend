"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import { useAuth } from "@clerk/nextjs";
import { AdminStats } from "@/types/api";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from "recharts";
import { 
  TrendingUp, DollarSign, Wallet, CreditCard, 
  ArrowUpRight, ArrowDownRight, Activity
} from "lucide-react";
import { format } from "date-fns";

export default function AnalyticsPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { getToken, isLoaded, userId } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      // If auth is loaded but no user, we should stop loading to avoid infinite spinner
      if (isLoaded && !userId) {
        setLoading(false);
        return;
      }
      
      if (!isLoaded || !userId) return;

      try {
        const token = await getToken();
        if (!token) {
          setLoading(false);
          return;
        }
        const data = await adminApi.getStats(token);
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isLoaded, userId, getToken]);

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tikflow-primary"></div>
      </div>
    );
  }

  // Prepare Chart Data
  const monthlyStats = stats?.monthlyStats || {};
  const monthlyData = Object.entries(monthlyStats)
    .map(([key, value]) => ({
      name: key, // "YYYY-MM"
      ...value,
      profit: value.profit || (value.sales - value.cost) // Ensure profit is calc
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">Analyses Financières</h1>
        <p className="text-tikflow-slate font-medium mt-1">
          Aperçu détaillé des revenus, des coûts et de la croissance de la plateforme.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard
          title="Revenus Totaux"
          value={`${(stats?.financials?.totalSalesVolume || 0).toLocaleString('fr-FR', { maximumFractionDigits: 0 })} CFA`}
          icon={TrendingUp}
          trend="+12%" // Mock trend or calc from monthly
          color="text-green-600"
          bg="bg-green-50"
        />
        <AnalyticsCard
          title="Bénéfice Net"
          value={`${(stats?.financials?.totalProfit || 0).toLocaleString('fr-FR', { maximumFractionDigits: 0 })} CFA`}
          icon={DollarSign}
          trend="+8%"
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <AnalyticsCard
          title="Coûts Estimés"
          value={`${(stats?.financials?.totalCost || 0).toLocaleString('fr-FR', { maximumFractionDigits: 0 })} CFA`}
          icon={CreditCard}
          trend="-2%"
          color="text-orange-600"
          bg="bg-orange-50"
        />
        <AnalyticsCard
          title="Soldes Utilisateurs"
          value={`${(stats?.financials?.totalUsersBalance || 0).toLocaleString('fr-FR', { maximumFractionDigits: 0 })} CFA`}
          icon={Wallet}
          trend="Passif"
          color="text-purple-600"
          bg="bg-purple-50"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Revenue vs Cost Chart */}
        <div className="bg-card-bg p-6 rounded-[2rem] border border-glass-border shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Activity size={18} className="text-tikflow-primary" />
            Analyse des Revenus & Coûts
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1152d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1152d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} tickFormatter={(val) => Math.round(val).toString()} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                  formatter={(value: any) => Math.round(Number(value) || 0).toString()}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                <Area type="monotone" dataKey="sales" name="Revenus" stroke="#1152d4" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                <Area type="monotone" dataKey="cost" name="Coût" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorCost)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Profit Trend Chart */}
        <div className="bg-card-bg p-6 rounded-[2rem] border border-glass-border shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <TrendingUp size={18} className="text-green-600" />
            Tendance des Bénéfices
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProfitOrange" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} tickFormatter={(val) => Math.round(val).toString()} />
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                   cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                   formatter={(value: any) => Math.round(Number(value) || 0).toString()}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                <Area type="monotone" dataKey="profit" name="Bénéfice Net" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorProfitOrange)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Transaction Volume Trend */}
      <div className="bg-card-bg p-6 rounded-[2rem] border border-glass-border shadow-sm">
          <h3 className="text-lg font-bold mb-6">Volume de Transactions (Nombre)</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTransactions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} tickFormatter={(val) => Math.round(val).toString()} />
                 <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                   cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                   formatter={(value: any) => Math.round(Number(value) || 0).toString()}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                <Area type="monotone" dataKey="transactions" name="Transactions" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorTransactions)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
      </div>
    </div>
  );
}

function AnalyticsCard({ title, value, icon: Icon, trend, color, bg }: any) {
  return (
    <div className="bg-card-bg p-6 rounded-[2rem] border border-glass-border shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${bg} ${color}`}>
          <Icon size={24} />
        </div>
        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${trend === 'Passif' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
          {trend}
        </div>
      </div>
      <div>
        <p className="text-xs font-bold text-tikflow-slate uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-2xl font-black text-foreground tracking-tight">{value}</h3>
      </div>
    </div>
  );
}
