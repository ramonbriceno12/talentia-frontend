'use client';

import Footer from '@/components/homepage/Footer';
import Navbar from '@/components/homepage/Navbar';
import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';

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
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const observer = useRef<IntersectionObserver | null>(null);
    const talentsPerPage = 10;

    useEffect(() => {
        async function fetchData() {
            try {
                // const response = await fetch(`https://talentiave.com/api/api/talents?page=${page}&limit=${talentsPerPage}`);
                const response = await fetch(`https://talentiave.com/api/api/talents?page=${page}&limit=${talentsPerPage}`);
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
        <div className="bg-gray-100">
            <div className='mt-10'>
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
                    <input
                        type="text"
                        placeholder="Buscar talentos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded text-black mb-4"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {talents
                            .filter(talent => talent.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map((talent, index) => (
                                <div
                                    key={`${talent.id}-${index}`}
                                    ref={index === talents.length - 1 ? lastTalentRef : null}
                                    className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center text-center"
                                >
                                    <img
                                        src={talent.profile_picture || '/img/default-profile.png'}
                                        alt={talent.full_name}
                                        className="w-24 h-24 rounded-full mb-3"
                                    />
                                    <h3 className="text-lg font-semibold">{talent.full_name}</h3>
                                    <p className="text-gray-600 text-sm">{talent.job_title?.title || 'Sin título'}</p>

                                    {/* Skills Section */}
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

                                    <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                        Conectar
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>
                {/* <Footer /> */}
            </div>
            <Footer />
        </div>

    );
}