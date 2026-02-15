// src/app/(auth)/layout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f6f6f8] flex flex-col font-sans antialiased">
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 bg-[#1152d4] text-white rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/30">
              <span className="font-bold">TF</span>
            </div>
            <h2 className="text-gray-900 text-xl font-bold tracking-tight">TikFlow</h2>
          </div>
          <button className="text-gray-500 hover:text-[#1152d4] transition-colors text-sm font-medium">
            Support Center
          </button>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4 py-10">
        <div className="w-full max-w-[1100px] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row min-h-[700px] border border-gray-200">
          
          {/* Section Bleue (Gauche) */}
          <div className="relative hidden lg:flex w-5/12 bg-[#1152d4] flex-col justify-between p-12 text-white overflow-hidden">
             {/* Dégradés et Patterns */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1152d4] via-[#1E60E6] to-[#0A3690]"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-semibold mb-6 uppercase">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                Live Exchange Rates
              </div>
              <h1 className="text-4xl font-extrabold leading-tight mb-4">
                Instant TikTok Coins in Africa.
              </h1>
              <p className="text-blue-100 text-lg font-medium opacity-90">
                Securely purchase coins using M-Pesa, MTN Mobile Money, and Airtel Money.
              </p>
            </div>

            {/* Illustration Smartphone */}
            <div className="relative z-10 flex items-center justify-center py-8">
                <div className="w-64 h-64 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm flex flex-col items-center justify-center shadow-2xl">
                    <div className="text-center">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">Trusted Transfer</p>
                        <div className="mt-2 flex gap-1 justify-center">
                            {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-green-400"></div>)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-10 space-y-4">
               <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-200">Supported Payments</p>
               <div className="flex gap-3">
                  <span className="px-3 py-1 bg-white text-blue-700 rounded text-[10px] font-bold">M-Pesa</span>
                  <span className="px-3 py-1 bg-yellow-400 text-black rounded text-[10px] font-bold">MTN</span>
                  <span className="px-3 py-1 bg-red-600 text-white rounded text-[10px] font-bold">Airtel</span>
               </div>
            </div>
          </div>

          {/* Section Formulaire (Droite) */}
          <div className="w-full lg:w-7/12 p-8 md:p-12 flex flex-col justify-center items-center bg-white">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}