'use client';

import React from 'react';
import { Zap, Shield, Globe, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from './ui/Card';

const ProductShowcase = () => {
    const features = [
        {
            icon: <Zap size={24} />,
            title: "Transactions Éclairs",
            desc: "Propulsé par des passerelles automatisées. Pas d'attente."
        },
        {
            icon: <Cpu size={24} />,
            title: "Intégration Intelligente",
            desc: "L'API TikTok garantit l'arrivée de vos pièces en quelques secondes."
        },
        {
            icon: <Shield size={24} />,
            title: "Sécurité Bancaire",
            desc: "Chiffrement et détection de fraude pour chaque transaction."
        },
        {
            icon: <Globe size={24} />,
            title: "Portée Pan-Africaine",
            desc: "Compatible avec les principaux opérateurs Mobile Money."
        }
    ];

    return (
        <section className="py-32 bg-white">
            <div className="container-v2">
                <div className="flex flex-col lg:flex-row gap-20">
                    <div className="lg:w-1/3 space-y-6">
                        <motion.h2 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight"
                        >
                            Conçu pour <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-tikflow-primary to-tikflow-secondary">la performance.</span>
                        </motion.h2>
                        <motion.p 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-tikflow-gray-medium leading-relaxed"
                        >
                            TikFlow est plus qu'un simple outil de recharge. C'est l'infrastructure premium qui propulse l'économie des créateurs.
                        </motion.p>
                    </div>

                    <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {features.map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card hoverEffect className="h-full border-none shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] bg-background/50">
                                    <div className="size-14 rounded-2xl bg-white shadow-sm border border-tikflow-gray-light flex items-center justify-center text-tikflow-secondary mb-6 transition-all duration-300">
                                        {f.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight">{f.title}</h3>
                                    <p className="text-tikflow-gray-medium leading-relaxed text-sm">
                                        {f.desc}
                                    </p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductShowcase;
