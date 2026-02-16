"use client";
import { Headset, MessageCircle, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { recipientsApi } from "@/lib/api";

export default function SupportSection() {
  const { getToken, isLoaded } = useAuth();
  const [supportPhone, setSupportPhone] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const resp = await recipientsApi.getGlobalSettings();
        if (resp?.support_phone) {
          setSupportPhone(resp.support_phone);
        }
      } catch (error) {
        console.error("Error fetching settings in SupportSection:", error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <section className="bg-card-bg rounded-3xl border border-glass-border shadow-sm p-8 bg-gradient-to-br from-card-bg to-tikflow-primary/5">
        <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-2xl bg-tikflow-primary text-white shadow-lg shadow-tikflow-primary/20">
            <Headset size={24} />
            </div>
            <div>
            <h3 className="text-lg font-black text-foreground tracking-tight">Centre de Support</h3>
            <p className="text-sm text-tikflow-slate font-medium">Nous sommes là pour vous aider 24j/7.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-foreground/5 rounded-2xl border border-glass-border shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-3 text-green-500">
                <MessageCircle size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">WhatsApp Express</span>
            </div>
            <p className="text-xs text-tikflow-slate font-medium">Réponse instantanée pour vos problèmes de recharge ou de coins.</p>
            <a 
                href={`https://wa.me/${supportPhone.replace(/\s+/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl text-center text-xs font-black uppercase transition-all shadow-md shadow-green-500/10"
            >
                Ouvrir WhatsApp
            </a>
            </div>

            <div className="p-6 bg-foreground/5 rounded-2xl border border-glass-border shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-3 text-tikflow-primary">
                <Phone size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">Numéro Vert (Support)</span>
            </div>
            <p className="text-xs text-tikflow-slate font-medium">Appelez-nous directement pour une assistance vocale personnalisée.</p>
            <a 
                href={`tel:${supportPhone.replace(/\s+/g, '')}`}
                className="w-full py-3 bg-foreground hover:bg-foreground/90 text-background rounded-xl text-center text-xs font-black uppercase transition-all shadow-md shadow-tikflow-primary/5"
            >
                {supportPhone}
            </a>
            </div>
        </div>
    </section>
  );
}
