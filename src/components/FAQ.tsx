'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ = () => {
    const faqs = [
        {
            question: "Comment acheter mes coins ?",
            answer: "Il suffit de vous inscrire, de choisir votre pack et de payer par Wave, MTN, Flooz ou Orange Money. Les coins sont crédités automatiquement."
        },
        {
            question: "Quel est le délai de livraison ?",
            answer: "La livraison est quasi instantanée. En moyenne, cela prend moins de 60 secondes après validation du paiement."
        },
        {
            question: "Est-ce que c'est sécurisé ?",
            answer: "Absolument. Nous utilisons des protocoles de chiffrement de pointe et nous ne stockons jamais vos informations de paiement sensibles."
        }
    ];

    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section id="faq" className="py-24 bg-background">
            <div className="container-v2">
                <div className="text-center mb-16 space-y-4">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-black tracking-tight text-foreground"
                    >
                        Des questions ?
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-tikflow-gray-medium font-medium"
                    >
                        Tout ce que vous devez savoir pour commencer.
                    </motion.p>
                </div>

                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div 
                            key={index} 
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${openIndex === index ? 'border-tikflow-secondary shadow-md' : 'border-tikflow-gray-light shadow-sm hover:border-tikflow-secondary/50'}`}
                        >
                            <button 
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                            >
                                <span className={`font-bold transition-colors ${openIndex === index ? 'text-tikflow-secondary' : 'text-foreground'}`}>
                                    {faq.question}
                                </span>
                                <motion.div 
                                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                    className={`transition-colors ${openIndex === index ? 'text-tikflow-secondary' : 'text-tikflow-gray-medium'}`}
                                >
                                    <ChevronDown size={20} />
                                </motion.div>
                            </button>
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="px-6 text-tikflow-gray-dark font-medium leading-relaxed"
                                    >
                                        <div className="pb-6">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
