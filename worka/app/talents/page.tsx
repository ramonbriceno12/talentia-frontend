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


    const handleSkillClick = (skill: string) => {
        setSelectedSkill(skill === selectedSkill ? null : skill);
        setPage(1); // Reset to first page on skill selection
    };

    const skillsContainerRef = useRef<HTMLDivElement | null>(null);

    const scrollSkills = (direction: 'left' | 'right') => {
        if (skillsContainerRef.current) {
            const scrollAmount = 200; // Adjust as needed
            skillsContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

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
            <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6 mb-8">
                <Link href="/">
                    <img
                        src="/img/LOGO-04.png"
                        alt="Talentia Logo"
                        className="mb-6 w-64 h-auto cursor-pointer"
                    />
                </Link>
                <div className="w-full max-w-4xl">
                    {/* Search Input */}
                    <input
                        type="text"
                        placeholder="Buscar talentos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded text-black mb-4"
                    />

                    {/* Job Titles Filter (Carousel) */}
                    <div className="relative w-full flex items-center mb-4">
                        {/* Left Scroll Button */}
                        <button
                            onClick={() => scrollJobTitles('left')}
                            className="absolute left-0 z-10 bg-[#10282c] hover:bg-[#244c56] text-white px-3 py-2 rounded-full shadow-md"
                        >
                            ◀
                        </button>

                        {/* Spacer to prevent overlapping */}
                        <div className="w-10"></div>

                        {/* Job Titles Container */}
                        <div
                            ref={jobTitlesContainerRef}
                            className="w-full flex space-x-3 overflow-hidden scroll-smooth whitespace-nowrap px-12"
                        >
                            {uniqueJobTitles.map(title => (
                                <button
                                    key={title}
                                    onClick={() => handleJobTitleClick(title)}
                                    className={`px-4 rounded-full text-sm font-semibold transition ${selectedJobTitle === title
                                        ? 'bg-[#10282c] text-white'
                                        : 'bg-[#244c56] text-white hover:bg-[#244c56]'
                                        }`}
                                >
                                    {title}
                                </button>
                            ))}
                        </div>

                        {/* Spacer to prevent overlapping */}
                        <div className="w-10"></div>

                        {/* Right Scroll Button */}
                        <button
                            onClick={() => scrollJobTitles('right')}
                            className="absolute right-0 z-10 bg-[#10282c] hover:bg-[#244c56] text-white px-3 py-2 rounded-full shadow-md"
                        >
                            ▶
                        </button>
                    </div>




                    {/* Talents List */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayedTalents.map(talent => (
                            <div
                                key={talent.id}
                                className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center text-center"
                            >
                                <img
                                    src={talent.profile_picture || '/img/default-user.png'}
                                    alt={talent.full_name.split(' ')[0]}
                                    className="w-20 h-20 object-cover rounded-full mb-3 transition-transform duration-300 hover:scale-110 active:scale-125 cursor-pointer"
                                />

                                <h3 className="text-lg text-[#10282c] font-semibold">{talent.full_name.split(' ')[0]}</h3>
                                <p className="text-gray-600 text-sm">{talent.job_title?.title || 'Sin título'}</p>

                                {/* Skills Display */}
                                <div className="flex flex-wrap justify-center mt-3">
                                    {talent.skills.length > 0 ? (
                                        talent.skills.map(skill => (
                                            <span
                                                key={skill.id}
                                                className="bg-gray-200 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full m-1"
                                            >
                                                {skill.name}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-500 text-xs">Sin skills</span>
                                    )}
                                </div>

                                <button
                                    onClick={() => openModal(talent)}
                                    className="py-1 mt-3 bg-[#244c56] text-white px-4 rounded-lg hover:bg-[#10282c]">
                                    Ver Bio 🚀
                                </button>
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
                                className="w-full bg-[#10282c] text-white px-2 rounded-lg hover:bg-[#244c56]"
                            >
                                {(loading ? 'Redirigiendo...' : 'Crear Propuesta 🚀')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}