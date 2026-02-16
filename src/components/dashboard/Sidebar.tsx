"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  Wallet, 
  ShoppingCart, 
  TrendingUp, 
  History, 
  Gift, 
  Settings, 
  LogOut,
  ChevronRight,
  MessageCircle,
  Phone,
  HelpCircle,
  ShieldCheck,
  Star,
  LayoutDashboard,
  Landmark,
  X,
  Headset
} from "lucide-react";
import { useClerk, useUser, useAuth, UserButton } from "@clerk/nextjs";
import { recipientsApi } from "@/lib/api";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, isLoaded: userLoaded } = useUser();
  const { getToken, isLoaded: authLoaded } = useAuth();
  const { signOut } = useClerk();
  const [supportPhone, setSupportPhone] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const resp = await recipientsApi.getGlobalSettings();
        if (resp?.support_phone) {
          setSupportPhone(resp.support_phone);
        }
      } catch (error) {
        console.error("Error fetching support phone in Sidebar:", error);
      }
    };
    fetchSettings();
  }, []);

  const menuItems = [
    { name: "Mon Portefeuille", icon: Wallet, href: "/dashboard", active: pathname === "/dashboard" },
    { name: "Vendre mes Coins", icon: TrendingUp, href: "/dashboard/sell", active: pathname === "/dashboard/sell" },
    { name: "Acheter des Coins", icon: ShoppingCart, href: "/dashboard/buy", active: pathname.startsWith("/dashboard/buy") },
    { name: "Convertir mon Bonus", icon: Gift, href: "/dashboard/convert", active: pathname === "/dashboard/convert" },
    { name: "Historique", icon: History, href: "/dashboard/history", active: pathname === "/dashboard/history" },
    { name: "Aide & Tutoriels", icon: HelpCircle, href: "/dashboard/help", active: pathname === "/dashboard/help" },
    { name: "Paramètres", icon: Settings, href: "/dashboard/settings", active: pathname === "/dashboard/settings" },
  ];

  const supportLinks = [
    { name: "WhatsApp Direct", icon: MessageCircle, href: `https://wa.me/${supportPhone.replace(/\s+/g, '')}`, color: "text-green-600" },
    { name: "Nous Appeler", icon: Phone, href: `tel:${supportPhone.replace(/\s+/g, '')}`, color: "text-blue-600" },
  ];

  const displayUserName = userLoaded ? (user?.firstName || user?.username || "Utilisateur") : "...";

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 p-5 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:flex md:flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex flex-col gap-8 h-full">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-xl bg-[#1152d4] text-white shadow-lg shadow-blue-500/30">
                <Landmark size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold leading-none tracking-tight text-gray-900">TikFlow</h1>
                <p className="text-gray-500 text-[10px] font-bold uppercase mt-1">Plateforme Fintech</p>
              </div>
            </div>
            <button onClick={onClose} className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
              <X size={24} />
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  item.active 
                    ? "bg-[#1152d4] text-white shadow-md shadow-blue-500/20" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-[#1152d4]"
                }`}
              >
                <item.icon size={20} />
                <span className="text-sm">{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="mx-2 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-blue-600">
              <Headset size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Support TikFlow</span>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">Besoin d'aide pour une transaction ?</p>
            <div className="flex flex-col gap-2">
                {supportLinks.map((link, idx) => (
                    <a 
                      key={idx}
                      href={link.href} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-xs font-black shadow-sm border border-blue-50 hover:bg-blue-50 transition-colors ${link.color}`}
                    >
                      <link.icon size={14} />
                      {link.name}
                    </a>
                ))}
            </div>
          </div>

          <div className="mt-auto border-t border-gray-100 pt-4 flex items-center gap-3 px-2">
            <UserButton afterSignOutUrl="/" />
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-gray-900 truncate">{displayUserName}</p>
              <div className="flex items-center gap-1.5">
                 <div className="size-1.5 bg-green-500 rounded-full animate-pulse"></div>
                 <p className="text-[10px] text-green-600 font-bold uppercase">En ligne</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}