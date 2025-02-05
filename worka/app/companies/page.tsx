'use client'
import CallToAction from "@/components/homepage/CallToAction";
import Footer from "@/components/homepage/Footer";
import Navbar from "@/components/homepage/Navbar";
import { useState, useEffect } from "react";

export default function CompanyListView() {
    const [companies, setCompanies] = useState([]);
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [companyJobs, setCompanyJobs] = useState([]);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const companiesPerPage = 6;

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await fetch("https://talentiave.com/api/api/companies");
                const data = await response.json();
                setCompanies(data);
                setFilteredCompanies(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching companies:", error);
                setLoading(false);
            }
        };
        fetchCompanies();
    }, []);

    const fetchCompanyJobs = async (companyId) => {
        try {
            const response = await fetch(`https://talentiave.com/api/api/jobs?company_id=${companyId}`);
            const data = await response.json();
            setCompanyJobs(data);
        } catch (error) {
            console.error("Error fetching company jobs:", error);
        }
    };

    const filterCompanies = (query) => {
        const filtered = companies.filter((company) =>
            company.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredCompanies(filtered);
        setCurrentPage(1);
    };

    const onSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        filterCompanies(query);
    };

    const openSidebar = (company) => {
        setSelectedCompany(company);
        setSidebarOpen(true);
        fetchCompanyJobs(company.id);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
        setSelectedCompany(null);
        setCompanyJobs([]);
    };

    // Pagination Logic
    const indexOfLastCompany = currentPage * companiesPerPage;
    const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
    const currentCompanies = filteredCompanies.slice(indexOfFirstCompany, indexOfLastCompany);

    const totalPages = Math.ceil(filteredCompanies.length / companiesPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-lg text-gray-700">Loading companies...</p>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <section className="min-h-screen bg-talentia text-gray-900 mt-24">
                <div className="mx-auto px-6 mb-12">
                    <h1 className="text-4xl font-bold text-center mb-12">
                        🏢 Companies
                    </h1>

                    <div className="flex justify-center mb-12">
                        <input
                            type="text"
                            className="w-2/3 p-4 rounded-lg bg-white shadow-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            placeholder="Search for companies..."
                            value={searchQuery}
                            onChange={onSearchChange}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-10xl mx-auto">
                        {currentCompanies.map((company) => (
                            <div
                                key={company.id}
                                className="p-6 bg-white shadow-md flex flex-col justify-between border border-gray-200 hover:shadow-xl transition"
                            >
                                <div>
                                    <h2 className="text-2xl font-semibold">{company.name}</h2>
                                    <p className="text-gray-600 mt-1">{company.email}</p>
                                    <p className="mt-3 text-gray-500">
                                        {company.description.substring(0, 100)}...
                                    </p>

                                    <div className="mt-4 flex items-center space-x-2 text-gray-500">
                                        <span className="text-2xl">📊</span>
                                        <p className="text-lg">
                                            {company.job_count} job{company.job_count !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg flex items-center space-x-2 transition"
                                    onClick={() => openSidebar(company)}
                                >
                                    <span>🔍</span>
                                    <span>View Details</span>
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
                                .filter(page => {
                                    // Always show first, last, current, and adjacent pages
                                    return (
                                        page === 1 ||
                                        page === totalPages ||
                                        (page >= currentPage - 1 && page <= currentPage + 1)
                                    );
                                })
                                .reduce((acc, page, i, arr) => {
                                    if (i && page - arr[i - 1] > 1) {
                                        acc.push('...');
                                    }
                                    acc.push(page);
                                    return acc;
                                }, [])
                                .map((page, i) => (
                                    <button
                                        key={i}
                                        onClick={() => typeof page === 'number' && paginate(page)}
                                        className={`px-4 py-2 rounded-lg ${currentPage === page
                                            ? "bg-indigo-600 text-white"
                                            : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                                            }`}
                                        disabled={page === '...'}
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
                    {/* Call to Action Section */}
                    <CallToAction />

                    {/* Footer */}
                    <Footer />
                </div>


                {/* Sidebar for Company Details */}
                {isSidebarOpen && selectedCompany && (
                    <div
                        className={`fixed top-0 right-0 h-full w-[400px] bg-white dark:bg-gray-800 shadow-2xl z-50 transform ${isSidebarOpen ? "translate-x-0" : "translate-x-full"
                            } transition-transform duration-300 ease-in-out`}
                    >
                        <div className="p-6 h-full flex flex-col">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-3xl font-bold text-white">
                                    {selectedCompany.name}
                                </h2>
                                <button
                                    onClick={closeSidebar}
                                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                >
                                    ✖
                                </button>
                            </div>
                            <p className="text-gray-500 mb-4">
                                {selectedCompany.email}
                            </p>
                            <p className="text-gray-200 mb-6">{selectedCompany.description}</p>

                            {/* Job Listings */}
                            <h3 className="text-2xl font-semibold mb-4 text-white"><span>🔍</span>Job Openings</h3>
                            <ul className="space-y-3 pb-2">
                                {companyJobs.slice(0, 5).map((job) => (
                                    <li key={job.id} className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm flex justify-between items-center">
                                        <div>
                                            <h4 className="font-semibold text-lg text-white">
                                                {job.title || job.name}
                                            </h4>
                                            <p className="text-white">{job.location}</p>
                                        </div>
                                        <button
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg shadow-md transition flex items-center space-x-2"
                                            onClick={() => alert(`Applying for ${item.title}`)}
                                        >
                                            <span>🚀</span>
                                            <span>Aplicar</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            {companyJobs.length > 5 && (
                                <div className="mt-6">
                                    <button
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition"
                                        onClick={() => window.location.href = `/jobs?company_id=${selectedCompany.id}`}
                                    >
                                        View All Jobs
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}
