'use client';

import React from 'react';
import { Zap, Shield, Globe, Cpu } from 'lucide-react';

const ProductShowcase = () => {
    const features = [
        {
            icon: <Zap size={24} />,
            title: "Lightning Transactions",
            desc: "Powered by automated payment gateways. No manual approval, no waiting time."
        },
        {
            icon: <Cpu size={24} />,
            title: "Smart Integration",
            desc: "Direct-to-TikTok API integration ensures your coins arrive in seconds."
        },
        {
            icon: <Shield size={24} />,
            title: "Bank-Grade Security",
            desc: "Multi-layer encryption and fraud detection systems for every dollar."
        },
        {
            icon: <Globe size={24} />,
            title: "Pan-African Reach",
            desc: "Supporting the major mobile money operators across the continent."
        }
    ];

    return (
        <section className="py-32 bg-background/50 border-y border-glass-border">
            <div className="container-v2">
                <div className="flex flex-col lg:flex-row gap-20">
                    <div className="lg:w-1/3 space-y-6">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                            Built for scale. <br />
                            <span className="text-tikflow-slate">Trusted by thousands.</span>
                        </h2>
                        <p className="text-lg text-tikflow-slate font-medium leading-relaxed">
                            TikFlow is more than a recharge tool. It's the infrastructure powering the creator economy in Africa.
                        </p>
                    </div>

                    <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {features.map((f, i) => (
                            <div key={i} className="card-v2 group">
                                <div className="size-12 rounded-xl bg-foreground/5 flex items-center justify-center text-foreground mb-6 group-hover:bg-foreground group-hover:text-background transition-colors">
                                    {f.icon}
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-3">{f.title}</h3>
                                <p className="text-tikflow-slate font-medium leading-relaxed">
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
