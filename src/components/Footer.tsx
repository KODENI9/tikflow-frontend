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
                             <div className="size-9 flex items-center justify-center rounded-lg bg-tikflow-primary text-white font-black">T</div>
                             <span className="text-xl font-black tracking-tight text-tikflow-black dark:text-white uppercase transition-colors hover:text-tikflow-primary cursor-default">TikFlow</span>
                        </div>
                        <p className="text-tikflow-slate font-bold leading-relaxed text-sm italic">
                            L'infrastructure pour les créateurs TikTok en Afrique. Offrant une liquidité instantanée pour vos lives.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
                        <div className="space-y-6">
                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-tikflow-primary">Produit</h4>
                            <ul className="space-y-4">
                                <li><Link href="/marche" className="text-tikflow-slate font-bold text-xs uppercase tracking-wider hover:text-tikflow-secondary transition-colors">Tarifs</Link></li>
                                <li><Link href="#" className="text-tikflow-slate font-bold text-xs uppercase tracking-wider hover:text-tikflow-secondary transition-colors">API</Link></li>
                                <li><Link href="/support" className="text-tikflow-slate font-bold text-xs uppercase tracking-wider hover:text-tikflow-secondary transition-colors">Support</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-tikflow-primary">Légal</h4>
                            <ul className="space-y-4">
                                <li><Link href="#" className="text-tikflow-slate font-bold text-xs uppercase tracking-wider hover:text-tikflow-secondary transition-colors">Conditions</Link></li>
                                <li><Link href="#" className="text-tikflow-slate font-bold text-xs uppercase tracking-wider hover:text-tikflow-secondary transition-colors">Confidentialité</Link></li>
                                <li><Link href="#" className="text-tikflow-slate font-bold text-xs uppercase tracking-wider hover:text-tikflow-secondary transition-colors">Cookies</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-6 col-span-2 md:col-span-1">
                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-tikflow-primary">Contact</h4>
                            <p className="text-tikflow-slate font-bold text-sm">contact@tikflow.africa</p>
                        </div>
                    </div>
                </div>

                <div className="pt-12 border-t border-slate-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-[10px] font-black text-tikflow-slate uppercase tracking-[0.2em] opacity-60">
                        © 2026 TIKFLOW TECHNOLOGIES. CONÇU POUR L'AFRIQUE.
                    </p>
                    <div className="flex gap-8 text-[10px] font-black text-tikflow-slate uppercase tracking-[0.2em] opacity-60">
                        <a href="#" className="hover:text-tikflow-primary transition-colors">Twitter</a>
                        <a href="#" className="hover:text-tikflow-primary transition-colors">Instagram</a>
                        <a href="#" className="hover:text-tikflow-primary transition-colors">LinkedIn</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
