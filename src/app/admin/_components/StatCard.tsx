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
    <div className={`p-6 rounded-[1.5rem] bg-card-bg border ${isAlert ? 'border-tikflow-secondary/40 shadow-lg shadow-tikflow-secondary/5' : 'border-glass-border'} hover:border-tikflow-primary/30 transition-all duration-300 group`}>
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-tikflow-slate text-[10px] font-black uppercase tracking-[0.15em] opacity-60 px-0.5">{title}</p>
          <div className="flex items-baseline gap-1">
            <h3 className="text-3xl font-black text-foreground tracking-tight group-hover:scale-[1.02] transition-transform origin-left">{value}</h3>
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            {trend && (
              <div className={`px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1 ${
                trendUp 
                  ? 'bg-tikflow-accent/10 text-tikflow-accent' 
                  : 'bg-tikflow-secondary/10 text-tikflow-secondary'
              }`}>
                {trendUp ? '↑' : '↓'} {trend}
              </div>
            )}
            {subValue && <span className="text-[10px] text-tikflow-slate font-bold opacity-60 tracking-tight">{subValue}</span>}
          </div>
        </div>
        
        <div className={`p-3.5 rounded-2xl ${iconBg} ${iconColor} shadow-inner transition-all duration-500 group-hover:rotate-[15deg] group-hover:scale-110`}>
          <Icon size={22} className="drop-shadow-sm" />
        </div>
      </div>
    </div>
  );
}