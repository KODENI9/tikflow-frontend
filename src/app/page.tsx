import TopBanner from '@/components/TopBanner';
import Navbar from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { StatsBanner } from '@/components/StatsBanner';
import ValueProps from '@/components/ValueProps';
import SecuritySection from '@/components/SecuritySection';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBanner />
      <Navbar />
      
      <main className="flex-1">
        <Hero />
        <StatsBanner />
        <ValueProps />
        <SecuritySection />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
}