import React from 'react';

const TopBanner = () => {
    const items = [
        "🔥 @julien_tech vient d'acheter 1200 Coins au Togo",
        "⚡️ Vitesse éctair : Livraison en moins de 60 secondes",
        "🚀 @mariam_k vient d'acheter 5000 Coins au Bénin",
        "✅ Plus de 10,000 clients nous font confiance",
        "🔥 @leont_228 vient d'acheter 3000 Coins au Sénégal",
        "💎 Meilleur taux du marché Garanti !",
    ];

    return (
        <div className="w-full bg-[#f8f9ff] border-b border-indigo-50 py-2 overflow-hidden whitespace-nowrap hidden md:block">
            <div className="animate-marquee h-full flex items-center">
                {/* Duplicate the items for seamless loop */}
                {[...items, ...items].map((text, index) => (
                    <div key={index} className="flex items-center mx-8">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                            <span className="size-1.5 rounded-full bg-[#1152d4]"></span>
                            {text}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopBanner;
