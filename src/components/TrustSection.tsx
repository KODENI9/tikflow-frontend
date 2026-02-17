'use client';

import React from 'react';

const TrustSection = () => {
    return (
        <section className="py-32 bg-background">
            <div className="container-v2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 border-y border-slate-50 py-24">
                    <div className="space-y-4">
                        <p className="text-6xl font-black text-tikflow-primary tracking-tighter">10K+</p>
                        <p className="text-sm font-black uppercase tracking-[0.2em] text-tikflow-slate">Créateurs Actifs</p>
                    </div>
                    <div className="space-y-4">
                        <p className="text-6xl font-black text-tikflow-secondary tracking-tighter">500K+</p>
                        <p className="text-sm font-black uppercase tracking-[0.2em] text-tikflow-slate">Pièces Livrées</p>
                    </div>
                    <div className="space-y-4">
                        <p className="text-6xl font-black text-tikflow-accent tracking-tighter">99.9%</p>
                        <p className="text-sm font-black uppercase tracking-[0.2em] text-tikflow-slate">Taux de Succès</p>
                    </div>
                </div>

                <div className="mt-24 max-w-4xl mx-auto bg-[#0a0b10] dark:bg-[#111218] rounded-[2.5rem] p-12 md:p-20 text-white flex flex-col md:flex-row items-center gap-12 border border-white/5 dark:border-white/10">
                    <div className="flex-1 space-y-6">
                        <h2 className="text-4xl font-black tracking-tight uppercase leading-tight">La sécurité sans <span className="text-tikflow-secondary">compromis.</span></h2>
                        <p className="text-slate-400 font-bold text-lg leading-relaxed italic">
                            Nous utilisons un chiffrement de niveau industriel pour protéger votre compte. Chaque transaction est surveillée 24h/24 et 7j/7.
                        </p>
                    </div>
                    <div className="size-48 rounded-full border border-tikflow-primary/20 flex items-center justify-center p-8 text-center italic font-bold text-slate-400 text-sm">
                        "Votre sécurité est notre valeur fondamentale."
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TrustSection;
