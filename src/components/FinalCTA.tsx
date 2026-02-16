'use client';

import React from 'react';

const FinalCTA = () => {
    return (
        <section className="py-24">
            <div className="container-custom">
                <div className="bg-gradient-to-br from-white to-slate-50 rounded-[3rem] p-12 md:p-24 border border-slate-100 shadow-2xl relative overflow-hidden text-center space-y-8">
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/30 blur-3xl -z-10 rounded-full"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100/30 blur-3xl -z-10 rounded-full"></div>

                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter">
                        Join the <span className="gradient-text">Flow.</span>
                    </h2>
                    <p className="text-lg md:text-xl text-slate-500 font-medium max-w-xl mx-auto">
                        Rejoignez 10,000+ créateurs africains et ne manquez plus jamais de coins pendant vos lives.
                    </p>

                    <div className="max-w-xl mx-auto flex flex-col sm:flex-row gap-4 pt-4">
                        <input 
                            type="email" 
                            placeholder="votre@email.com" 
                            className="flex-1 h-14 px-6 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                        />
                        <button className="h-14 px-10 bg-slate-900 text-white font-black rounded-2xl hover:bg-black transition-all active:scale-95 whitespace-nowrap">
                            Rejoindre
                        </button>
                    </div>

                    <p className="text-[12px] text-slate-400 font-bold uppercase tracking-widest pt-4">
                        SANS ENGAGEMENT — DÉLABREMENT FACILE
                    </p>
                </div>
            </div>
        </section>
    );
};

export default FinalCTA;
