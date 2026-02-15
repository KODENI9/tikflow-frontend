"use client";
import { useState } from "react";
import { Lock, Eye, EyeOff, Smartphone } from "lucide-react";

export default function SecuritySection() {
  const [showPass, setShowPass] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
        <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-2xl bg-red-50 text-red-600">
            <Lock size={24} />
            </div>
            <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Sécurité du compte</h3>
            <p className="text-sm text-slate-500 font-medium">Protégez vos transactions et vos accès.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Nouveau mot de passe</label>
            <div className="relative">
                <input 
                type={showPass ? "text" : "password"} 
                placeholder="••••••••" 
                className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20"
                />
                <button 
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300"
                >
                {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
            </div>
            </div>
            <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Confirmer le mot de passe</label>
            <input type="password" placeholder="••••••••" className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20" />
            </div>
        </div>

        {/* 2FA Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-3xl bg-blue-50/50 border border-blue-100 gap-4">
            <div className="flex items-center gap-4">
            <div className="size-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-600">
                <Smartphone size={24} />
            </div>
            <div>
                <p className="text-sm font-black text-slate-900">Double Authentification (2FA)</p>
                <p className="text-xs text-slate-500 font-medium">Sécurisez chaque transaction via un code SMS unique.</p>
            </div>
            </div>
            <button 
            onClick={() => setTwoFactor(!twoFactor)}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${twoFactor ? 'bg-blue-600' : 'bg-slate-200'}`}
            >
            <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${twoFactor ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
        </div>
    </section>
  );
}
