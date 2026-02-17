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
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground uppercase">
                        Paroles de <span className="text-tikflow-primary">Créateurs</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((review, index) => (
                        <div key={index} className="card-v2 p-10 rounded-[2.5rem] space-y-6 flex flex-col items-start bg-foreground/[0.02] dark:bg-white/[0.02] border-none hover:bg-tikflow-primary/5 transition-all duration-500">
                            <div className="flex items-center gap-4 w-full">
                                <div className="size-14 rounded-2xl bg-tikflow-primary/10 flex items-center justify-center font-black text-tikflow-primary">
                                    {review.avatar}
                                </div>
                                <div className="text-left">
                                    <p className="font-black text-foreground text-lg leading-tight uppercase tracking-tight">{review.name}</p>
                                    <p className="text-[10px] font-black text-tikflow-slate uppercase tracking-widest">{review.location}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-1 text-tikflow-secondary w-full justify-start">
                                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                            </div>

                            <p className="text-tikflow-slate font-bold italic leading-relaxed text-sm">
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
