"use client";
import { useState } from "react";
import { Menu } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import Sidebar from "@/components/dashboard/Sidebar";
import { SyncUser } from "@/components/auth/SyncUser";
import dynamic from "next/dynamic";
import SupportButton from "@/components/dashboard/SupportButton";
const NotificationBell = dynamic(() => import("@/components/NotificationBell"), { ssr: false });
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="flex h-screen bg-[#f6f6f8] overflow-hidden">
      <SyncUser /> {/* Il tourne en arrière-plan */}
      {/* Sidebar avec contrôle mobile */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header avec bouton burger */}
        <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-100 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest hidden md:block">
              Espace Client
            </h2>
          </div>

          <div className="flex items-center gap-4">
             <NotificationBell />
             <UserButton />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
        <SupportButton />
      </div>
    </div>
  );
}