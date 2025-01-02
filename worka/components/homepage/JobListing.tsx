'use client'
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

export default function JobListing() {
    const [featuredJobs, setFeaturedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef(null);

    // Fetch featured jobs from the backend
    useEffect(() => {
        const fetchFeaturedJobs = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/jobs?featured=true");
                const data = await response.json();
                setFeaturedJobs(data);
                console.log(data)
                setLoading(false);
            } catch (error) {
                console.error("Error fetching jobs:", error);
                setLoading(false);
            }
        };
        fetchFeaturedJobs();
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
                <p className="text-lg text-gray-700 dark:text-white">Loading job listings...</p>
            </div>
        );
    }

    return (
        <section className="py-16 px-6 container mx-auto relative">
            <h2 className="text-5xl font-extrabold text-center text-gray-900 dark:text-white tracking-tight">
                Featured Job Offers
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
                    {featuredJobs.map((job) => (
                        <div
                            key={job.id}
                            className="flex-none w-80 snap-center bg-white/30 dark:bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105"
                        >
                            <div className="flex items-center justify-center mb-6">
                                <Image
                                    src={job.logo ? `/company_logos/${job.logo}` : '/default-logo.svg'}
                                    alt={job.company_name || "Company"}
                                    width={60}
                                    height={60}
                                    className="rounded-full"
                                />
                                <div className="ml-6 text-left">
                                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                        {job.title}
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        {job.company_name || "Unknown Company"}
                                    </p>
                                </div>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">
                                📍 {job.location}
                            </p>
                            <a
                                href={`/jobs/${job.id}`}
                                className="inline-block mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition"
                            >
                                Apply Now
                            </a>
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
        </section>
    );
}
