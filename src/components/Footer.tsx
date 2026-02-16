'use client';

import React from 'react';
import { Currency, Globe, Instagram, Facebook } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="pt-24 pb-12 bg-white border-t border-slate-100">
            <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2.5">
                            <div className="size-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-[#1152d4] to-[#702bff] text-white">
                                <Currency size={18} />
                            </div>
                            <span className="text-xl font-black tracking-tight text-[#111318]">TikFlow.</span>
                        </div>
                        <p className="text-slate-500 font-medium leading-relaxed max-w-[240px]">
                            Le n°1 pour les TikTokers de Côte d'Ivoire, Sénégal et Togo.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-[#1152d4] transition-colors"><Globe size={18} /></a>
                            <a href="#" className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-[#1152d4] transition-colors"><Instagram size={18} /></a>
                            <a href="#" className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-[#1152d4] transition-colors"><Facebook size={18} /></a>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-[14px] font-black uppercase tracking-widest text-[#111318]">Navigation</h4>
                        <ul className="space-y-4">
                            <li><Link href="/" className="text-slate-500 font-medium hover:text-[#1152d4] transition-colors">Acheter des Coins</Link></li>
                            <li><Link href="#" className="text-slate-500 font-medium hover:text-[#1152d4] transition-colors">Devenir Partenaire</Link></li>
                            <li><Link href="#" className="text-slate-500 font-medium hover:text-[#1152d4] transition-colors">Tarifs Influenceurs</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-[14px] font-black uppercase tracking-widest text-[#111318]">Légal</h4>
                        <ul className="space-y-4">
                            <li><Link href="#" className="text-slate-500 font-medium hover:text-[#1152d4] transition-colors">Conditions Générales</Link></li>
                            <li><Link href="#" className="text-slate-500 font-medium hover:text-[#1152d4] transition-colors">Confidentialité</Link></li>
                            <li><Link href="#" className="text-slate-500 font-medium hover:text-[#1152d4] transition-colors">Mentions Légales</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-[14px] font-black uppercase tracking-widest text-[#111318]">Contact</h4>
                        <ul className="space-y-4 text-slate-500 font-medium">
                            <li className="flex items-start gap-3 italic">
                                Lomé, Togo. Quartier Administratif.
                            </li>
                            <li>hello@tikflow.africa</li>
                            <li>+228 90 00 00 00</li>
                        </ul>
                    </div>
                </div>

                <div className="pt-12 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">
                        © 2024 TIKFLOW TECHNOLOGIES. TOUS DROITS RÉSERVÉS.
                    </p>
                    <div className="flex gap-4 grayscale opacity-40">
                        {/* payment placeholder logos */}
                        <div className="h-6 w-10 bg-slate-200 rounded"></div>
                        <div className="h-6 w-10 bg-slate-200 rounded"></div>
                        <div className="h-6 w-10 bg-slate-200 rounded"></div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
