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
    <div className={`p-6 rounded-[2rem] bg-card-bg border ${isAlert ? 'border-tikflow-accent/30' : 'border-glass-border'} shadow-sm flex flex-col justify-between relative overflow-hidden`}>
      <div className="flex justify-between items-start relative z-10">
        <div className="space-y-1">
          <p className="text-tikflow-slate text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-black text-foreground">{value}</h3>
          <div className="flex items-center gap-2 mt-1">
            {subValue && <span className="text-xs text-tikflow-slate font-bold">{subValue}</span>}
            {trend && (
              <span className={`text-[10px] font-black ${trendUp ? 'text-tikflow-accent' : 'text-orange-500'}`}>
                {trendUp ? '↑' : '↓'} {trend}
              </span>
            )}
          </div>
        </div>
        <div className={`p-3 rounded-2xl ${iconBg} ${iconColor} dark:bg-foreground/5`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}