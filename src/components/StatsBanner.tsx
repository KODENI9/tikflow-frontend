// src/components/StatsBanner.tsx

export const StatsBanner = () => {
    return (
        <section className="bg-white border-y border-gray-100 py-10">
            <div className="max-w-[1200px] mx-auto px-4 flex justify-around text-center">
                <div>
                    <p className="text-3xl font-black text-[#1152d4]">10K+</p>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Clients</p>
                </div>
                <div>
                    <p className="text-3xl font-black text-[#1152d4]">2 min</p>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Délai</p>
                </div>
                <div>
                    <p className="text-3xl font-black text-[#1152d4]">100%</p>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Sécurisé</p>
                </div>
            </div>
        </section>
    );
};
