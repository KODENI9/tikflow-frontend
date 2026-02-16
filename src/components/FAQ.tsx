'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
    const faqs = [
        {
            question: "Comment acheter mes coins ?",
            answer: "Il suffit de vous inscrire, de choisir votre forfait et de payer par Wave, Flooz ou T-Money. Les coins sont envoyés automatiquement sur votre compte TikTok."
        },
        {
            question: "Quel est le délai de livraison ?",
            answer: "La livraison est quasi instantanée. En moyenne, cela prend moins de 60 secondes après validation du paiement."
        },
        {
            question: "Est-ce que c'est sécurisé ?",
            answer: "Oui, TikFlow utilise des protocoles de chiffrement de grade bancaire. Nous ne stockons jamais vos informations de paiement sensibles."
        }
    ];

    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="py-24 bg-[#fdfdff]">
            <div className="container-custom">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight">Des questions ?</h2>
                    <p className="text-slate-500 font-medium">Tout ce que vous devez savoir pour commencer.</p>
                </div>

                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm transition-all hover:border-blue-100">
                            <button 
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-6 text-left"
                            >
                                <span className="font-bold text-[#111318]">{faq.question}</span>
                                <div className={`text-slate-400 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}>
                                    <ChevronDown size={20} />
                                </div>
                            </button>
                            {openIndex === index && (
                                <div className="px-6 pb-6 text-slate-500 font-medium leading-relaxed">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
