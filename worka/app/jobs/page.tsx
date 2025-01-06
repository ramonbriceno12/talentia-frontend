'use client'
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import CallToAction from "@/components/homepage/CallToAction";
import Footer from "@/components/homepage/Footer";
import Navbar from "@/components/homepage/Navbar";

export default function JobListView() {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const searchParams = useSearchParams();
    const [isModalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        coverLetter: "",
        pdf: null,
    });

    const companyId = searchParams.get("company_id");

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 6;

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
        setCurrentPage(1); // Reset to first page after filtering
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

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const handleFormChange = (e) => {
        const { name, value, files, coverLetter } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
            coverLetter
        }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted:", formData);

        // Clear the form and close the modal
        setFormData({ name: "", email: "", coverLetter: "", pdf: null });
        closeModal();
    };

    console.log(selectedJob)

    // Pagination Logic
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-lg text-gray-700">Loading jobs...</p>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <section className="min-h-screen bg-talentia text-gray-900 pt-16 mt-16">
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-10xl mx-auto">
                        {currentJobs.map((job) => (
                            <div
                                key={job.id}
                                className="p-6 bg-white shadow-md flex flex-col justify-between border border-gray-200 hover:shadow-xl transition"
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
                    <CallToAction />
                    <Footer />
                </div>

                {isSidebarOpen && selectedJob && (
                    <div
                        className={`fixed top-0 right-0 h-full w-[400px] bg-white dark:bg-gray-800 shadow-2xl z-50 transform ${isSidebarOpen ? "translate-x-0" : "translate-x-full"
                            } transition-transform duration-300 ease-in-out`}
                    >
                        <div className="p-6 h-full flex flex-col">
                            {/* Header Section */}
                            <div className="flex justify-between items-center border-b border-gray-700 pb-4 mb-4">
                                <h2 className="text-3xl font-bold text-white">
                                    {selectedJob.title}
                                </h2>
                                <button
                                    onClick={closeSidebar}
                                    className="text-gray-500 hover:text-gray-300 transition duration-300"
                                >
                                    ✖
                                </button>
                            </div>

                            {/* Job Details Section */}
                            <div className="flex flex-col space-y-6 overflow-y-auto">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-300">Description</h3>
                                    <p className="text-gray-400">{selectedJob.description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-md font-semibold text-gray-300">Category</h4>
                                        <p className="text-gray-400">{selectedJob.category}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-md font-semibold text-gray-300">Location</h4>
                                        <p className="text-gray-400">{selectedJob.location}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-md font-semibold text-gray-300">Remote</h4>
                                        <p className="text-gray-400">
                                            {selectedJob.is_remote ? 'Yes' : 'No'}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-md font-semibold text-gray-300">Views</h4>
                                        <p className="text-gray-400">{selectedJob.views}</p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-700 pt-4">
                                    <h4 className="text-md font-semibold text-gray-300">Created At</h4>
                                    <p className="text-gray-400">
                                        {new Date(selectedJob.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <button
                                    className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg flex items-center space-x-2 transition"
                                    onClick={openModal}
                                >
                                    <span>🚀</span>
                                    <span>Apply</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                            <h2 className="text-2xl font-bold mb-4">Apply for Job</h2>
                            <form onSubmit={handleFormSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="name" className="block text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleFormChange}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="email" className="block text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleFormChange}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="pdf" className="block text-gray-700">Resume (PDF)</label>
                                    <div className="relative w-full border border-gray-300 rounded-lg overflow-hidden bg-white flex items-center justify-between p-2 cursor-pointer">
                                        <span className="text-gray-500">
                                            {formData.pdf ? formData.pdf.name : "Upload your resume (PDF)"}
                                        </span>
                                        <input
                                            type="file"
                                            id="pdf"
                                            name="pdf"
                                            accept="application/pdf"
                                            onChange={handleFormChange}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            required
                                        />
                                        <button type="button" className="px-4 py-1 bg-indigo-600 text-white rounded-lg">Choose File</button>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="coverLetter" className="block text-gray-700">Cover Letter</label>
                                    <textarea
                                        id="coverLetter"
                                        name="coverLetter"
                                        rows="5"
                                        value={formData.coverLetter || ""}
                                        onChange={handleFormChange}
                                        className="w-full p-2 border rounded resize-none"
                                        placeholder="Write your cover letter here..."
                                        required
                                    />
                                </div>
                                <div className="flex justify-end space-x-4">
                                    <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </section>
        </div>
    );
}
