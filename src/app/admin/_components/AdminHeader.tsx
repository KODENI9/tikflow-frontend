"use client";

import React from "react";
import { UserButton } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import { User } from "@/types/api";
import { Sparkles } from "lucide-react";

const NotificationBell = dynamic(() => import("@/components/NotificationBell"), { ssr: false });

interface AdminHeaderProps {
  user?: User;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ user }) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";

  return (
    <header className="h-[70px] bg-background-2/80 backdrop-blur-xl border-b border-glass-border flex items-center justify-between px-8 sticky top-0 z-30 shrink-0">
      {/* Left — greeting */}
      <div className="flex flex-col">
        <h2 className="text-base font-black text-foreground tracking-tight leading-tight">
          {greeting},{" "}
          <span className="text-tikflow-primary">
            {user?.fullname?.split(" ")[0] || "Admin"}
          </span>{" "}
          👋
        </h2>
        <p className="text-[11px] text-tikflow-slate font-medium mt-0.5">
          Gérez votre plateforme TikFlow avec précision.
        </p>
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-3">
        {/* Status pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-tikflow-accent/10 border border-tikflow-accent/20 rounded-full">
          <span className="size-1.5 bg-tikflow-accent rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-tikflow-accent uppercase tracking-widest">
            Opérationnel
          </span>
        </div>

        {/* Notification Bell */}
        <div className="p-2 rounded-xl bg-background-3 border border-glass-border hover:border-tikflow-primary/30 transition-all">
          <NotificationBell isAdmin={true} />
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-glass-border" />

        {/* User profile */}
        <div className="flex items-center gap-3 bg-background-3 p-1.5 pr-4 rounded-2xl border border-glass-border hover:border-tikflow-primary/20 transition-all cursor-pointer group">
          <UserButton afterSignOutUrl="/" />
          <div className="flex flex-col text-left">
            <span className="text-[12px] font-bold text-foreground leading-tight">
              {user?.fullname || "Administrateur"}
            </span>
            <span className="flex items-center gap-1 text-[9px] text-tikflow-primary font-black uppercase tracking-widest mt-0.5">
              <Sparkles size={8} />
              Super Admin
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
