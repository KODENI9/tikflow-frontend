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
    <aside className="w-72 bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0 shrink-0">
      
      {/* --- LOGO SECTION --- */}
      <div className="p-8 mb-4">
        <div className="flex items-center gap-3">
          <div className="size-10 bg-[#1152d4] rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Coins className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 leading-tight tracking-tight">
              TikFlow Admin
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Fintech Platform
            </p>
          </div>
        </div>
      </div>

      {/* --- NAVIGATION LINKS --- */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          // On vérifie si le pathname commence par le href pour garder l'item actif 
          // même quand on est dans un sous-dossier (ex: /admin/transactions/998877)
          const isActive = pathname.startsWith(item.href);
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 group ${
                isActive 
                  ? "bg-[#1152d4] text-white shadow-xl shadow-blue-100 translate-x-1" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <item.icon 
                size={20} 
                className={`transition-colors ${
                  isActive ? "text-white" : "text-slate-400 group-hover:text-[#1152d4]"
                }`} 
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* --- ADMIN PROFILE FOOTER --- */}
      <div className="p-6 mt-auto border-t border-slate-50">
        <div className="bg-slate-50 p-4 rounded-[2rem] flex items-center gap-3 border border-transparent hover:border-slate-200 transition-all cursor-pointer group">
          <div className="size-10 rounded-full bg-orange-100 border-2 border-white flex items-center justify-center text-orange-600 font-black shadow-sm shrink-0">
            {user?.fullname?.charAt(0) || "A"}
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-black text-slate-900 truncate">
              {user?.fullname || "Alex Admin"}
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
              Super Admin
            </span>
          </div>
          <button className="p-2 text-slate-400 hover:text-red-500 transition-colors shrink-0">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}