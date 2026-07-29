import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

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

export function StatCard({
  title,
  value,
  subValue,
  trend,
  trendUp,
  icon: Icon,
  iconColor,
  iconBg,
  isAlert,
}: StatCardProps) {
  return (
    <div
      className={`
        relative overflow-hidden p-6 rounded-2xl bg-background-3 border transition-all duration-300 group cursor-default
        ${isAlert
          ? "border-tikflow-warning/30 shadow-lg shadow-tikflow-warning/5 hover:border-tikflow-warning/50"
          : "border-glass-border hover:border-tikflow-primary/25 hover:shadow-lg hover:shadow-tikflow-primary/5"
        }
      `}
    >
      {/* Subtle background glow for alert cards */}
      {isAlert && (
        <div className="absolute inset-0 bg-tikflow-warning/[0.03] pointer-events-none" />
      )}

      <div className="flex items-start justify-between gap-4">
        {/* Text content */}
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <p className="text-[10px] font-black text-tikflow-slate uppercase tracking-[0.18em]">
            {title}
          </p>

          <h3 className="text-3xl font-black text-foreground tracking-tighter leading-none mt-1 group-hover:text-tikflow-primary transition-colors duration-300">
            {value}
          </h3>

          {/* Trend & subvalue row */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {trend && (
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black ${
                  trendUp
                    ? "bg-tikflow-accent/10 text-tikflow-accent"
                    : "bg-tikflow-warning/10 text-tikflow-warning"
                }`}
              >
                {trendUp ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                {trend}
              </span>
            )}
            {subValue && (
              <span className="text-[10px] text-tikflow-slate font-medium truncate">
                {subValue}
              </span>
            )}
          </div>
        </div>

        {/* Icon */}
        <div
          className={`
            p-3.5 rounded-xl ${iconBg} ${iconColor} shrink-0
            transition-all duration-300 group-hover:scale-110 group-hover:rotate-6
          `}
        >
          <Icon size={20} />
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className={`
          absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500
          ${isAlert ? "bg-tikflow-warning/50" : "bg-tikflow-primary/40"}
        `}
      />
    </div>
  );
}