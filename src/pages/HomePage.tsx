import Hero from "@/components/sections/Hero";
import TrustedBy from "@/components/sections/TrustedBy";
import Features from "@/components/sections/Features";
import Stats from "@/components/sections/Stats";
import Integrations from "@/components/sections/Integrations";
import Testimonials from "@/components/sections/Testimonials";
import FinalCTA from "@/components/sections/FinalCTA";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20" />
        <div 
          aria-hidden="true"
          className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, rgba(139, 92, 246, 0.15) 1px, transparent 0)",
          backgroundSize: "48px 48px"
        }} />
      </div>

      <Hero />
      <TrustedBy />
      <Features />
      <Stats />
      <Integrations />
      <Testimonials />
      <FinalCTA />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
