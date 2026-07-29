'use client';

import React from 'react';
import { motion } from 'framer-motion';

const TrustSection = () => {
    return (
        <section className="py-32 bg-background">
            <div className="container-v2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 border-y border-tikflow-gray-light py-24">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-4 text-center md:text-left"
                    >
                        <p className="text-6xl font-black text-tikflow-secondary tracking-tighter">10K+</p>
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-tikflow-gray-medium">Créateurs Actifs</p>
                    </motion.div>
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="space-y-4 text-center md:text-left"
                    >
                        <p className="text-6xl font-black text-tikflow-primary tracking-tighter">500K+</p>
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-tikflow-gray-medium">Pièces Livrées</p>
                    </motion.div>
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="space-y-4 text-center md:text-left"
                    >
                        <p className="text-6xl font-black text-foreground tracking-tighter">99.9%</p>
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-tikflow-gray-medium">Taux de Succès</p>
                    </motion.div>
                </div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mt-24 max-w-4xl mx-auto bg-white rounded-[2.5rem] p-12 md:p-20 flex flex-col md:flex-row items-center gap-12 border border-tikflow-gray-light shadow-sm"
                >
                    <div className="flex-1 space-y-6">
                        <h2 className="text-4xl font-black tracking-tight leading-tight text-foreground">
                            La sécurité sans <span className="text-transparent bg-clip-text bg-gradient-to-r from-tikflow-secondary to-[#d4a017]">compromis.</span>
                        </h2>
                        <p className="text-tikflow-gray-dark font-medium text-lg leading-relaxed">
                            Nous utilisons un chiffrement de niveau industriel pour protéger votre compte. Chaque transaction est surveillée 24h/24 et 7j/7 pour vous garantir une tranquillité d'esprit totale.
                        </p>
                    </div>
                    <div className="size-48 shrink-0 rounded-full bg-tikflow-primary/10 border border-tikflow-primary/20 flex items-center justify-center p-8 text-center text-tikflow-gray-dark text-sm font-medium">
                        "Votre sécurité est notre valeur fondamentale."
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default TrustSection;
