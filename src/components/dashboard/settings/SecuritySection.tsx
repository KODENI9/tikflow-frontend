"use client";
import { useState } from "react";
import { Lock, Eye, EyeOff, Smartphone } from "lucide-react";

export default function SecuritySection() {
  const [showPass, setShowPass] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <section className="bg-card-bg rounded-3xl border border-glass-border shadow-sm p-8">
        <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-2xl bg-tikflow-accent/10 text-tikflow-accent">
            <Lock size={24} />
            </div>
            <div>
            <h3 className="text-lg font-black text-foreground tracking-tight">Sécurité du compte</h3>
            <p className="text-sm text-tikflow-slate font-medium">Protégez vos transactions et vos accès.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-1">
            <label className="text-[10px] font-black text-tikflow-slate uppercase ml-1">Nouveau mot de passe</label>
            <div className="relative">
                <input 
                type={showPass ? "text" : "password"} 
                placeholder="••••••••" 
                className="w-full px-4 py-3.5 bg-foreground/5 border border-glass-border rounded-2xl text-sm font-bold text-foreground focus:ring-2 focus:ring-tikflow-primary/20"
                />
                <button 
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-tikflow-slate/50 hover:text-foreground"
                >
                {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
            </div>
            </div>
            <div className="space-y-1">
            <label className="text-[10px] font-black text-tikflow-slate uppercase ml-1">Confirmer le mot de passe</label>
            <input type="password" placeholder="••••••••" className="w-full px-4 py-3.5 bg-foreground/5 border border-glass-border rounded-2xl text-sm font-bold text-foreground focus:ring-2 focus:ring-tikflow-primary/20" />
            </div>
        </div>

        {/* 2FA Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-3xl bg-tikflow-primary/5 border border-tikflow-primary/10 gap-4">
            <div className="flex items-center gap-4">
            <div className="size-12 rounded-2xl bg-card-bg shadow-sm flex items-center justify-center text-tikflow-primary border border-glass-border">
                <Smartphone size={24} />
            </div>
            <div>
                <p className="text-sm font-black text-foreground">Double Authentification (2FA)</p>
                <p className="text-xs text-tikflow-slate font-medium">Sécurisez chaque transaction via un code SMS unique.</p>
            </div>
            </div>
            <button 
            onClick={() => setTwoFactor(!twoFactor)}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${twoFactor ? 'bg-tikflow-primary' : 'bg-tikflow-slate/20'}`}
            >
            <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${twoFactor ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
        </div>
    </section>
  );
}
