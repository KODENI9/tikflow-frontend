"use client";

import React, { useState } from "react";
import { 
  Headset, 
  MessageCircle, 
  Phone, 
  X,
  ChevronRight
} from "lucide-react";

export default function SupportButton() {
  const [isOpen, setIsOpen] = useState(false);

  const supportNumber = "+228 90 51 32 79"; // Numéro Vert / Support
  const whatsappLink = `https://wa.me/22890513279`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Menu Options */}
      {isOpen && (
        <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <a 
            href={whatsappLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-5 py-3 bg-white rounded-2xl shadow-xl border border-green-50 text-green-600 hover:bg-green-50 transition-all group"
          >
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">WhatsApp</span>
              <span className="text-sm font-black">Chatter avec nous</span>
            </div>
            <div className="size-10 rounded-xl bg-green-500 text-white flex items-center justify-center shadow-lg shadow-green-200 group-hover:scale-110 transition-transform">
              <MessageCircle size={20} />
            </div>
          </a>

          <a 
            href={`tel:${supportNumber.replace(/\s/g, "")}`}
            className="flex items-center gap-3 px-5 py-3 bg-white rounded-2xl shadow-xl border border-blue-50 text-blue-600 hover:bg-blue-50 transition-all group"
          >
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Appel Direct</span>
              <span className="text-sm font-black">{supportNumber}</span>
            </div>
            <div className="size-10 rounded-xl bg-[#1152d4] text-white flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
              <Phone size={20} />
            </div>
          </a>
        </div>
      )}

      {/* Main FAB */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`size-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 ${
          isOpen 
            ? "bg-slate-900 text-white rotate-90" 
            : "bg-[#1152d4] text-white hover:scale-110 hover:shadow-blue-200"
        }`}
      >
        {isOpen ? <X size={28} /> : <Headset size={28} />}
        
        {/* Pulse Effect when closed */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-2xl bg-blue-500 animate-ping opacity-20 pointer-events-none"></span>
        )}
      </button>

      {/* Tooltip hint when closed */}
      {!isOpen && (
        <div className="absolute right-16 top-1/2 -translate-y-1/2 px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden md:block">
          Besoin d'aide ?
        </div>
      )}
    </div>
  );
}
