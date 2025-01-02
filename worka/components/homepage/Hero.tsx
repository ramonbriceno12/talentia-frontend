import { useState, useEffect } from "react";
import TypingEffect from "./HeroText";

export default function HeroSection() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState("all");
    const [jobs, setJobs] = useState([]);
    const [filteredResults, setFilteredResults] = useState({
        jobs: [],
        talents: [],
        companies: [],
    });

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/jobs");
                const data = await response.json();
                setJobs(data);
                setFilteredResults((prev) => ({ ...prev, jobs: data }));
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        };
        fetchJobs();
    }, []);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        setSidebarOpen(true);
        setActiveCategory("jobs");

        const filteredJobs = jobs.filter((job) =>
            job.title.toLowerCase().includes(query)
        );

        setFilteredResults((prev) => ({
            ...prev,
            jobs: filteredJobs,
        }));
    };

    const filterByCategory = (category) => {
        setActiveCategory(category);
        setSidebarOpen(true);

        if (category === "jobs") {
            setFilteredResults((prev) => ({ ...prev, jobs }));
        } else {
            setFilteredResults((prev) => ({
                ...prev,
                [category]: prev[category] || [],
            }));
        }
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
        setSearchQuery("");
    };

    return (
        <section className="relative w-full min-h-[700px] flex items-center bg-gray-50 text-gray-900">
            <div className="container mx-auto px-6 flex items-center justify-between relative z-10">
                <div className="max-w-3xl text-left">
                    {/* Fixed Height for Typing Effect */}
                    <div className="h-[200px] flex items-center justify-start mb-6">
                        <TypingEffect />
                    </div>

                    <p className="mt-6 text-lg">
                        Nuestra IA te conecta con candidatos de alta calidad, pre-evaluados y listos para unirse a tu equipo en tiempo récord ✨
                    </p>

                    {/* Search Bar */}
                    <div className="mt-10 flex relative">
                        <div className="relative w-full sm:w-[70%]">
                            <input
                                type="text"
                                placeholder="Buscar trabajos, talentos, empresas..."
                                className="w-full p-4 pr-12 rounded-lg bg-gray-200 placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                            <button
                                className="absolute inset-y-0 right-0 flex items-center justify-center px-6 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 transition"
                            >
                                🔍
                            </button>
                        </div>
                    </div>

                    {/* Quick Access Buttons */}
                    <div className="mt-12 flex space-x-6">
                        {[
                            { label: "Jobs", icon: "💼", category: "jobs" },
                            { label: "Talents", icon: "🧑‍💻", category: "talents" },
                            { label: "Companies", icon: "🏢", category: "companies" },
                        ].map((item, index) => (
                            <button
                                key={index}
                                className="w-[160px] h-[55px] bg-gray-800 text-white rounded-lg flex items-center justify-center space-x-3 hover:bg-gray-700 transition"
                                onClick={() => filterByCategory(item.category)}
                            >
                                <span className="text-2xl">{item.icon}</span>
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Background Image on the Right */}
                <div className="absolute inset-y-0 right-0 w-1/2 hidden lg:block">
                    <img
                        src="/img/hero-background.png"
                        alt="Background"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={closeSidebar}
                ></div>
            )}

            {/* Sidebar for Filtered Results */}
            <div
                className={`fixed top-0 right-0 h-full w-[400px] bg-white dark:bg-gray-800 shadow-2xl z-50 transform ${isSidebarOpen ? "translate-x-0" : "translate-x-full"
                    } transition-transform duration-300 ease-in-out`}
            >
                <div className="p-6 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-3xl font-bold text-white">
                            🔎 Resultados
                        </h2>
                        <button
                            onClick={closeSidebar}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✖
                        </button>
                    </div>

                    <div className="overflow-y-auto flex-grow space-y-8">
                        <div>
                            <h3 className="text-2xl font-semibold mb-4 text-white">
                                {activeCategory === "jobs" && "💼 Jobs"}
                                {activeCategory === "talents" && "🧑‍💻 Talents"}
                                {activeCategory === "companies" && "🏢 Companies"}
                            </h3>
                            <ul className="space-y-3 pb-2">
                                {(filteredResults[activeCategory] || []).length > 0 ? (
                                    filteredResults[activeCategory].map((item, index) => (
                                        <li
                                            key={index}
                                            className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm flex justify-between items-center"
                                        >
                                            <div>
                                                <h4 className="font-semibold text-lg text-white">
                                                    {item.title || item.name}
                                                </h4>
                                                <p className="text-white">
                                                    {item.location || item.description || ""}
                                                </p>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <p className="text-gray-400 italic">No se encontraron resultados.</p>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
