'use client'
import { useState, useEffect, useCallback } from "react";
import CallToAction from "@/components/homepage/CallToAction";
import Footer from "@/components/homepage/Footer";
import Navbar from "@/components/homepage/Navbar";

export default function TalentListView() {
    const [talents, setTalents] = useState([]);
    const [filteredTalents, setFilteredTalents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedTalent, setSelectedTalent] = useState(null);
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const talentsPerPage = 6;

    useEffect(() => {
        const fetchTalents = async () => {
            setLoading(true);
            try {
                const response = await fetch("http://localhost:5000/api/talents");
                const data = await response.json();

                setTalents(data);
                setFilteredTalents(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching talents:", error);
                setLoading(false);
            }
        };
        fetchTalents();
    }, []);

    const filterTalents = (query) => {
        const filtered = talents.filter((talent) =>
            talent.full_name.toLowerCase().includes(query.toLowerCase()) ||
            talent.bio.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredTalents(filtered);
        setCurrentPage(1); // Reset to first page after filtering
    };

    const debounce = (func, delay) => {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => func(...args), delay);
        };
    };

    const debouncedFilter = useCallback(debounce(filterTalents, 300), [talents]);

    const onSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        debouncedFilter(query);
    };

    const openSidebar = (talent) => {
        setSelectedTalent(talent);
        setSidebarOpen(true);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
        setSelectedTalent(null);
    };

    console.log(talents, 'AWQUIII SSDSDS')


    // Pagination Logic
    const indexOfLastTalent = currentPage * talentsPerPage;
    const indexOfFirstTalent = indexOfLastTalent - talentsPerPage;
    const currentTalents = filteredTalents.slice(indexOfFirstTalent, indexOfLastTalent);

    const totalPages = Math.ceil(filteredTalents.length / talentsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-lg text-gray-700">Loading talents...</p>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <section className="min-h-screen bg-talentia text-gray-900 mt-24">
                <div className="mx-auto px-6 mb-12">
                    <h1 className="text-4xl font-bold text-center mb-12">
                        👩‍💻 Talents
                    </h1>

                    <div className="flex justify-center mb-12">
                        <input
                            type="text"
                            className="w-2/3 p-4 rounded-lg bg-white shadow-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            placeholder="Search for talents..."
                            value={searchQuery}
                            onChange={onSearchChange}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-10xl mx-auto">
                        {currentTalents.map((talent) => (
                            <div
                                key={talent.id}
                                className="p-6 bg-white shadow-md flex flex-col justify-between border border-gray-200 hover:shadow-xl transition"
                            >
                                <div>
                                    <h2 className="text-2xl font-semibold">{talent.full_name}</h2>
                                    <p className="text-gray-600 mt-1">
                                        {talent.email}
                                    </p>
                                    <p className="mt-3 text-gray-500">
                                        {talent.bio?.substring(0, 100) || "No bio available"}...
                                    </p>
                                </div>

                                <button
                                    className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg flex items-center space-x-2 transition"
                                    onClick={() => openSidebar(talent)}
                                >
                                    <span>👁️</span>
                                    <span>View Profile</span>
                                </button>
                            </div>
                        ))}
                    </div>


                    {totalPages > 1 && (
                        <div className="flex justify-center mt-12 space-x-4 items-center">
                            {/* Previous Button */}
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 rounded-lg ${currentPage === 1
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                                    }`}
                            >
                                ◀
                            </button>

                            {/* Page Numbers with Ellipsis */}
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter(page => (
                                    page === 1 ||
                                    page === totalPages ||
                                    (page >= currentPage - 1 && page <= currentPage + 1)
                                ))
                                .map((page, i) => (
                                    <button
                                        key={i}
                                        onClick={() => paginate(page)}
                                        className={`px-4 py-2 rounded-lg ${currentPage === page
                                            ? "bg-indigo-600 text-white"
                                            : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))
                            }

                            {/* Next Button */}
                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`px-4 py-2 rounded-lg ${currentPage === totalPages
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                                    }`}
                            >
                                ▶
                            </button>
                        </div>
                    )}

                </div>

                <div className="bg-talentia dark:bg-gray-900">
                    <CallToAction />
                    <Footer />
                </div>

                {isSidebarOpen && selectedTalent && (
                    <div
                        className={`fixed top-0 right-0 h-full w-[400px] bg-white dark:bg-gray-800 shadow-2xl z-50 transform ${isSidebarOpen ? "translate-x-0" : "translate-x-full"
                            } transition-transform duration-300 ease-in-out`}
                    >
                        <div className="p-6 h-full flex flex-col">
                            <h2 className="text-3xl font-bold text-white">{selectedTalent.full_name}</h2>
                            <p className="text-white mt-4">{selectedTalent.bio}</p>
                            <button onClick={closeSidebar} className="mt-6 bg-gray-700 py-2 px-4 rounded-lg text-white">
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}
