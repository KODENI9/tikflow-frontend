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
    <header className="h-16 bg-background border-b border-glass-border flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {/* Breadcrumbs or Title could go here */}
        <h2 className="text-lg font-semibold text-foreground hidden md:block">Tableau de Bord Admin</h2>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <NotificationBell isAdmin={true} />
        
        <div className="h-8 w-[1px] bg-glass-border mx-2"></div>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-foreground leading-none">{user?.fullname || "Administrateur"}</p>
            <p className="text-[10px] text-tikflow-slate mt-1 uppercase tracking-wider font-semibold">Admin</p>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
