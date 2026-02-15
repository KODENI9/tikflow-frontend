// src/components/Hero.tsx
import Link from 'next/link';
import { Currency, Smartphone } from 'lucide-react';

export const Hero = () => {
    return (
        <section className="max-w-[1200px] mx-auto px-4 py-12 md:py-24 flex flex-col-reverse lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 text-center lg:text-left space-y-6">
                <h1 className="text-4xl md:text-6xl font-black leading-tight">
                    Achetez vos <span className="text-[#1152d4]">TikTok Coins</span> facilement en Afrique
                </h1>
                <p className="text-gray-600 text-lg md:text-xl max-w-xl">
                    La solution la plus rapide et sécurisée pour recharger votre compte avec Flooz, TMoney, Wave et plus encore.
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                    <Link href="/sign-up" className="h-12 px-8 flex items-center bg-[#1152d4] text-white font-bold rounded-lg shadow-xl shadow-blue-200 hover:scale-105 transition-transform">
                        Commencer maintenant
                    </Link>
                    <button className="h-12 px-8 border border-gray-200 bg-white font-bold rounded-lg hover:bg-gray-50">
                        Voir les tarifs
                    </button>
                </div>
            </div>

            <div className="lg:w-1/2 w-full flex justify-center">
                <div className="relative w-full max-w-[500px] aspect-square bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl border border-white shadow-2xl flex items-center justify-center">
                    {/* Illustration Placeholder */}
                    <div className="absolute bottom-10 left-10 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce">
                        <div className="bg-yellow-400 p-2 rounded-full text-white"><Currency size={20} /></div>
                        <div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase">Coins reçus</p>
                            <p className="text-sm font-black">+ 5,000 Coins</p>
                        </div>
                    </div>
                    <Smartphone size={200} className="text-blue-200" />
                </div>
            </div>
        </section>
    );
};
