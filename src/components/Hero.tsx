'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShoppingCart } from 'lucide-react';

export const Hero = () => {
    return (
        <section className="relative pt-40 pb-24 md:pt-56 md:pb-48 overflow-hidden bg-background">
            {/* Background Orbs */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-tikflow-primary/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-tikflow-secondary/5 rounded-full blur-[100px] translate-y-1/2 pointer-events-none"></div>

            <div className="container-v2 relative z-10">
                <div className="max-w-5xl mx-auto text-center space-y-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-tikflow-primary/5 border border-tikflow-primary/10 text-[11px] font-black text-tikflow-primary uppercase tracking-widest animate-fade-in">
                        <span className="flex size-2 rounded-full bg-tikflow-secondary animate-pulse"></span>
                        Disponible partout en Afrique de l'Ouest
                    </div>

                    <h1 className="text-6xl md:text-9xl font-black tracking-tight text-tikflow-black dark:text-white leading-[0.9] uppercase">
                        Le futur de <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-tikflow-primary to-tikflow-secondary italic font-serif normal-case tracking-normal">l'économie TikTok</span> <br />
                        en Afrique.
                    </h1>

                    <p className="text-lg md:text-xl text-tikflow-slate max-w-2xl mx-auto leading-relaxed font-bold italic">
                        Rechargez vos pièces TikTok instantanément avec vos moyens de paiement locaux. Sécurisé, rapide et conçu pour les créateurs africains.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-6">
                        <Link href="/sign-up" className="btn-v2-primary h-16 px-12 text-lg sm:w-auto w-full group">
                            Commencer l'aventure
                            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="/marche" className="btn-v2-secondary h-16 px-12 text-lg sm:w-auto w-full">
                            Voir nos tarifs
                        </Link>
                    </div>

                    <div className="pt-20 flex flex-wrap items-center justify-center gap-10 md:gap-16 text-tikflow-slate opacity-30">
                        <div className="flex flex-col items-center gap-2 group cursor-default">
                             <span className="font-black text-3xl tracking-tighter group-hover:text-tikflow-primary transition-colors">WAVE</span>
                             <div className="h-1 w-0 bg-tikflow-primary group-hover:w-full transition-all duration-300"></div>
                        </div>
                        <div className="flex flex-col items-center gap-2 group cursor-default">
                             <span className="font-black text-3xl tracking-tighter group-hover:text-orange-500 transition-colors">ORANGE</span>
                             <div className="h-1 w-0 bg-orange-500 group-hover:w-full transition-all duration-300"></div>
                        </div>
                        <div className="flex flex-col items-center gap-2 group cursor-default">
                             <span className="font-black text-3xl tracking-tighter group-hover:text-blue-600 transition-colors">MOOV</span>
                             <div className="h-1 w-0 bg-blue-600 group-hover:w-full transition-all duration-300"></div>
                        </div>
                        <div className="flex flex-col items-center gap-2 group cursor-default">
                             <span className="font-black text-3xl tracking-tighter group-hover:text-yellow-500 transition-colors">FREE</span>
                             <div className="h-1 w-0 bg-yellow-500 group-hover:w-full transition-all duration-300"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Minimalist Background Detail */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent"></div>
        </section>
    );
};
