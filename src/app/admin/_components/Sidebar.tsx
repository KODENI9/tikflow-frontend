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
  MessageSquarePlus
} from "lucide-react";

// Correction des URLs pour correspondre à ton arborescence (admin)/...
const menuItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Transactions", href: "/admin/transactions", icon: ArrowLeftRight },
  { name: "Top-Ups", href: "/admin/sms-input", icon: MessageSquarePlus },
  { name: "sms-paiement", href: "/admin/payments", icon: Coins },
  { name: "Wallet Management", href: "/admin/wallets", icon: Wallet },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function Sidebar({ user }: { user: any }) {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-background border-r border-glass-border flex flex-col h-screen sticky top-0 shrink-0">
      
      {/* --- LOGO SECTION --- */}
      <div className="p-8 mb-4">
        <div className="flex items-center gap-3">
          <div className="size-10 bg-tikflow-primary rounded-xl flex items-center justify-center shadow-lg shadow-tikflow-primary/20">
            <Coins className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-lg font-black text-foreground leading-tight tracking-tight">
              TikFlow Admin
            </h1>
            <p className="text-[10px] font-bold text-tikflow-slate uppercase tracking-widest">
              Fintech Platform
            </p>
          </div>
        </div>
      </div>

      {/* --- NAVIGATION LINKS --- */}
      <nav className="flex-1 px-4 space-y-2 text-foreground">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 group ${
                isActive 
                  ? "bg-tikflow-primary text-white shadow-xl shadow-tikflow-primary/10 translate-x-1" 
                  : "text-tikflow-slate hover:bg-foreground/5 hover:text-foreground"
              }`}
            >
              <item.icon 
                size={20} 
                className={`transition-colors ${
                  isActive ? "text-white" : "text-tikflow-slate group-hover:text-tikflow-primary"
                }`} 
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* --- ADMIN PROFILE FOOTER --- */}
      <div className="p-6 mt-auto border-t border-glass-border">
        <div className="bg-foreground/5 p-4 rounded-[2rem] flex items-center gap-3 border border-transparent hover:border-glass-border transition-all cursor-pointer group">
          <div className="size-10 rounded-full bg-orange-100 dark:bg-orange-900/30 border-2 border-background flex items-center justify-center text-orange-600 font-black shadow-sm shrink-0">
            {user?.fullname?.charAt(0) || "A"}
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-black text-foreground truncate">
              {user?.fullname || "Alex Admin"}
            </span>
            <span className="text-[10px] text-tikflow-slate font-bold uppercase tracking-tighter">
              Super Admin
            </span>
          </div>
          <button className="p-2 text-tikflow-slate hover:text-red-500 transition-colors shrink-0">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}