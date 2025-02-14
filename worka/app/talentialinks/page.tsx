'use client';

import { useState, useEffect } from 'react';
import Footer from '@/components/homepage/Footer';

export default function LinktreePage() {
    const [links, setLinks] = useState([]);

    // Fetch links from the backend
    useEffect(() => {
        async function fetchLinks() {
            try {
                const response = await fetch('https://talentiave.com/api/api/links');
                if (!response.ok) {
                    throw new Error('Failed to fetch links');
                }
                const data = await response.json();
                setLinks(data);
            } catch (error) {
                console.error('Error fetching links:', error);
            }
        }
        fetchLinks();
    }, []);

    // Track link clicks
    const trackLinkClick = async (id: number) => {
        try {
            await fetch('https://talentiave.com/api/api/links/track-click', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ link_id: id })
            });
        } catch (error) {
            console.error('Error tracking link click:', error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col text-white" style={{
            background: "linear-gradient(90deg, #244c56 50%, #349390 100%)",
        }}>
            {/* Main Content */}
            <div className="flex-grow flex flex-col items-center p-6 mb-6">
                {/* Logo */}
                <img src="/img/LOGO-01.png" alt="Talentia Logo" className="w-64" />

                {/* Title */}
                <h1 className="text-xl font-bold mb-4 text-center">Encuentra el mejor talento con Talentia 🚀</h1>
                <br />
                {/* Links */}
                <div className="w-full max-w-md flex flex-col items-center gap-4">
                    {links.length > 0 ? (
                        <div className="flex flex-col items-center gap-4 w-full">
                            {links.map((link) => (
                                <a
                                    key={link.id}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => trackLinkClick(link.id)}
                                    className="bg-white text-[#244c56] font-bold py-3 px-6 rounded-full text-lg shadow-lg hover:bg-gray-100 transition text-center w-full max-w-[300px] flex items-center justify-center"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>

                    ) : (
                        <p className="text-gray-300">Cargando enlaces...</p>
                    )}
                </div>
            </div>

            {/* Footer - Stays at Bottom */}
            <Footer />
        </div>
    );
}
