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
  TrendingUp,
  ChevronRight,
  CreditCard,
  Bell,
  Smartphone,
} from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";

const menuItems = [
  { name: "Dashboard",         href: "/admin/dashboard",    icon: LayoutDashboard, group: "main" },
  { name: "Analytics",         href: "/admin/analytics",    icon: TrendingUp,      group: "main" },
  { name: "Utilisateurs",      href: "/admin/users",        icon: Users,           group: "main" },
  { name: "Transactions",      href: "/admin/transactions", icon: ArrowLeftRight,  group: "finance" },

  { name: "Paiements",         href: "/admin/payments",     icon: CreditCard,      group: "finance" },
  { name: "Wallets",           href: "/admin/wallets",      icon: Wallet,          group: "finance" },
  { name: "Notifications",     href: "/admin/notifications",icon: Bell,            group: "other" },
  { name: "Feedbacks",         href: "/admin/feedbacks",    icon: Star,            group: "other" },
  { name: "PWA Tracking",      href: "/admin/tracking",     icon: Smartphone,      group: "other" },
  { name: "Paramètres",        href: "/admin/settings",     icon: Settings,        group: "other" },
];

const groups: { key: string; label: string }[] = [
  { key: "main",    label: "Vue Générale" },
  { key: "finance", label: "Finance" },
  { key: "other",   label: "Divers" },
];

export default function Sidebar({ user }: { user: any }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-sidebar-bg border-r border-glass-border flex flex-col h-screen sticky top-0 shrink-0 z-40">

      {/* ── LOGO ── */}
      <div className="px-6 py-7 border-b border-glass-border">
        <Link href="/admin/dashboard" className="flex items-center gap-3 group">
          <div className="size-10 bg-tikflow-primary rounded-xl flex items-center justify-center shadow-lg shadow-tikflow-primary/25 group-hover:shadow-tikflow-primary/40 transition-all animate-float shrink-0">
            <Coins className="text-background" size={22} />
          </div>
          <div>
            <h1 className="text-lg font-black text-foreground leading-tight tracking-tight">
              TikFlow<span className="text-tikflow-primary">.</span>
            </h1>
            <p className="text-[9px] font-black text-tikflow-slate uppercase tracking-[0.18em]">
              Admin Console
            </p>
          </div>
        </Link>
      </div>

      {/* ── NAVIGATION ── */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {groups.map((group) => {
          const items = menuItems.filter((i) => i.group === group.key);
          return (
            <div key={group.key}>
              <p className="px-3 mb-1.5 text-[9px] font-black text-tikflow-slate uppercase tracking-[0.18em] opacity-50">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {items.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 group/item relative ${
                        isActive
                          ? "bg-tikflow-primary/10 text-tikflow-primary"
                          : "text-tikflow-slate hover:text-foreground hover:bg-white/[0.04]"
                      }`}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-tikflow-primary rounded-r-full shadow-[0_0_8px_rgba(244,197,66,0.7)]" />
                      )}

                      <item.icon
                        size={16}
                        className={`shrink-0 transition-all ${
                          isActive
                            ? "text-tikflow-primary"
                            : "text-tikflow-slate group-hover/item:text-foreground"
                        }`}
                      />
                      <span className="flex-1 tracking-tight">{item.name}</span>

                      {isActive && (
                        <ChevronRight size={12} className="text-tikflow-primary opacity-60" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* ── ADMIN FOOTER ── */}
      <div className="p-3 border-t border-glass-border">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-background-3 border border-glass-border hover:border-tikflow-primary/20 transition-all group/footer">
          {/* Avatar */}
          <div className="size-8 rounded-lg bg-tikflow-primary/10 border border-tikflow-primary/20 flex items-center justify-center shrink-0">
            <span className="text-tikflow-primary font-black text-sm">
              {user?.fullname?.charAt(0)?.toUpperCase() || "A"}
            </span>
          </div>

          {/* Info */}
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[12px] font-bold text-foreground truncate leading-tight">
              {user?.fullname || "Administrateur"}
            </span>
            <span className="text-[9px] text-tikflow-primary font-black uppercase tracking-widest opacity-70">
              Super Admin
            </span>
          </div>

          {/* Logout */}
          <SignOutButton>
            <button className="p-1.5 rounded-lg text-tikflow-slate hover:text-tikflow-danger hover:bg-tikflow-danger/10 transition-all shrink-0" title="Déconnexion">
              <LogOut size={14} />
            </button>
          </SignOutButton>
        </div>
      </div>
    </aside>
  );
}