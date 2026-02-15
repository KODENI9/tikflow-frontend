"use client";
import { Globe, Bell, ShieldCheck } from "lucide-react";

export default function PreferencesSection() {
  return (
    <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
    <div className="flex items-center gap-4 mb-8">
        <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
        <Globe size={24} />
        </div>
        <div>
        <h3 className="text-lg font-black text-slate-900 tracking-tight">Préférences d'affichage</h3>
        <p className="text-sm text-slate-500 font-medium">Adaptez TikFlow à vos besoins quotidiens.</p>
        </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
        <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Langue de l'interface</label>
            <select className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/20 appearance-none">
            <option>Français (FR)</option>
            <option>English (US)</option>
            <option>Wolof (SN)</option>
            </select>
        </div>
        <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Notifications Email</label>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
            <div className="flex items-center gap-3">
                <Bell size={18} className="text-slate-400" />
                <span className="text-sm font-bold text-slate-700">Rapports mensuels</span>
            </div>
            <input type="checkbox" defaultChecked className="size-5 rounded-lg border-slate-200 text-blue-600 focus:ring-blue-500" />
            </div>
        </div>
        </div>

        <div className="space-y-6">
        <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Devise principale</label>
            <select className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/20 appearance-none">
            <option>FCFA (XOF)</option>
            <option>Dollars (USD)</option>
            <option>Euro (EUR)</option>
            </select>
        </div>
        <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sécurité des Retraits</label>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
            <div className="flex items-center gap-3">
                <ShieldCheck size={18} className="text-slate-400" />
                <span className="text-sm font-bold text-slate-700">Confirmation PIN</span>
            </div>
            <input type="checkbox" defaultChecked className="size-5 rounded-lg border-slate-200 text-blue-600 focus:ring-blue-500" />
            </div>
        </div>
        </div>
    </div>
    </section>
  );
}
