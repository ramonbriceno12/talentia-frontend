'use client';

import Footer from '@/components/homepage/Footer';
import { useState, useEffect, useRef, useCallback } from 'react';

interface Talent {
    id: number;
    full_name: string;
    email: string;
    bio: string | null;
    profile_picture: string | null;
    resume_file: string;
    is_featured: boolean;
    createdAt: string;
    updatedAt: string;
    job_title: { title: string } | null;
    skills: { id: number; name: string; category: string }[];
}

export default function TalentsPage() {
    const [talents, setTalents] = useState<Talent[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null);
    const [page, setPage] = useState(1);
    const observer = useRef<IntersectionObserver | null>(null);
    const talentsPerPage = 10;

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`http://localhost:5000/api/talents?page=${page}&limit=${talentsPerPage}`);
                if (!response.ok) {
                    throw new Error('Error fetching data');
                }
                const talentsData: Talent[] = await response.json();
                setTalents(prev => {
                    const uniqueTalents = [...prev, ...talentsData].filter(
                        (talent, index, self) => index === self.findIndex(t => t.id === talent.id)
                    );
                    return uniqueTalents;
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [page]);

    const lastTalentRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) {
                    setPage(prevPage => prevPage + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading]
    );

    return (
        <div className="min-h-screen flex flex-col">
            {/* Main content row */}
            <div className="flex flex-row flex-grow">
                {/* Left sidebar with talents list */}
                <div className="w-2/5 bg-white shadow rounded overflow-y-auto h-screen p-4">
                    <input
                        type="text"
                        placeholder="Buscar talentos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded text-black mb-4"
                    />
                    {talents.map((talent, index) => (
                        <div
                            key={`${talent.id}-${index}`}
                            ref={index === talents.length - 1 ? lastTalentRef : null}
                            className="p-4 border-b cursor-pointer hover:bg-gray-100 flex items-center"
                            onClick={() => setSelectedTalent(talent)}
                        >
                            {/* <img
                                src={talent.profile_picture || '/img/default-profile.png'}
                                alt={talent.full_name}
                                className="w-12 h-12 rounded-full mr-4"
                            /> */}
                            <div>
                                <h3 className="text-lg font-semibold">{talent.full_name}</h3>
                                <p className="text-gray-600">{talent.job_title?.title || 'Sin título'}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right details section */}
                <div className="w-3/5 p-6 bg-white shadow rounded h-screen overflow-y-auto">
                    {selectedTalent ? (
                        <>
                            <h2 className="text-xl font-semibold">{selectedTalent.full_name}</h2>
                            <p className="text-gray-600">{selectedTalent.job_title?.title || 'Sin título'}</p>
                            <p className="text-gray-600 whitespace-pre-line mt-2">{selectedTalent.bio}</p>
                            {/* <a href={selectedTalent.resume_file} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                Ver CV
                            </a> */}
                        </>
                    ) : (
                        <p className="text-gray-600 text-center">Selecciona un talento para ver detalles.</p>
                    )}
                </div>
            </div>

            {/* Footer at the bottom */}
            <Footer />
        </div>
    );
}
