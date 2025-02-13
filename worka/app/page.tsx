'use client'
import CallToAction from "@/components/homepage/CallToAction";
import Footer from "@/components/homepage/Footer";
import HeroSection from "@/components/homepage/Hero";
import Navbar from "@/components/homepage/Navbar";
import OpenedLettersRow from "@/components/homepage/OpenedLetters";
import PlansSection from "@/components/homepage/PlansSection";
import TalentiaveSummary from "@/components/homepage/Summary";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-talentia dark:bg-gray-900">
      {/* Navbar */}
      <Navbar />

      {/* Main Content Wrapper - Pushes Footer Down */}
      <div className="flex-grow">
        {/* Hero Section */}
        <HeroSection />
        <OpenedLettersRow />
        <TalentiaveSummary />
        {/* Plans Section */}
        {/* <PlansSection /> */}
        {/* Call to Action Section */}
        <CallToAction />
      </div>

      {/* Footer - Always Stays at Bottom */}
      <Footer />
    </div>
  );
}
