"use client";
import { Headset, MessageCircle, Phone } from "lucide-react";

export default function SupportSection() {
  return (
    <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 bg-gradient-to-br from-white to-blue-50/30">
        <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-2xl bg-[#1152d4] text-white shadow-lg shadow-blue-200">
            <Headset size={24} />
            </div>
            <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Centre de Support</h3>
            <p className="text-sm text-slate-500 font-medium">Nous sommes là pour vous aider 24j/7.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-3 text-green-600">
                <MessageCircle size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">WhatsApp Express</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Réponse instantanée pour vos problèmes de recharge ou de coins.</p>
            <a 
                href="https://wa.me/22890513279" 
                target="_blank"
                className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl text-center text-xs font-black uppercase transition-all shadow-md shadow-green-100"
            >
                Ouvrir WhatsApp
            </a>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-3 text-[#1152d4]">
                <Phone size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">Numéro Vert (Support)</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Appelez-nous directement pour une assistance vocale personnalisée.</p>
            <a 
                href="tel:+22870544184" 
                className="w-full py-3 bg-slate-900 hover:bg-black text-white rounded-xl text-center text-xs font-black uppercase transition-all shadow-md shadow-slate-100"
            >
                +228 90 51 32 79
            </a>
            </div>
        </div>
    </section>
  );
}
