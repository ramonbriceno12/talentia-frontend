'use client'
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

export default function FeaturedCompanies() {
    const [featuredCompanies, setFeaturedCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef(null);

    // Fetch featured companies from the backend
    useEffect(() => {
        const fetchFeaturedCompanies = async () => {
            try {
                const response = await fetch("https://talentiave.com/api/api/companies?featured=true");
                const data = await response.json();
                setFeaturedCompanies(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching companies:", error);
                setLoading(false);
            }
        };
        fetchFeaturedCompanies();
    }, []);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-lg text-gray-700 dark:text-white">Loading featured companies...</p>
            </div>
        );
    }

    return (
        <section className="py-16 bg-talentia relative">
            <div className="container mx-auto px-6">
                <h2 className="text-5xl font-extrabold text-center text-gray-900 dark:text-white tracking-tight">
                    Top Hiring Companies
                </h2>

                <div className="relative mt-12 overflow-hidden">
                    {/* Left Arrow */}
                    <button
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-gray-800 to-gray-600 text-white p-4 rounded-full z-10 shadow-2xl hover:scale-110 transition"
                        onClick={() => scroll("left")}
                        aria-label="Scroll left"
                    >
                        ←
                    </button>

                    {/* Scrollable Content */}
                    <div
                        ref={scrollRef}
                        className="flex space-x-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                    >
                        {featuredCompanies.map((company) => (
                            <div
                                key={company.id}
                                className="flex-none w-80 snap-center bg-white/20 dark:bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 text-center"
                            >
                                <div className="flex justify-center items-center mb-6">
                                    {/* <Image
                                        src={company.logo || '/default-logo.svg'}  // Fallback to default logo
                                        alt={company.name}
                                        width={80}
                                        height={80}
                                        className="rounded-lg border-4 border-indigo-400 dark:border-indigo-600"
                                    /> */}
                                </div>
                                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                    {company.name}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    {company.description.substring(0, 50)}...
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                                    📍 {company.location}
                                </p>
                                <button className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition">
                                    View Openings
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Right Arrow */}
                    <button
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-l from-gray-800 to-gray-600 text-white p-4 rounded-full z-10 shadow-2xl hover:scale-110 transition"
                        onClick={() => scroll("right")}
                        aria-label="Scroll right"
                    >
                        →
                    </button>
                </div>
            </div>
        </section>
    );
}
