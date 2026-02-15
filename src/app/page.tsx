import Link from 'next/link';
import { Currency } from 'lucide-react';
import { Hero } from '@/components/Hero';
import { StatsBanner } from '@/components/StatsBanner';

export default function HomePage() {
  return (
    <div className="bg-[#f6f6f8] text-[#111318] min-h-screen flex flex-col antialiased">
      {/* Navigation - Could be extracted to a layout or NavBar component too */}
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 md:px-10 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#1152d4]">
            <div className="size-8 flex items-center justify-center rounded-lg bg-blue-50">
              <Currency size={20} />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-gray-900">TikFlow</h2>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/" className="hover:text-[#1152d4]">Accueil</Link>
            <Link href="#tarifs" className="hover:text-[#1152d4]">Tarifs</Link>
            <Link href="#support" className="hover:text-[#1152d4]">Support</Link>
          </div>

          <div className="flex gap-3">
            <Link href="/sign-in" className="hidden sm:flex items-center px-4 h-10 text-sm font-bold rounded-lg border border-gray-200 hover:bg-gray-50">
              Se connecter
            </Link>
            <Link href="/sign-up" className="flex items-center px-4 h-10 bg-[#1152d4] text-white text-sm font-bold rounded-lg shadow-lg shadow-blue-200 hover:bg-blue-700">
              Créer un compte
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Hero />
        <StatsBanner />
      </main>

      {/* Footer minimal pour le test */}
      <footer className="py-10 text-center text-gray-400 text-sm border-t border-gray-100">
        © 2024 TikFlow Africa. Tous droits réservés.
      </footer>
    </div>
  );
}