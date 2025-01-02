'use client'
import Image from "next/image";
import Hero from "@/components/homepage/Hero";
import JobListing from "@/components/homepage/JobListing";
import FeaturedWorkers from "@/components/homepage/FeaturedWorkers";
import CallToAction from "@/components/homepage/CallToAction";
import Footer from "@/components/homepage/Footer";
import Navbar from "@/components/homepage/Navbar";
import FeaturedCompanies from "@/components/homepage/FeaturedCompanies";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Job Listings Section */}
      <JobListing />

      {/* Featured Companies Section */}
      <FeaturedCompanies />
      
      {/* Featured Workers Section */}
      <FeaturedWorkers />

      {/* Call to Action Section */}
      <CallToAction />

      {/* Footer */}
      <Footer />
    </div>
  );
}
