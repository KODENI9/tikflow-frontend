"use client";
import React, { useState, useEffect } from "react";
import { 
  MessageCircle, 
  Phone, 
  Headset, 
  X,
  ChevronRight
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { recipientsApi } from "@/lib/api";

export default function SupportButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { getToken, isLoaded } = useAuth();
  const [supportPhone, setSupportPhone] = useState("+228 90 51 32 79");

  useEffect(() => {
    const fetchSettings = async () => {
      if (!isLoaded) return;
      try {
        const token = await getToken();
        if (!token) return;
        const resp = await recipientsApi.getGlobalSettings(token);
        if (resp?.support_phone) {
          setSupportPhone(resp.support_phone);
        }
      } catch (error) {
        console.error("Error fetching support phone in SupportButton:", error);
      }
    };
    fetchSettings();
  }, [isLoaded, getToken]);

  const toggleOpen = () => setIsOpen(!isOpen);

  const supportOptions = [
    {
      title: "WhatsApp",
      subtitle: "Réponse en < 5 min",
      icon: <MessageCircle className="w-5 h-5" />,
      color: "bg-emerald-500",
      textColor: "text-green-600",
      hoverBg: "hover:bg-green-50",
      shadowColor: "shadow-green-200",
      link: `https://wa.me/${supportPhone.replace(/\s+/g, '')}`,
    },
    {
      title: "Appel Direct",
      subtitle: "Numéro Vert Gratuit",
      icon: <Phone className="w-5 h-5" />,
      color: "bg-[#1152d4]",
      textColor: "text-blue-600",
      hoverBg: "hover:bg-blue-50",
      shadowColor: "shadow-blue-200",
      link: `tel:${supportPhone.replace(/\s+/g, '')}`,
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Options Dropup */}
      {isOpen && (
        <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
           {supportOptions.map((opt, i) => (
             <a 
               key={i}
               href={opt.link} 
               target="_blank" 
               rel="noopener noreferrer"
               className={`flex items-center gap-3 px-5 py-3 bg-white rounded-2xl shadow-xl border border-slate-50 ${opt.textColor} ${opt.hoverBg} transition-all group min-w-[220px]`}
             >
               <div className={`p-2 rounded-xl ${opt.color} text-white shadow-lg ${opt.shadowColor}`}>
                 {opt.icon}
               </div>
               <div className="flex flex-col">
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{opt.title}</span>
                 <span className="text-sm font-black">{opt.subtitle}</span>
               </div>
               <ChevronRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition-all text-slate-300" />
             </a>
           ))}
        </div>
      )}

      {/* Main Support Button */}
      <button 
        onClick={toggleOpen}
        className={`w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-slate-900 rotate-90 scale-90' : 'bg-blue-600 hover:scale-110 active:scale-95'}`}
      >
        {isOpen ? (
          <X className="text-white w-6 h-6" />
        ) : (
          <Headset className="text-white w-6 h-6" />
        )}
        
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
        )}
      </button>
    </div>
  );
}
