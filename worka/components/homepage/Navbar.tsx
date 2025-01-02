import { useState } from "react";
import Image from "next/image";

export default function Navbar() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Mock user data
    const user = {
        name: "Jane Doe",
        email: "jane.doe@example.com",
        avatar: "/avatar.jpg",
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <>
            {/* Navbar */}
            <nav className="bg-white dark:bg-gray-800 shadow-md fixed top-0 left-0 w-full z-50">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        {/* Burger Button */}
                        <button
                            onClick={toggleSidebar}
                            className="text-gray-700 dark:text-white focus:outline-none"
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

                        <span className="text-2xl font-semibold text-blue-600">
                            Talentia
                        </span>
                    </div>

                    {/* User Section */}
                    <div className="flex items-center space-x-3">
                        <Image
                            src={user.avatar}
                            alt="Avatar"
                            width={20}
                            height={20}
                            className="rounded-full border border-gray-300"
                        />
                        <span className="text-gray-700 dark:text-white font-medium">
                            {user.name}
                        </span>
                    </div>
                </div>
            </nav>

            {/* Sidebar (Left) */}
            <div
                className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-800 shadow-lg z-50 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } transition-transform duration-300 ease-in-out`}
            >
                <div className="p-6 space-y-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            Menu
                        </h2>
                        <button
                            onClick={toggleSidebar}
                            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                            ✖
                        </button>
                    </div>

                    <ul className="space-y-4">
                        <li>
                            <a
                                href="/offers"
                                className="flex items-center space-x-3 text-lg text-gray-700 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-700 px-4 py-3 rounded-lg"
                            >
                                💼 <span>My Offers</span>
                            </a>
                        </li>

                        <li>
                            <a
                                href="/searches"
                                className="flex items-center space-x-3 text-lg text-gray-700 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-700 px-4 py-3 rounded-lg"
                            >
                                🔍 <span>My Searches</span>
                            </a>
                        </li>

                        <li>
                            <a
                                href="/views"
                                className="flex items-center space-x-3 text-lg text-gray-700 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-700 px-4 py-3 rounded-lg"
                            >
                                👀 <span>Profile Views</span>
                            </a>
                        </li>

                        <li>
                            <a
                                href="/messages"
                                className="flex items-center space-x-3 text-lg text-gray-700 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-700 px-4 py-3 rounded-lg"
                            >
                                💬 <span>Messages</span>
                            </a>
                        </li>

                        <li>
                            <a
                                href="/settings"
                                className="flex items-center space-x-3 text-lg text-gray-700 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-700 px-4 py-3 rounded-lg"
                            >
                                ⚙️ <span>Settings</span>
                            </a>
                        </li>

                        <li>
                            <a
                                href="/logout"
                                className="flex items-center space-x-3 text-lg text-red-500 hover:bg-red-50 px-4 py-3 rounded-lg"
                            >
                                🚪 <span>Logout</span>
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
