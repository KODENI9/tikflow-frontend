'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from './ui/Card';

const Testimonials = () => {
    const reviews = [
        {
            name: "Cédric E.",
            location: "Abidjan, Côte d'Ivoire",
            text: "C'est juste incroyable. Je recharge en plein live et les coins sont déjà là avant même que j'ai fini de parler. TikFlow est mon nouveau meilleur ami.",
            avatar: "CE"
        },
        {
            name: "Jean D.",
            location: "Dakar, Sénégal",
            text: "Le service client est au top. J'avais fait une erreur d'ID et ils ont réglé ça via WhatsApp en 2 min chrono.",
            avatar: "JD"
        },
        {
            name: "Ibrahim B.",
            location: "Lomé, Togo",
            text: "Enfin plus besoin de mendier des cartes Visa à l'étranger. TikFlow nous libère l'accès aux coins.",
            avatar: "IB"
        }
    ];

    return (
        <section className="py-24 bg-white">
            <div className="container-v2">
                <div className="text-center mb-16 space-y-4">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-black tracking-tight text-foreground"
                    >
                        Paroles de <span className="text-transparent bg-clip-text bg-gradient-to-r from-tikflow-secondary to-[#d4a017]">Créateurs</span>
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((review, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card hoverEffect className="h-full flex flex-col justify-between">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 w-full">
                                        <div className="size-14 rounded-2xl bg-tikflow-primary/20 flex items-center justify-center font-black text-tikflow-primary-dark">
                                            {review.avatar}
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-foreground text-lg leading-tight tracking-tight">{review.name}</p>
                                            <p className="text-[11px] font-bold text-tikflow-gray-medium uppercase tracking-widest mt-1">{review.location}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-1 text-tikflow-secondary w-full justify-start">
                                        {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                                    </div>

                                    <p className="text-tikflow-gray-dark font-medium leading-relaxed text-[15px]">
                                        "{review.text}"
                                    </p>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
