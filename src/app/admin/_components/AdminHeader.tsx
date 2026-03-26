"use client";

import React from "react";
import { UserButton } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import { User } from "@/types/api";
import { ThemeToggle } from "@/components/ThemeToggle";

const NotificationBell = dynamic(() => import("@/components/NotificationBell"), { ssr: false });

interface AdminHeaderProps {
  user?: User;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ user }) => {
  return (
    <header className="h-20 bg-background/60 backdrop-blur-xl border-b border-glass-border flex items-center justify-between px-8 sticky top-0 z-30">
      <div className="flex flex-col">
        <h2 className="text-xl font-black text-foreground tracking-tight">Bonjour, {user?.fullname?.split(" ")[0] || "Admin"} 👋</h2>
        <p className="text-xs text-tikflow-slate font-bold opacity-60">Gérez votre plateforme TikFlow avec précision.</p>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2 bg-foreground/5 p-1 rounded-xl">
          <ThemeToggle />
        </div>
        
        <div className="relative group p-1">
          <NotificationBell isAdmin={true} />
        </div>
        
        <div className="h-8 w-[1px] bg-glass-border mx-1"></div>
        
        <div className="flex items-center gap-4 bg-white/5 dark:bg-foreground/5 p-1.5 pr-4 rounded-2xl border border-glass-border hover:border-tikflow-primary/20 transition-all cursor-pointer">
          <UserButton afterSignOutUrl="/" />
          <div className="flex flex-col text-left">
            <span className="text-[11px] font-black text-foreground leading-none">{user?.fullname || "Administrateur"}</span>
            <span className="text-[9px] text-tikflow-primary font-black uppercase tracking-widest mt-0.5 opacity-80">Online</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
