'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Home, HelpCircle } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
            {/* Background Decorative element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-slate-50 dark:bg-slate-900/10 rounded-full blur-[120px] -z-10"></div>
            
            <div className="max-w-xl w-full space-y-12">
                <div className="space-y-4">
                    <p className="text-[12px] font-bold uppercase tracking-[0.4em] text-tikflow-slate">Error 404</p>
                    <h1 className="text-8xl md:text-9xl font-black tracking-tight text-tikflow-dark">
                        Lost in <br />
                        the <span className="italic font-serif">flow</span>.
                    </h1>
                </div>

                <div className="space-y-6">
                    <p className="text-xl text-tikflow-slate font-medium leading-relaxed">
                        The page you are looking for doesn't exist or has been moved. Let's get you back to the right path.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link href="/" className="btn-v2-primary h-14 px-10 text-lg w-full sm:w-auto">
                            <Home size={20} />
                            Go to Homepage
                        </Link>
                        <Link href="/support" className="btn-v2-outline h-14 px-10 text-lg w-full sm:w-auto">
                            <HelpCircle size={20} />
                            Contact Support
                        </Link>
                    </div>
                </div>

                <div className="pt-12">
                    <button 
                        onClick={() => window.history.back()} 
                        className="inline-flex items-center gap-2 text-sm font-bold text-tikflow-slate hover:text-tikflow-dark transition-colors uppercase tracking-widest"
                    >
                        <ArrowLeft size={16} />
                        Go Back
                    </button>
                </div>
            </div>

            {/* Subtle Footer for 404 */}
            <div className="absolute bottom-12 flex items-center gap-2">
                <div className="size-6 flex items-center justify-center rounded bg-tikflow-dark text-white text-[10px] font-bold">T</div>
                <span className="text-xs font-bold tracking-tight text-slate-300 uppercase">TikFlow</span>
            </div>
        </div>
    );
}
