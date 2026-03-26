"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  ArrowLeftRight, 
  Wallet, 
  Settings, 
  LogOut,
  Coins,
  MessageSquarePlus,
  Star,
  TrendingUp
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Analytics", href: "/admin/analytics", icon: TrendingUp },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Transactions", href: "/admin/transactions", icon: ArrowLeftRight },
  { name: "Top-Ups", href: "/admin/sms-input", icon: MessageSquarePlus },
  { name: "sms-paiement", href: "/admin/payments", icon: Coins },
  { name: "Wallet Management", href: "/admin/wallets", icon: Wallet },
  { name: "Feedbacks", href: "/admin/feedbacks", icon: Star },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function Sidebar({ user }: { user: any }) {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-sidebar-bg border-r border-white/5 flex flex-col h-screen sticky top-0 shrink-0 z-40">
      
      {/* --- LOGO SECTION --- */}
      <div className="p-8 pb-10">
        <Link href="/admin/dashboard" className="flex items-center gap-3 group transition-transform hover:scale-[1.02]">
          <div className="size-11 bg-gradient-to-br from-tikflow-secondary to-[#ea580c] rounded-2xl flex items-center justify-center shadow-lg shadow-tikflow-secondary/20 animate-float">
            <Coins className="text-white drop-shadow-md" size={26} />
          </div>
          <div>
            <h1 className="text-xl font-black text-sidebar-foreground leading-tight tracking-tight">
              TikFlow<span className="text-tikflow-secondary">.</span>
            </h1>
            <p className="text-[10px] font-black text-tikflow-slate uppercase tracking-[0.2em] opacity-80">
              Admin Console
            </p>
          </div>
        </Link>
      </div>

      {/* --- NAVIGATION LINKS --- */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-[13px] font-bold transition-all duration-300 group relative ${
                isActive 
                  ? "bg-tikflow-primary/10 text-tikflow-primary" 
                  : "text-tikflow-slate hover:text-sidebar-foreground hover:bg-white/5"
              }`}
            >
              {/* Active Indicator */}
              {isActive && (
                <div className="absolute left-0 w-1 h-6 bg-tikflow-primary rounded-r-full shadow-[0_0_12px_rgba(37,99,235,0.8)]" />
              )}

              <item.icon 
                size={18} 
                className={`transition-all duration-300 ${
                  isActive ? "text-tikflow-primary scale-110" : "text-tikflow-slate group-hover:text-sidebar-foreground"
                }`} 
              />
              <span className="tracking-tight">{item.name}</span>
              
              {!isActive && (
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="size-1.5 bg-tikflow-secondary rounded-full shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* --- ADMIN PROFILE FOOTER --- */}
      <div className="p-4 mt-auto">
        <div className="bg-white/5 p-3.5 rounded-[1.5rem] flex items-center gap-3 border border-white/5 hover:border-white/10 transition-all cursor-pointer group">
          <div className="size-10 rounded-xl bg-gradient-to-tr from-tikflow-secondary to-orange-400 p-[2px] shadow-lg shrink-0">
            <div className="w-full h-full rounded-[10px] bg-sidebar-bg flex items-center justify-center text-tikflow-secondary font-black text-sm">
              {user?.fullname?.charAt(0) || "A"}
            </div>
          </div>
          <div className="flex flex-col flex-1 min-w-0" title={user?.email}>
            <span className="text-xs font-black text-sidebar-foreground truncate leading-none mb-1">
              {user?.fullname || "Administrateur"}
            </span>
            <span className="text-[9px] text-tikflow-slate font-black uppercase tracking-widest opacity-60">
              Super Admin
            </span>
          </div>
          <button className="p-2 text-tikflow-slate hover:text-tikflow-danger transition-colors shrink-0 hover:scale-110 active:scale-95">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}