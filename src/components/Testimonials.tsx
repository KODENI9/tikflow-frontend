'use client';

import React from 'react';
import { Star } from 'lucide-react';

const Testimonials = () => {
    const reviews = [
        {
            name: "Cédric E.",
            location: "Abidjan, Côte d'Ivoire",
            text: "C'est juste incroyable. Je recharge en plein live et les coins sont déjà là avant même que j'ai fini de parler. TikFlow est mon nouveau meilleur ami.",
            avatar: "CE"
        },
        {
            name: "Jean D.",
            location: "Dakar, Sénégal",
            text: "Le service client est au top. J'avais fait une erreur d'ID et ils ont réglé ça via WhatsApp en 2 min chrono.",
            avatar: "JD"
        },
        {
            name: "Ibrahim B.",
            location: "Lomé, Togo",
            text: "Enfin plus besoin de mendier des cartes Visa à l'étranger. TikFlow nous libère l'accès aux coins.",
            avatar: "IB"
        }
    ];

    return (
        <section className="py-24 bg-background">
            <div className="container-v2">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
                        Paroles de <span className="gradient-text">Créateurs</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((review, index) => (
                        <div key={index} className="card-v2 p-10 rounded-[2.5rem] space-y-6 flex flex-col items-center text-center">
                            <div className="flex items-center gap-4 w-full">
                                <div className="size-14 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-400">
                                    {review.avatar}
                                </div>
                                <div className="text-left">
                                    <p className="font-black text-[#111318] text-lg leading-tight">{review.name}</p>
                                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">{review.location}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-1 text-yellow-400 w-full justify-start">
                                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                            </div>

                            <p className="text-slate-600 font-medium italic leading-relaxed text-left flex-1">
                                "{review.text}"
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
