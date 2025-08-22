import React, { useState } from "react";
import { LoginModal } from "@/components/LoginModal";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/sections/HeroSection";
import ValueProposition from "@/components/home/sections/ValueProposition";
import Features from "@/components/home/sections/Features";
import Stats from "@/components/home/sections/Stats";
import Testimonials from "@/components/home/sections/Testimonials";
import AboutSection from "@/components/home/sections/AboutSection";
import FAQ from "@/components/home/sections/FAQ";
import ContactSection from "@/components/home/sections/ContactSection";
import FinalCTA from "@/components/home/sections/FinalCTA";

export default function Index() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      <main>
        <HeroSection />
        <ValueProposition />
        <Features />
        <Stats />
        <Testimonials />
        <AboutSection />
        <FAQ />
        <ContactSection />
        <FinalCTA />
      </main>

      <Footer />
      
      <LoginModal 
        open={isLoginModalOpen} 
        onOpenChange={setIsLoginModalOpen} 
      />
      <CookieConsentBanner />
    </div>
  );
}
