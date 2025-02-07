'use client';

import Footer from '@/components/homepage/Footer';
import { useState, useEffect, useRef, useCallback } from 'react';

interface Job {
    id: number;
    company_id: number;
    title: string;
    description: string;
    category: number;
    location: string;
    is_remote: boolean;
    is_featured: boolean;
    views: number;
    createdAt: string;
    updatedAt: string;
    company_name: string;
    category_name: string;
}

interface Category {
    id: number;
    name: string;
}

export default function JobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [page, setPage] = useState(1);
    const jobsPerPage = 12;
    const observer = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const [jobsRes, catRes] = await Promise.all([
                    fetch('http://localhost:5000/api/jobs'),
                    fetch('http://localhost:5000/api/jobs/categories'),
                ]);
                if (!jobsRes.ok || !catRes.ok) {
                    throw new Error('Error fetching data');
                }
                const jobsData: Job[] = await jobsRes.json();
                const catData: Category[] = await catRes.json();
                setJobs(jobsData);
                setCategories(catData);
                setFilteredCategories(catData); // Initially, all categories are shown
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    // **Filter jobs dynamically**
    const filteredJobs = jobs.filter((job) => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? job.category.toString() === selectedCategory : true;
        return matchesSearch && matchesCategory;
    });

    // **Update Category Buttons based on Search Results**
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredCategories(categories);
        } else {
            const matchedCategories = jobs
                .filter((job) => job.title.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((job) => job.category);

            const uniqueCategories = categories.filter((cat) => matchedCategories.includes(cat.id));
            setFilteredCategories(uniqueCategories);
        }
    }, [searchTerm, jobs, categories]);

    // **Get only the visible jobs for infinite scroll**
    const visibleJobs = filteredJobs.slice(0, page * jobsPerPage);

    // **Infinite Scrolling Logic**
    const lastJobRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && visibleJobs.length < filteredJobs.length) {
                    setPage((prevPage) => prevPage + 1);
                }
            });

            if (node) observer.current.observe(node);
        },
        [loading, visibleJobs, filteredJobs]
    );

    // **Reset the page count when search or category changes**
    useEffect(() => {
        setPage(1);
    }, [searchTerm, selectedCategory]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Cargando trabajos...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-forms flex flex-col">
            {/* Logo */}
            <div className="text-center mb-4">
                <img src="/img/LOGO-01.png" alt="Talentia Logo" className="w-64 h-auto inline-block" />
            </div>

            {/* Main Container - Two Column Layout */}
            <div className="flex flex-col lg:flex-row h-[80vh] px-4 gap-4">
                {/* Jobs List (Left) with Search & Categories */}
                <div className="lg:w-1/3 w-full bg-white shadow rounded overflow-y-auto h-full">
                    {/* Search Bar inside Job List */}
                    <div className="p-4 border-b sticky top-0 bg-white z-10">
                        <input
                            type="text"
                            placeholder="Buscar trabajos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded text-black"
                        />
                    </div>

                    {/* Scrollable Category Filters (Fixed Spacing & Padding) */}
                    <div className="p-4 pt-3 pb-2 overflow-x-auto whitespace-nowrap space-x-2 flex border-b sticky top-[66px] bg-white z-10">
                        <div className="flex space-x-2 px-2">
                            <button
                                onClick={() => setSelectedCategory('')}
                                className={`px-4 py-2 rounded ${selectedCategory === '' ? 'bg-[#244c56] text-white' : 'bg-gray-300 text-gray-700'
                                    }`}
                            >
                                Todas
                            </button>
                            {filteredCategories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id.toString())}
                                    className={`px-4 py-2 rounded ${selectedCategory === cat.id.toString() ? 'bg-[#244c56] text-white' : 'bg-gray-300 text-gray-700'
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>


                    {/* Job Listings */}
                    {visibleJobs.map((job, index) => (
                        <div
                            key={job.id}
                            ref={index === visibleJobs.length - 1 ? lastJobRef : null}
                            className={`p-4 border-b cursor-pointer hover:bg-gray-100 ${selectedJob?.id === job.id ? 'bg-gray-200' : ''
                                }`}
                            onClick={() => setSelectedJob(job)}
                        >
                            <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                            <p className="text-gray-600">{job.company_name}</p>
                        </div>
                    ))}
                </div>

                {/* Job Details (Right) */}
                <div className="lg:w-2/3 w-full bg-white shadow rounded p-6 overflow-y-auto">
                    {selectedJob ? (
                        <>
                            <h2 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h2>
                            <p className="text-gray-600 mt-1">
                                <strong>Empresa:</strong> {selectedJob.company_name}
                            </p>
                            <p className="text-gray-600">
                                <strong>Categoría:</strong> {selectedJob.category_name}
                            </p>
                            <p className="text-gray-600">
                                <strong>Ubicación:</strong> {selectedJob.location} {selectedJob.is_remote ? '(Remoto)' : ''}
                            </p>
                            <p className="text-gray-700 mt-4">{selectedJob.description}</p>
                        </>
                    ) : (
                        <p className="text-gray-600 text-center">Selecciona un trabajo para ver los detalles.</p>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
