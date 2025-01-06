'use client'
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Navbar() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState(null);

    // Fetch user from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser).user);
            }
        }
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        window.location.href = "/auth/login";
    };

    return (
        <>
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 fixed top-0 left-0 w-full z-50">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        
                        <a href="/">
                            <Image
                                src="/img/logo.png"
                                alt="Avatar"
                                width={120}
                                height={120}
                                className=""
                            />
                        </a>
                        {/* Burger Button */}
                        <button
                            onClick={toggleSidebar}
                            className="text-gray-900 focus:outline-none"
                        >
                            <svg
                                className="w-8 h-8"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                        
                    </div>

                    {/* User Section */}
                    {user ? (
                        <div className="flex items-center space-x-3">
                            {
                                user.profile_picture ? (
                                    <Image
                                        src={user.profile_picture}
                                        alt="Avatar"
                                        width={40}
                                        height={40}
                                        className="rounded-full border border-gray-300"
                                    />
                                ) : (
                                    "😎"
                                )
                            }
                            <span className="text-gray-900 font-medium">
                                {user.name}
                            </span>

                            {/* Logout Icon (Replaces Button) */}
                            <button
                                onClick={handleLogout}
                                className="ml-4 hover:text-red-600 transition"
                                aria-label="Logout"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-7 h-7"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m-3-6l3 3m0 0l-3 3m3-3H9"
                                    />
                                </svg>
                            </button>

                        </div>
                    ) : (
                        <a href="/login" className="text-blue-500 hover:underline">
                            🔑
                        </a>
                    )}
                </div>
            </nav>

            {/* Sidebar (Left) */}
            <div
                className={`fixed top-0 left-0 h-full w-72 bg-white shadow-lg z-50 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } transition-transform duration-300 ease-in-out`}
            >
                <div className="p-6 space-y-8">
                    <div className="flex justify-between items-center mb-6">
                        <a href="/">
                            <Image
                                src="/img/logo.png"
                                alt="Avatar"
                                width={120}
                                height={120}
                                className=""
                            />
                        </a>

                        <button
                            onClick={toggleSidebar}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✖
                        </button>
                    </div>

                    <ul className="space-y-4">
                        {user && (
                            <li>
                                <a
                                    href="/profile"
                                    className="flex items-center space-x-3 text-lg text-gray-900 hover:bg-gray-100 px-4 py-3 rounded-lg"
                                >
                                    🧑‍💻 <span>Mi Perfil</span>
                                </a>
                            </li>
                        )}
                        <li>
                            <a
                                href="/companies"
                                className="flex items-center space-x-3 text-lg text-gray-900 hover:bg-gray-100 px-4 py-3 rounded-lg"
                            >
                                💼 <span>Empresas</span>
                            </a>
                        </li>

                        <li>
                            <a
                                href="/jobs"
                                className="flex items-center space-x-3 text-lg text-gray-900 hover:bg-gray-100 px-4 py-3 rounded-lg"
                            >
                                🔍 <span>Ofertas</span>
                            </a>
                        </li>

                        <li>
                            <a
                                href="/talents"
                                className="flex items-center space-x-3 text-lg text-gray-900 hover:bg-gray-100 px-4 py-3 rounded-lg"
                            >
                                👀 <span>Talentos</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 z-40"
                    onClick={toggleSidebar}
                ></div>
            )}
        </>
    );
}
