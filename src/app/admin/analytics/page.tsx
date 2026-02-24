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
        <h1 className="text-3xl font-black text-foreground tracking-tight">Financial Analytics</h1>
        <p className="text-tikflow-slate font-medium mt-1">
          Detailed breakdown of platform revenue, costs, and user growth.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard
          title="Total Revenue"
          value={`${stats?.financials?.totalSalesVolume?.toLocaleString() || 0} CFA`}
          icon={TrendingUp}
          trend="+12%" // Mock trend or calc from monthly
          color="text-green-600"
          bg="bg-green-50"
        />
        <AnalyticsCard
          title="Net Profit"
          value={`${stats?.financials?.totalProfit?.toLocaleString() || 0} CFA`}
          icon={DollarSign}
          trend="+8%"
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <AnalyticsCard
          title="Est. Costs"
          value={`${stats?.financials?.totalCost?.toLocaleString() || 0} CFA`}
          icon={CreditCard}
          trend="-2%"
          color="text-orange-600"
          bg="bg-orange-50"
        />
        <AnalyticsCard
          title="User Balances"
          value={`${stats?.financials?.totalUsersBalance?.toLocaleString() || 0} CFA`}
          icon={Wallet}
          trend="Liability"
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
            Revenue & Cost Analysis
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748B'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748B'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  cursor={{ fill: '#F1F5F9' }}
                />
                <Legend iconType="circle" />
                <Bar dataKey="sales" name="Revenue" fill="#1152d4" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="cost" name="Cost" fill="#f97316" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Profit Trend Chart */}
        <div className="bg-card-bg p-6 rounded-[2rem] border border-glass-border shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <TrendingUp size={18} className="text-green-600" />
            Profit Trend
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748B'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748B'}} />
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend iconType="circle" />
                <Area type="monotone" dataKey="profit" name="Net Profit" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Transaction Volume Trend */}
      <div className="bg-card-bg p-6 rounded-[2rem] border border-glass-border shadow-sm">
          <h3 className="text-lg font-bold mb-6">Transaction Volume (Count)</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748B'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748B'}} />
                 <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Line type="monotone" dataKey="transactions" name="Transactions" stroke="#6366f1" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
              </LineChart>
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
        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${trend === 'Liability' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
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
