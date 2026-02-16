"use client";
import { Globe, Bell, ShieldCheck } from "lucide-react";

export default function PreferencesSection() {
  return (
    <section className="bg-card-bg rounded-3xl border border-glass-border shadow-sm p-8">
    <div className="flex items-center gap-4 mb-8">
        <div className="p-3 rounded-2xl bg-tikflow-primary/10 text-tikflow-primary">
        <Globe size={24} />
        </div>
        <div>
        <h3 className="text-lg font-black text-foreground tracking-tight">Préférences d'affichage</h3>
        <p className="text-sm text-tikflow-slate font-medium">Adaptez TikFlow à vos besoins quotidiens.</p>
        </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
        <div className="space-y-2">
            <label className="text-[10px] font-black text-tikflow-slate uppercase tracking-widest">Langue de l'interface</label>
            <select className="w-full px-4 py-3.5 bg-foreground/5 border border-glass-border rounded-2xl text-sm font-bold text-foreground focus:ring-2 focus:ring-tikflow-primary/20 appearance-none">
            <option>Français (FR)</option>
            <option>English (US)</option>
            <option>Wolof (SN)</option>
            </select>
        </div>
        <div className="space-y-2">
            <label className="text-[10px] font-black text-tikflow-slate uppercase tracking-widest">Notifications Email</label>
            <div className="flex items-center justify-between p-4 bg-foreground/5 border border-glass-border rounded-2xl">
            <div className="flex items-center gap-3">
                <Bell size={18} className="text-tikflow-slate/50" />
                <span className="text-sm font-bold text-foreground">Rapports mensuels</span>
            </div>
            <input type="checkbox" defaultChecked className="size-5 rounded-lg border-glass-border bg-foreground/5 text-tikflow-primary focus:ring-tikflow-primary" />
            </div>
        </div>
        </div>

        <div className="space-y-6">
        <div className="space-y-2">
            <label className="text-[10px] font-black text-tikflow-slate uppercase tracking-widest">Devise principale</label>
            <select className="w-full px-4 py-3.5 bg-foreground/5 border border-glass-border rounded-2xl text-sm font-bold text-foreground focus:ring-2 focus:ring-tikflow-primary/20 appearance-none">
            <option>FCFA (XOF)</option>
            <option>Dollars (USD)</option>
            <option>Euro (EUR)</option>
            </select>
        </div>
        <div className="space-y-2">
            <label className="text-[10px] font-black text-tikflow-slate uppercase tracking-widest">Sécurité des Retraits</label>
            <div className="flex items-center justify-between p-4 bg-foreground/5 border border-glass-border rounded-2xl">
            <div className="flex items-center gap-3">
                <ShieldCheck size={18} className="text-tikflow-slate/50" />
                <span className="text-sm font-bold text-foreground">Confirmation PIN</span>
            </div>
            <input type="checkbox" defaultChecked className="size-5 rounded-lg border-glass-border bg-foreground/5 text-tikflow-primary focus:ring-tikflow-primary" />
            </div>
        </div>
        </div>
    </div>
    </section>
  );
}
