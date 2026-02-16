'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Currency, ChevronRight } from 'lucide-react';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled 
            ? 'bg-white/80 backdrop-blur-lg border-b border-slate-100 py-3 shadow-sm' 
            : 'bg-transparent py-5'
        }`}>
            <div className="container-custom flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="size-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#1152d4] to-[#702bff] text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                        <Currency size={24} />
                    </div>
                    <span className="text-2xl font-black tracking-tight text-[#111318]">
                        TikFlow<span className="text-[#1152d4]">.</span>
                    </span>
                </Link>

                {/* Nav Links */}
                <div className="hidden md:flex items-center gap-10">
                    <Link href="/marche" className="text-[15px] font-bold text-slate-600 hover:text-[#1152d4] transition-colors">Marché</Link>
                    <Link href="/communaute" className="text-[15px] font-bold text-slate-600 hover:text-[#1152d4] transition-colors">Communauté</Link>
                    <Link href="/faq" className="text-[15px] font-bold text-slate-600 hover:text-[#1152d4] transition-colors">FAQ</Link>
                </div>

                {/* Auth Actions */}
                <div className="flex items-center gap-4">
                    <Link href="/sign-in" className="hidden sm:block text-[15px] font-bold text-slate-700 hover:text-slate-900 px-4">
                        Connexion
                    </Link>
                    <Link href="/sign-up" className="flex items-center justify-center h-11 px-5 bg-[#1152d4] text-white text-[15px] font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">
                        S'inscrire
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
