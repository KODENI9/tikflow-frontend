'use client';

import React from 'react';
import { Zap, Wallet, ShieldCheck, Headphones } from 'lucide-react';

const ValueProps = () => {
    const props = [
        {
            icon: <Zap className="text-blue-600" size={24} />,
            title: "Vitesse Éclair",
            desc: "Livraison automatisée en moins de 60 secondes, disponible 24/7/365.",
            bg: "bg-blue-50"
        },
        {
            icon: <Wallet className="text-purple-600" size={24} />,
            title: "Paiement Local",
            desc: "Utilisez Wave, Flooz, T-Money et Orange Money sans frais cachés.",
            bg: "bg-purple-50"
        },
        {
            icon: <ShieldCheck className="text-blue-600" size={24} />,
            title: "Sécurité Totale",
            desc: "Chiffrement de grade bancaire et protection des données personnelles.",
            bg: "bg-blue-50"
        },
        {
            icon: <Headphones className="text-indigo-600" size={24} />,
            title: "Support Local",
            desc: "Assistance réactive via WhatsApp et Telegram par nos équipes.",
            bg: "bg-indigo-50"
        }
    ];

    return (
        <section className="py-24 bg-[#fdfdff]">
            <div className="container-custom">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                        Pourquoi <span className="gradient-text">TikFlow</span> ?
                    </h2>
                    <p className="text-slate-500 font-medium max-w-2xl mx-auto">
                        Une plateforme fintech moderne conçue pour la rapidité et l'accessibilité sur le marché africain.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {props.map((prop, index) => (
                        <div key={index} className="glass-card p-8 rounded-3xl space-y-4 hover:shadow-2xl hover:-translate-y-1 transition-all group">
                            <div className={`size-12 rounded-2xl ${prop.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                {prop.icon}
                            </div>
                            <h3 className="text-xl font-black text-[#111318]">{prop.title}</h3>
                            <p className="text-[14px] text-slate-500 font-medium leading-relaxed">
                                {prop.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ValueProps;
