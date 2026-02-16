import Navbar from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import ProductShowcase from '@/components/ProductShowcase';
import TrustSection from '@/components/TrustSection';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-tikflow-dark">
      <Navbar />
      
      <main className="flex-1">
        <Hero />
        <ProductShowcase />
        <TrustSection />
        <Testimonials />
        <FAQ />
      </main>

      <Footer />
    </div>
  );
}