'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Currency } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

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
            ? 'bg-background/80 backdrop-blur-xl border-b border-glass-border py-3 shadow-sm' 
            : 'bg-transparent py-5'
        }`}>
            <div className="container-v2 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="size-9 flex items-center justify-center rounded-lg bg-tikflow-primary text-white font-black transition-transform group-hover:scale-110">
                        T
                    </div>
                    <span className="text-xl font-bold tracking-tight text-foreground uppercase">
                        TikFlow
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-12">
                    <Link href="/marche" className="text-[14px] font-bold text-tikflow-slate hover:text-tikflow-primary uppercase tracking-wider transition-colors">Marché</Link>
                    <Link href="/communaute" className="text-[14px] font-bold text-tikflow-slate hover:text-tikflow-primary uppercase tracking-wider transition-colors">Communauté</Link>
                    <Link href="/faq" className="text-[14px] font-bold text-tikflow-slate hover:text-tikflow-primary uppercase tracking-wider transition-colors">FAQ</Link>
                    <Link href="/support" className="text-[14px] font-bold text-tikflow-slate hover:text-tikflow-primary uppercase tracking-wider transition-colors">Support</Link>
                </div>

                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <Link href="/sign-in" className="hidden sm:block text-[14px] font-semibold text-foreground hover:opacity-70 px-4">
                        Connexion
                    </Link>
                    <Link href="/sign-up" className="btn-v2-primary py-2.5 px-6">
                        S'inscrire
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
