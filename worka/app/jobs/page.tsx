'use client'
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import CallToAction from "@/components/homepage/CallToAction";
import Footer from "@/components/homepage/Footer";

export default function JobListView() {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const searchParams = useSearchParams();
    
    const companyId = searchParams.get("company_id");

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            try {
                const response = await fetch("http://localhost:5000/api/jobs");
                const data = await response.json();
                
                const filtered = companyId
                    ? data.filter(job => job.company_id == companyId)
                    : data;

                setJobs(filtered);
                setFilteredJobs(filtered);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching jobs:", error);
                setLoading(false);
            }
        };
        fetchJobs();
    }, [companyId]);

    const filterJobs = (query) => {
        const filtered = jobs.filter((job) =>
            job.title.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredJobs(filtered);
    };

    const debounce = (func, delay) => {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => func(...args), delay);
        };
    };

    const debouncedFilter = useCallback(debounce(filterJobs, 300), [jobs]);

    const onSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        debouncedFilter(query);
    };

    const openSidebar = (job) => {
        setSelectedJob(job);
        setSidebarOpen(true);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
        setSelectedJob(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-lg text-gray-700">Loading jobs...</p>
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-gray-50 text-gray-900 pt-16">
            <div className="mx-auto px-6 mb-12">
                <h1 className="text-4xl font-bold text-center mb-12">
                    🧑‍💻 Job Openings
                </h1>

                <div className="flex justify-center mb-12">
                    <input
                        type="text"
                        className="w-2/3 p-4 rounded-lg bg-white shadow-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        placeholder="Search for jobs..."
                        value={searchQuery}
                        onChange={onSearchChange}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {filteredJobs.map((job) => (
                        <div
                            key={job.id}
                            className="p-6 bg-white rounded-lg shadow-md flex flex-col justify-between border border-gray-200 hover:shadow-xl transition"
                        >
                            <div>
                                <h2 className="text-2xl font-semibold">{job.title}</h2>
                                <p className="text-gray-600 mt-1">
                                    {job.company_name || "Company"} - {job.location}
                                </p>
                                <p className="mt-3 text-gray-500">
                                    {job.description.substring(0, 100)}...
                                </p>

                                <div className="mt-4 flex items-center space-x-2 text-gray-500">
                                    <span className="text-2xl">📥</span>
                                    <p className="text-lg">
                                        {job.application_count} application{job.application_count !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>

                            <button
                                className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg flex items-center space-x-2 transition"
                                onClick={() => openSidebar(job)}
                            >
                                <span>🚀</span>
                                <span>Apply</span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-900">
                {/* Call to Action Section */}
                <CallToAction />

                {/* Footer */}
                <Footer />
            </div>

            {isSidebarOpen && selectedJob && (
                <div
                    className={`fixed top-0 right-0 h-full w-[400px] bg-white dark:bg-gray-800 shadow-2xl z-50 transform ${
                        isSidebarOpen ? "translate-x-0" : "translate-x-full"
                    } transition-transform duration-300 ease-in-out` }
                >
                    <div className="p-6 h-full flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-3xl font-bold text-white">
                                {selectedJob.title}
                            </h2>
                            <button
                                onClick={closeSidebar}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✖
                            </button>
                        </div>
                        <p className="mb-4 text-white text-lg">
                            {selectedJob.company_name || "Company"} - {selectedJob.location}
                        </p>
                        <p className="text-white">{selectedJob.description}</p>
                        <div className="mt-6">
                            <button
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition"
                            >
                                Submit Application
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
