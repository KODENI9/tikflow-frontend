'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShoppingCart } from 'lucide-react';

export const Hero = () => {
    return (
        <section className="relative pt-40 pb-24 md:pt-56 md:pb-40 overflow-hidden bg-white dark:bg-tikflow-dark">
            <div className="container-v2">
                <div className="max-w-4xl mx-auto text-center space-y-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-[12px] font-semibold text-tikflow-slate tracking-wide">
                        <span className="flex size-1.5 rounded-full bg-tikflow-accent"></span>
                        Now live across West Africa
                    </div>

                    <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-tikflow-dark leading-[0.95]">
                        The future of <br />
                        <span className="italic font-serif">TikTok economy</span> <br />
                        in Africa.
                    </h1>

                    <p className="text-xl md:text-2xl text-tikflow-slate max-w-2xl mx-auto leading-relaxed font-medium">
                        Instant TikTok coin recharges designed for the next generation of African creators. Secure, local, and lightning fast.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link href="/sign-up" className="btn-v2-primary h-14 px-10 text-lg sm:w-auto w-full">
                            Create Account
                            <ArrowRight size={20} />
                        </Link>
                        <Link href="/pricing" className="btn-v2-outline h-14 px-10 text-lg sm:w-auto w-full">
                            View Pricing
                        </Link>
                    </div>

                    <div className="pt-12 flex items-center justify-center gap-12 text-slate-300 grayscale opacity-50">
                        {/* Placeholder for payment logos */}
                        <span className="font-black text-2xl tracking-tighter">WAVE</span>
                        <span className="font-black text-2xl tracking-tighter">ORANGE</span>
                        <span className="font-black text-2xl tracking-tighter">MOOV</span>
                        <span className="font-black text-2xl tracking-tighter">FLOOZ</span>
                    </div>
                </div>
            </div>
            
            {/* Minimalist Background Detail */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent"></div>
        </section>
    );
};
