'use client';

import React from 'react';
import { Shield, Lock } from 'lucide-react';

const SecuritySection = () => {
    return (
        <section className="py-24 overflow-hidden">
            <div className="container-custom">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-32">
                    <div className="lg:w-1/2 space-y-8">
                        <div className="inline-flex px-3 py-1 rounded-full bg-green-50 text-green-600 text-[11px] font-bold uppercase tracking-widest border border-green-100">
                            Sécurité Certifiée
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">
                            Sécurité de <span className="gradient-text">Grade Bancaire</span>.
                        </h2>
                        <p className="text-lg text-slate-500 font-medium leading-relaxed">
                            Nos transactions sont sécurisées par les protocoles les plus avancés. Chaque recharge est vérifiée et chiffrée.
                        </p>
                        
                        <div className="flex items-center gap-6 pt-4 grayscale opacity-60">
                            <div className="flex items-center gap-2">
                                <Shield className="text-slate-900" size={20} />
                                <span className="text-lg font-black tracking-tighter">AUTHENTICATOR</span>
                            </div>
                            <div className="w-px h-6 bg-slate-200"></div>
                            <span className="text-lg font-bold text-slate-400">SSL SECURE</span>
                        </div>
                    </div>

                    <div className="lg:w-1/2 flex items-center justify-center gap-6">
                        <div className="glass-card p-10 rounded-[2.5rem] flex flex-col items-center gap-4 animate-bounce duration-[3000ms]">
                            <div className="size-16 rounded-3xl bg-blue-50 flex items-center justify-center text-[#1152d4]">
                                <Shield size={32} />
                            </div>
                            <p className="text-[11px] font-black uppercase text-slate-400">Verified SSL</p>
                        </div>
                        
                        <div className="glass-card p-10 rounded-[2.5rem] flex flex-col items-center gap-4 mt-16 animate-pulse">
                            <div className="size-16 rounded-3xl bg-purple-50 flex items-center justify-center text-[#702bff]">
                                <Lock size={32} />
                            </div>
                            <p className="text-[11px] font-black uppercase text-slate-400">Audit Annuel 2024</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SecuritySection;
