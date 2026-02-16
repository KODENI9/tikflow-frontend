'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Currency } from 'lucide-react';

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
            ? 'bg-white/90 backdrop-blur-xl border-b border-slate-100 py-3 shadow-sm' 
            : 'bg-transparent py-6'
        }`}>
            <div className="container-v2 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="size-9 flex items-center justify-center rounded-lg bg-tikflow-dark text-white font-bold transition-transform group-hover:scale-105">
                        T
                    </div>
                    <span className="text-xl font-bold tracking-tight text-tikflow-dark uppercase">
                        TikFlow
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-12">
                    <Link href="/pricing" className="text-[14px] font-semibold text-tikflow-slate hover:text-tikflow-dark transition-colors">Pricing</Link>
                    <Link href="/developers" className="text-[14px] font-semibold text-tikflow-slate hover:text-tikflow-dark transition-colors">Developers</Link>
                    <Link href="/company" className="text-[14px] font-semibold text-tikflow-slate hover:text-tikflow-dark transition-colors">Company</Link>
                    <Link href="/support" className="text-[14px] font-semibold text-tikflow-slate hover:text-tikflow-dark transition-colors">Support</Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/sign-in" className="hidden sm:block text-[14px] font-semibold text-tikflow-dark hover:opacity-70 px-4">
                        Login
                    </Link>
                    <Link href="/sign-up" className="btn-v2-primary py-2.5 px-6">
                        Get Started
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
