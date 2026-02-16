'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Star, Smartphone, Currency } from 'lucide-react';

export const Hero = () => {
    return (
        <section className="relative pt-32 pb-16 md:pt-48 md:pb-24 overflow-hidden">
            {/* Background Decorative Gradients */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/40 blur-[120px] rounded-full -z-10"></div>
            <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-100/40 blur-[100px] rounded-full -z-10"></div>

            <div className="container-custom">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    {/* Content */}
                    <div className="lg:w-1/2 text-center lg:text-left space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100/50 text-[#1152d4] text-[13px] font-bold uppercase tracking-wider">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1152d4] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1152d4]"></span>
                            </span>
                            N°1 POUR LES AFRIQUE DE L'OUEST
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight text-[#111318]">
                            Dominez le <br />
                            <span className="gradient-text">Flow</span> de <br />
                            TikTok.
                        </h1>

                        <p className="text-lg md:text-xl text-slate-500 font-medium max-w-xl leading-relaxed">
                            Rechargez vos coins instantanément avec Wave, Flooz et TMoney. Pas de carte bancaire, pas d'attente.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start pt-4">
                            <Link href="/sign-up" className="btn-primary w-full sm:w-auto h-14 px-10 text-lg">
                                Acheter maintenant
                                <ShoppingCart size={20} />
                            </Link>

                            <div className="flex flex-col items-center lg:items-start gap-1">
                                <div className="flex items-center gap-1 text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={16} fill="currentColor" />
                                    ))}
                                    <span className="ml-2 text-slate-900 font-bold">4.9/5</span>
                                </div>
                                <p className="text-[13px] text-slate-400 font-bold uppercase tracking-wide">10K+ AVIS POSITIFS</p>
                            </div>
                        </div>
                    </div>

                    {/* Visual Mockup */}
                    <div className="lg:w-1/2 relative">
                        <div className="relative z-10 mx-auto w-full max-w-[420px]">
                            {/* Phone Frame Simulation */}
                            <div className="relative aspect-[9/18.5] bg-slate-900 rounded-[3rem] p-3 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border-[8px] border-slate-800 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900"></div>
                                
                                {/* Content Inside Phone */}
                                <div className="relative h-full w-full bg-white rounded-[2.2rem] overflow-hidden p-6 flex flex-col items-center">
                                    <div className="w-20 h-1.5 bg-slate-100 rounded-full mb-10"></div>
                                    <h3 className="text-xl font-black mb-8">Recharge</h3>
                                    
                                    {/* Coins Illustration */}
                                    <div className="relative w-full aspect-square flex items-center justify-center">
                                        <div className="absolute inset-0 bg-blue-50/50 rounded-full scale-75 blur-2xl"></div>
                                        <div className="relative z-10 flex flex-col items-center">
                                            <div className="size-24 rounded-full bg-yellow-400/10 flex items-center justify-center mb-4">
                                                <Currency size={48} className="text-yellow-500" />
                                            </div>
                                            {/* Falling coins simulation */}
                                            <div className="flex gap-2">
                                                {[...Array(3)].map((_, i) => (
                                                    <div key={i} className="size-10 rounded-full bg-yellow-400/20 flex items-center justify-center text-yellow-600 font-bold shadow-sm">
                                                        $
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Phone Bubbles */}
                                    <div className="absolute top-10 right-[-10px] bg-white p-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-50 animate-bounce">
                                        <div className="bg-yellow-400 p-2 rounded-full text-white"><Currency size={14} /></div>
                                        <div>
                                            <p className="text-[8px] text-slate-400 font-bold uppercase">Reçu</p>
                                            <p className="text-[12px] font-black">+ 10,000 Coins</p>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-20 left-[-10px] bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-50">
                                        <div className="bg-blue-500 p-2 rounded-full text-white"><Smartphone size={14} /></div>
                                        <p className="text-[11px] font-bold">Paiement Approuvé</p>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative elements behind phone */}
                            <div className="absolute -inset-4 bg-gradient-to-tr from-[#1152d4] to-[#702bff] rounded-[4rem] opacity-20 blur-3xl -z-10 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
