// src/app/(admin)/admin/components/StatCard.tsx
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subValue?: string;
  trend?: string;
  trendUp?: boolean;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  isAlert?: boolean;
}

export function StatCard({ title, value, subValue, trend, trendUp, icon: Icon, iconColor, iconBg, isAlert }: StatCardProps) {
  return (
    <div className={`p-6 rounded-[2rem] bg-white border ${isAlert ? 'border-orange-200' : 'border-slate-50'} shadow-sm flex flex-col justify-between relative overflow-hidden`}>
      <div className="flex justify-between items-start relative z-10">
        <div className="space-y-1">
          <p className="text-slate-500 text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-black text-slate-900">{value}</h3>
          <div className="flex items-center gap-2 mt-1">
            {subValue && <span className="text-xs text-slate-400 font-bold">{subValue}</span>}
            {trend && (
              <span className={`text-[10px] font-black ${trendUp ? 'text-green-500' : 'text-orange-500'}`}>
                {trendUp ? '↑' : '↓'} {trend}
              </span>
            )}
          </div>
        </div>
        <div className={`p-3 rounded-2xl ${iconBg} ${iconColor}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}