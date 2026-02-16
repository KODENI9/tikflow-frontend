'use client';

import React from 'react';

const TrustSection = () => {
    return (
        <section className="py-32 bg-white">
            <div className="container-v2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 border-y border-slate-50 py-24">
                    <div className="space-y-4">
                        <p className="text-6xl font-black text-tikflow-dark tracking-tighter">10K+</p>
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-tikflow-slate">Active Creators</p>
                    </div>
                    <div className="space-y-4">
                        <p className="text-6xl font-black text-tikflow-dark tracking-tighter">500K+</p>
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-tikflow-slate">Coins Delivered</p>
                    </div>
                    <div className="space-y-4">
                        <p className="text-6xl font-black text-tikflow-dark tracking-tighter">99.9%</p>
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-tikflow-slate">Success Rate</p>
                    </div>
                </div>

                <div className="mt-24 max-w-4xl mx-auto bg-tikflow-dark rounded-[2.5rem] p-12 md:p-20 text-white flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 space-y-6">
                        <h2 className="text-4xl font-bold tracking-tight">Security without compromise.</h2>
                        <p className="text-slate-400 font-medium text-lg leading-relaxed">
                            We use industrial-strength encryption to protect your account and data. Every transaction is monitored 24/7.
                        </p>
                    </div>
                    <div className="size-48 rounded-full border border-slate-700 flex items-center justify-center p-8 text-center italic font-serif text-slate-400">
                        "Your safety is our core value."
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TrustSection;
