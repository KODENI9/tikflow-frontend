'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';
import { motion } from 'framer-motion';

export const Hero = () => {
    return (
        <section className="relative pt-40 pb-24 md:pt-56 md:pb-48 overflow-hidden bg-background">
            {/* Minimalist Background Details */}
            <div className="absolute top-0 left-1/2 w-[600px] h-[600px] bg-tikflow-secondary/5 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

            <div className="container-v2 relative z-10">
                <div className="max-w-4xl mx-auto text-center space-y-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-tikflow-gray-light text-[11px] font-bold text-tikflow-gray-dark uppercase tracking-widest shadow-sm"
                    >
                        <span className="flex size-2 rounded-full bg-tikflow-secondary animate-pulse"></span>
                        Disponible partout en Afrique de l'Ouest
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-tikflow-black leading-[1.1]"
                    >
                        Le futur de <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-tikflow-secondary to-[#d4a017] italic pr-2">l'économie TikTok</span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg md:text-xl text-tikflow-gray-medium max-w-2xl mx-auto leading-relaxed"
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
                            <span key={provider} className="font-bold text-sm tracking-widest uppercase opacity-50 hover:opacity-100 hover:text-tikflow-secondary transition-colors cursor-default">
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
