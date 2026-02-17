'use client';

import React from 'react';
import { Zap, Shield, Globe, Cpu } from 'lucide-react';

const ProductShowcase = () => {
    const features = [
        {
            icon: <Zap size={24} />,
            title: "Transactions Éclairs",
            desc: "Propulsé par des passerelles de paiement automatisées. Pas d'approbation manuelle, pas d'attente."
        },
        {
            icon: <Cpu size={24} />,
            title: "Intégration Intelligente",
            desc: "L'intégration directe à l'API TikTok garantit l'arrivée de vos pièces en quelques secondes."
        },
        {
            icon: <Shield size={24} />,
            title: "Sécurité Bancaire",
            desc: "Chiffrement multi-couches et systèmes de détection de fraude pour chaque transaction."
        },
        {
            icon: <Globe size={24} />,
            title: "Portée Pan-Africaine",
            desc: "Compatible avec les principaux opérateurs de Mobile Money à travers le continent."
        }
    ];

    return (
        <section className="py-32 bg-background/50 border-y border-glass-border">
            <div className="container-v2">
                <div className="flex flex-col lg:flex-row gap-20">
                    <div className="lg:w-1/3 space-y-6">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground uppercase">
                            Conçu pour <br />
                            <span className="text-tikflow-primary">la performance.</span>
                        </h2>
                        <p className="text-lg text-tikflow-slate font-bold leading-relaxed italic">
                            TikFlow est plus qu'un outil de recharge. C'est l'infrastructure qui propulse l'économie des créateurs en Afrique.
                        </p>
                    </div>

                    <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {features.map((f, i) => (
                            <div key={i} className="card-v2 group border-none bg-foreground/[0.02] dark:bg-white/[0.02] hover:bg-tikflow-primary/5 transition-all duration-500">
                                <div className="size-14 rounded-2xl bg-tikflow-primary/10 flex items-center justify-center text-tikflow-primary mb-6 group-hover:bg-tikflow-primary group-hover:text-white transition-all duration-300">
                                    {f.icon}
                                </div>
                                <h3 className="text-xl font-black text-foreground mb-3 uppercase tracking-tight">{f.title}</h3>
                                <p className="text-tikflow-slate font-bold leading-relaxed text-sm">
                                    {f.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductShowcase;
