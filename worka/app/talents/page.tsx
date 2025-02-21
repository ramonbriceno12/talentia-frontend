'use client';

import Footer from '@/components/homepage/Footer';
import Navbar from '@/components/homepage/Navbar';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface Talent {
    id: number;
    full_name: string;
    email: string;
    bio: string | null;
    profile_picture: string | null;
    resume_file: string | null;
    is_featured: boolean;
    createdAt: string;
    updatedAt: string;
    country: string;
    years_of_experience: number;
    expected_salary: string;
    job_title: { title: string } | null;
    skills: { id: number; name: string; category: string }[];
}

export default function TalentsPage() {
    const [talents, setTalents] = useState<Talent[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
    const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null);
    const [expandedBio, setExpandedBio] = useState(false);
    const [uniqueJobTitles, setUniqueJobTitles] = useState<string[]>([]);
    const [selectedJobTitle, setSelectedJobTitle] = useState<string | null>(null);
    const jobTitlesContainerRef = useRef<HTMLDivElement | null>(null);


    const router = useRouter();

    const talentsPerPage = 12;

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`https://talentiave.com/api/api/talents`);
                if (!response.ok) {
                    throw new Error('Error fetching data');
                }

                const talentsData: Talent[] = await response.json();
                setTalents(talentsData);

                // Extract and sort unique job titles alphabetically
                const jobTitles = Array.from(new Set(
                    talentsData.map(talent => talent.job_title?.title).filter(Boolean)
                )).sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }));
                setUniqueJobTitles(jobTitles);

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                console.log('Data fetched successfully');
            }
        }
        fetchData();
    }, []);


    const handleJobTitleClick = async (title: string) => {
        const newTitle = selectedJobTitle === title ? null : title; // Toggle selection
        setSelectedJobTitle(newTitle);

        try {
            const response = await fetch(
                `https://talentiave.com/api/api/talents?job_title=${encodeURIComponent(newTitle || '')}`
            );
            if (!response.ok) {
                throw new Error("Error fetching filtered data");
            }

            const filteredTalents = await response.json();
            setTalents(filteredTalents);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };


    const scrollJobTitles = (direction: 'left' | 'right') => {
        if (jobTitlesContainerRef.current) {
            const scrollAmount = 200; // Adjust as needed
            jobTitlesContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };


    const openModal = (talent: Talent) => {
        setSelectedTalent(talent);
        setExpandedBio(false); // Reset bio view state when opening modal
    };

    const closeModal = () => {
        setSelectedTalent(null);
    };

    const filteredTalents = talents.filter(talent =>
        (talent.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            talent.job_title?.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedJobTitle ? talent.job_title?.title === selectedJobTitle : true)
    );

    const totalPages = Math.ceil(filteredTalents.length / talentsPerPage);

    useEffect(() => {
        setPage(1);
    }, [searchTerm, selectedSkill, selectedJobTitle]);

    const displayedTalents = filteredTalents.slice((page - 1) * talentsPerPage, page * talentsPerPage);

    const getTalentUUID = (talentId: number): string => {
        const storedUUIDs = JSON.parse(localStorage.getItem("talentUUIDs") || "{}");
        if (storedUUIDs[talentId]) return storedUUIDs[talentId];

        // Generate a new UUID and store it
        const newUUID = crypto.randomUUID();
        storedUUIDs[talentId] = newUUID;
        localStorage.setItem("talentUUIDs", JSON.stringify(storedUUIDs));

        return newUUID;
    };

    const goToProposal = (talentId: number) => {
        setLoading(true);
        const uuid = getTalentUUID(talentId);
        router.push(`/proposals/${uuid}`); // Use UUID instead of numeric ID
    };

    return (
        <div className="bg-gray-100">
            <div className="mt-10">
                <Navbar />
            </div>
            <div className="min-h-screen flex flex-col items-center bg-gray-200 p-6 mb-8">
                <div className="w-full">
                    <div className="bg-white shadow-lg rounded-lg p-6 mb-6 mt-6">
                        {/* Search Input */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Buscar talentos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-3 pl-10 border border-gray-300 rounded text-black focus:ring-2 focus:ring-[#10282c] focus:outline-none"
                            />
                            {/* Search Icon */}
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                                🔍
                            </span>
                        </div>

                        {/* Job Titles Filter (Carousel) */}
                        <div className="relative w-full flex items-center mt-4">
                            {/* Left Scroll Button (Minimalist) */}
                            <button
                                onClick={() => scrollJobTitles('left')}
                                className="absolute left-0 z-10 bg-white p-2 shadow-md rounded-full text-gray-500 hover:text-gray-800 transition transform -translate-y-1/2"
                                style={{ top: "50%" }}
                            >
                                〈
                            </button>

                            {/* Job Titles Container */}
                            <div
                                ref={jobTitlesContainerRef}
                                className="w-full flex space-x-3 overflow-x-auto scroll-smooth whitespace-nowrap px-12 no-scrollbar"
                            >
                                {uniqueJobTitles.map(title => (
                                    <button
                                        key={title}
                                        onClick={() => handleJobTitleClick(title)}
                                        className={`px-4 py-2 rounded-full text-sm font-semibold transition 
                        ${selectedJobTitle === title
                                                ? 'bg-[#10282c] text-white'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                    >
                                        {title}
                                    </button>
                                ))}
                            </div>

                            {/* Right Scroll Button (Minimalist) */}
                            <button
                                onClick={() => scrollJobTitles('right')}
                                className="absolute right-0 z-10 bg-white p-2 shadow-md rounded-full text-gray-500 hover:text-gray-800 transition transform -translate-y-1/2"
                                style={{ top: "50%" }}
                            >
                                〉
                            </button>
                        </div>
                    </div>




                    {/* Talents List (List View) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {displayedTalents.map((talent) => (
                            <div
                                key={talent.id}
                                className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center relative transition-transform duration-300 hover:scale-[1.02]"
                            >
                                {/* Profile Picture */}
                                <img
                                    src={talent.profile_picture || "/img/default-user.png"}
                                    alt={talent.full_name.split(" ")[0]}
                                    className="w-24 h-24 object-cover rounded-full border-4 border-gray-200 shadow-sm mb-4 transition-transform duration-300 hover:scale-110 cursor-pointer"
                                />

                                {/* Talent Details */}
                                <h3 className="text-xl text-[#10282c] font-semibold">{talent.full_name}</h3>
                                <p className="text-gray-700 text-sm font-medium">{talent.job_title?.title || "Sin título"}</p>
                                <p className="text-gray-500 text-sm">
                                    {talent.country && talent.country.trim() !== "N/A" ? talent.country : "Venezuela"}
                                </p>

                                {/* Experiencia: Only shows if years_of_experience is NOT null or 0 */}
                                {talent.years_of_experience != null && talent.years_of_experience !== 0 && (
                                    <p className="text-gray-500 text-sm">{`Experiencia: ${talent.years_of_experience} años`}</p>
                                )}

                                {/* Expectativa Salarial: Only shows if expected_salary is NOT null or "0.00" */}
                                {talent.expected_salary != null && talent.expected_salary !== "0.00" && (
                                    <p className="text-gray-500 text-sm">
                                        {`Expectativa Salarial: $${Number(talent.expected_salary).toLocaleString()}/Mes`}
                                    </p>
                                )}

                                {/* Action Links */}
                                <div className="flex flex-col mt-4 w-full text-sm font-medium">
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            openModal(talent);
                                        }}
                                        className="text-[#10282c] hover:underline transition-colors duration-200"
                                    >
                                        Ver Bio 💼
                                    </a>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            goToProposal(talent.id);
                                        }}
                                        className="text-[#10282c] hover:underline mt-1 transition-colors duration-200"
                                    >
                                        Contactar 🚀
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>



                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-between mt-6">
                            <button
                                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                                disabled={page === 1}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
                            >
                                Anterior
                            </button>
                            <span className="text-gray-700">
                                Página {page} de {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={page === totalPages}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
                            >
                                Siguiente
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
            {/* Modal */}
            {selectedTalent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full h-[90vh] flex flex-col">
                        {/* Header */}
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-2xl text-[#244c56] font-bold">{selectedTalent.full_name.split(' ')[0]}</h2>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="p-6 flex-1 overflow-y-auto">
                            {/* Profile Picture */}
                            <img
                                src={selectedTalent.profile_picture || '/img/default-user.png'}
                                alt={selectedTalent.full_name.split(' ')[0]}
                                className="w-20 h-20 object-cover rounded-full mb-3 transition-transform duration-300 hover:scale-110 active:scale-125 cursor-pointer"
                            />
                            <p className="text-gray-600">{selectedTalent.job_title?.title || 'Sin título'}</p>
                            <p className="text-gray-400 text-sm">
                                {selectedTalent.country && selectedTalent.country.trim() !== "N/A" ? selectedTalent.country : "Venezuela"}
                            </p>

                            {/* Experiencia: Only shows if years_of_experience is NOT null or 0 */}
                            {selectedTalent.years_of_experience != null && selectedTalent.years_of_experience !== 0 && (
                                <p className="text-gray-400 text-sm">{`Experiencia: ${selectedTalent.years_of_experience} años`}</p>
                            )}

                            {/* Expectativa Salarial: Only shows if expected_salary is NOT null or "0.00" */}
                            {selectedTalent.expected_salary != null && selectedTalent.expected_salary !== "0.00" && (
                                <p className="text-gray-400 text-sm">
                                    {`Expectativa Salarial: $${Number(selectedTalent.expected_salary).toLocaleString()}/Mes`}
                                </p>
                            )}
                            {/* Skills Display */}
                            <div className="mt-3 flex flex-wrap">
                                {selectedTalent.skills.map(skill => (
                                    <span
                                        key={skill.id}
                                        className="bg-gray-200 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full m-1"
                                    >
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                            {/* Bio Section */}
                            <div className="mt-3">
                                <p className="text-gray-700 whitespace-pre-wrap">
                                    {expandedBio
                                        ? selectedTalent.bio
                                        : selectedTalent.bio?.substring(0, 300) || 'Sin bio'}
                                </p>
                                {selectedTalent.bio && selectedTalent.bio.length > 300 && (
                                    <button
                                        onClick={() => setExpandedBio(!expandedBio)}
                                        className="text-[#244c56] text-sm mt-1"
                                    >
                                        {expandedBio ? '▲ Ver menos' : '▼ Ver más'}
                                    </button>
                                )}
                            </div>

                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t">
                            <button
                                onClick={() => goToProposal(selectedTalent.id)}
                                className="w-m-4xl bg-[#10282c] text-white px-4 py-2 rounded-lg hover:bg-[#244c56]"
                            >
                                {(loading ? 'Redirigiendo...' : 'Contacto 🚀')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}