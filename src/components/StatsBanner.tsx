'use client';

import React from 'react';

export const StatsBanner = () => {
    const stats = [
        { label: "Utilisateurs Actifs", value: "10K+", color: "text-[#1152d4]" },
        { label: "Coins Livrés", value: "500K+", color: "text-[#702bff]" },
        { label: "Note Moyenne", value: "4.9/5", color: "text-[#1152d4]" },
    ];

    return (
        <section className="pb-16 md:pb-32">
            <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center space-y-2">
                            <p className={`text-5xl md:text-6xl font-black ${stat.color} tracking-tight`}>
                                {stat.value}
                            </p>
                            <p className="text-[13px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
