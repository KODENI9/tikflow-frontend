'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/Button';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const { isSignedIn } = useAuth();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass-nav py-4' : 'bg-transparent py-6'}`}>
            <div className="container-v2 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="size-11 flex items-center justify-center rounded-2xl bg-gradient-logo shadow-lg shadow-[#FF512F]/20 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
                        <span className="text-white font-black text-2xl drop-shadow-md">T</span>
                    </div>
                    <span className="text-2xl font-black tracking-tight text-white uppercase group-hover:opacity-90 transition-opacity">
                        TikFlow
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-10">
                    <Link href="/" className="text-[15px] font-bold text-tikflow-gray-dark hover:text-white transition-colors">Marché</Link>
                    <Link href="/" className="text-[15px] font-bold text-tikflow-gray-dark hover:text-white transition-colors">Communauté</Link>
                    <Link href="/#faq" className="text-[15px] font-bold text-tikflow-gray-dark hover:text-white transition-colors">FAQ</Link>
                    <Link href="/dashboard/help" className="text-[15px] font-bold text-tikflow-gray-dark hover:text-white transition-colors">Support</Link>
                </div>

                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    {isSignedIn ? (
                        <Link href="/dashboard">
                            <Button variant="primary">Mon Espace</Button>
                        </Link>
                    ) : (
                        <>
                            <Link href="/sign-in" className="hidden sm:block">
                                <Button variant="ghost">Connexion</Button>
                            </Link>
                            <Link href="/sign-up">
                                <Button variant="primary">S'inscrire</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
