'use client';

import React from 'react';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="py-24 bg-background border-t border-glass-border">
            <div className="container-v2 text-center md:text-left">
                <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-24">
                    <div className="max-w-xs space-y-6">
                        <div className="flex items-center gap-2">
                             <div className="size-8 flex items-center justify-center rounded-lg bg-tikflow-dark text-white dark:text-tikflow-dark dark:bg-white font-bold">T</div>
                             <span className="text-xl font-bold tracking-tight text-tikflow-dark uppercase">TikFlow</span>
                        </div>
                        <p className="text-tikflow-slate font-medium leading-relaxed">
                            The infrastructure for TikTok creators in Africa. Empowering live-streamers with instant liquidity.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
                        <div className="space-y-6">
                            <h4 className="text-[13px] font-bold uppercase tracking-widest text-tikflow-dark">Product</h4>
                            <ul className="space-y-4">
                                <li><Link href="#" className="text-tikflow-slate font-medium hover:text-tikflow-dark">Pricing</Link></li>
                                <li><Link href="#" className="text-tikflow-slate font-medium hover:text-tikflow-dark">API</Link></li>
                                <li><Link href="#" className="text-tikflow-slate font-medium hover:text-tikflow-dark">Support</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h4 className="text-[13px] font-bold uppercase tracking-widest text-tikflow-dark">Legal</h4>
                            <ul className="space-y-4">
                                <li><Link href="#" className="text-tikflow-slate font-medium hover:text-tikflow-dark">Terms</Link></li>
                                <li><Link href="#" className="text-tikflow-slate font-medium hover:text-tikflow-dark">Privacy</Link></li>
                                <li><Link href="#" className="text-tikflow-slate font-medium hover:text-tikflow-dark">License</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-6 col-span-2 md:col-span-1">
                            <h4 className="text-[13px] font-bold uppercase tracking-widest text-tikflow-dark">Contact</h4>
                            <p className="text-tikflow-slate font-medium">hello@tikflow.africa</p>
                        </div>
                    </div>
                </div>

                <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                        © 2024 TIKFLOW TECHNOLOGIES. BUILT FOR AFRICA.
                    </p>
                    <div className="flex gap-8 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                        <a href="#" className="hover:text-tikflow-dark">Twitter</a>
                        <a href="#" className="hover:text-tikflow-dark">Instagram</a>
                        <a href="#" className="hover:text-tikflow-dark">LinkedIn</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
