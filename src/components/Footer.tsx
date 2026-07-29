'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Footer = () => {
    return (
        <footer className="py-24 bg-white border-t border-tikflow-gray-light">
            <div className="container-v2 text-center md:text-left">
                <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-24">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-xs space-y-6"
                    >
                        <div className="flex items-center gap-3">
                             <div className="size-10 flex items-center justify-center rounded-2xl bg-tikflow-secondary text-tikflow-black font-black text-xl">T</div>
                             <span className="text-2xl font-black tracking-tight text-foreground uppercase">TikFlow</span>
                        </div>
                        <p className="text-tikflow-gray-dark font-medium leading-relaxed text-sm">
                            L'infrastructure premium pour les créateurs TikTok en Afrique. Sécurité, rapidité et élégance.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="space-y-6"
                        >
                            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-tikflow-gray-dark opacity-60">Produit</h4>
                            <ul className="space-y-4">
                                <li><Link href="/dashboard/buy" className="text-foreground font-bold text-sm tracking-wide hover:text-tikflow-secondary transition-colors">Tarifs</Link></li>
                                <li><Link href="#" className="text-foreground font-bold text-sm tracking-wide hover:text-tikflow-secondary transition-colors">API</Link></li>
                                <li><Link href="/dashboard/help" className="text-foreground font-bold text-sm tracking-wide hover:text-tikflow-secondary transition-colors">Support</Link></li>
                            </ul>
                        </motion.div>
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="space-y-6"
                        >
                            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-tikflow-gray-dark opacity-60">Légal</h4>
                            <ul className="space-y-4">
                                <li><Link href="#" className="text-foreground font-bold text-sm tracking-wide hover:text-tikflow-secondary transition-colors">Conditions</Link></li>
                                <li><Link href="#" className="text-foreground font-bold text-sm tracking-wide hover:text-tikflow-secondary transition-colors">Confidentialité</Link></li>
                                <li><Link href="#" className="text-foreground font-bold text-sm tracking-wide hover:text-tikflow-secondary transition-colors">Cookies</Link></li>
                            </ul>
                        </motion.div>
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="space-y-6 col-span-2 md:col-span-1"
                        >
                            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-tikflow-gray-dark opacity-60">Contact</h4>
                            <p className="text-foreground font-bold text-sm tracking-wide">contact@tikflow.africa</p>
                        </motion.div>
                    </div>
                </div>

                <div className="pt-12 border-t border-tikflow-gray-light flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-[10px] font-bold text-tikflow-gray-medium uppercase tracking-[0.2em]">
                        © 2026 TIKFLOW TECHNOLOGIES.
                    </p>
                    <div className="flex gap-8 text-[10px] font-bold text-tikflow-gray-medium uppercase tracking-[0.2em]">
                        <a href="#" className="hover:text-tikflow-secondary transition-colors">Twitter</a>
                        <a href="#" className="hover:text-tikflow-secondary transition-colors">Instagram</a>
                        <a href="#" className="hover:text-tikflow-secondary transition-colors">LinkedIn</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
