'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';
import { motion } from 'framer-motion';

export const Hero = () => {
    return (
        <section className="relative pt-40 pb-24 md:pt-56 md:pb-48 overflow-hidden bg-background">
            {/* Dramatic Glowing Orbs Background (Logo Colors) */}
            <div className="absolute top-0 left-1/2 w-[800px] h-[600px] bg-gradient-logo opacity-20 rounded-full blur-[200px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-[#FF512F] opacity-10 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#FFD700] opacity-10 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="container-v2 relative z-10">
                <div className="max-w-4xl mx-auto text-center space-y-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-tikflow-secondary/20 text-[11px] font-bold text-tikflow-black uppercase tracking-widest shadow-lg shadow-tikflow-primary/10"
                    >
                        <span className="flex size-2 rounded-full bg-tikflow-secondary animate-pulse"></span>
                        Disponible partout en Afrique de l'Ouest
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter text-white leading-[1.05]"
                    >
                        Le futur de <br className="hidden md:block" />
                        <span className="text-gradient-logo italic pr-2 drop-shadow-sm">l'économie TikTok</span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg md:text-xl text-tikflow-gray-dark max-w-2xl mx-auto leading-relaxed font-medium"
                    >
                        Rechargez vos pièces TikTok instantanément avec vos moyens de paiement locaux. Une expérience premium, sécurisée et conçue pour les créateurs africains.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
                    >
                        <Link href="/sign-up" className="w-full sm:w-auto">
                            <Button variant="primary" size="lg" className="w-full group">
                                Commencer l'aventure
                                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link href="/dashboard/buy" className="w-full sm:w-auto">
                            <Button variant="outline" size="lg" className="w-full">
                                Voir nos tarifs
                            </Button>
                        </Link>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="pt-24 flex flex-wrap items-center justify-center gap-10 md:gap-16 text-tikflow-gray-medium"
                    >
                        {['MONEYFUSION', 'MTN MOMO', 'WAVE', 'ORANGE', 'MOOV', 'FLOOZ'].map((provider) => (
                            <span key={provider} className="font-bold text-sm tracking-widest uppercase opacity-40 hover:opacity-100 transition-all cursor-default hover:text-white hover:scale-105">
                                {provider}
                            </span>
                        ))}
                    </motion.div>
                </div>
            </div>
            
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-tikflow-gray-light to-transparent"></div>
        </section>
    );
};
