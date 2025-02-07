'use client'
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Fetch user from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser).user);
      }
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      {/* Fixed Navbar */}
      <nav className="bg-white border-b border-gray-200 fixed top-0 left-0 w-full z-50">
        <div className="w-full px-6 flex items-center justify-between">
          {/* Logo */}
          <a href="/">
            <Image
              src="/img/LOGO-04.png"
              alt="Logo"
              width={120}
              height={60}
              className="w-18 md:w-auto" // Wider on mobile
            />
          </a>

          {/* Right side: on desktop, show contact info plus burger button; on mobile, only burger */}
          <div className="flex items-center space-x-4">
            {/* Desktop Contact Info */}
            <div className="hidden md:flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-18 8h18a2 2 0 002-2V8a2 2 0 00-2-2H3a2 2 0 00-2 2v6a2 2 0 002 2z"
                />
              </svg>
              {/* <a
                href="mailto:contacto@talentiave.com"
                className="text-gray-700 text-md font-medium"
              >
                contacto@talentiave.com
              </a> */}
            </div>

            {/* Burger Button (always visible) */}
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
        </div>
      </nav>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-lg z-[60] transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="p-6 space-y-8">
          <div className="flex justify-between items-center mb-6">
            <a href="/">
              <Image
                src="/img/LOGO-04.png"
                alt="Logo"
                width={140}
                height={60}
                className="w-24"
              />
            </a>
            <button
              onClick={toggleSidebar}
              className="text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
          </div>

          {/* Mobile-only contact info inside the sidebar */}
          <div className="flex md:hidden items-center space-x-2 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-18 8h18a2 2 0 002-2V8a2 2 0 00-2-2H3a2 2 0 00-2 2v6a2 2 0 002 2z"
              />
            </svg>
            {/* <a
              href="mailto:contacto@talentiave.com"
              className="text-gray-700 text-md font-medium"
            >
              contacto@talentiave.com
            </a> */}
          </div>

          <ul className="space-y-4">
            <li>
              <a
                href="/forms/offer"
                className="flex items-center space-x-3 text-lg text-gray-900 hover:bg-gray-100 px-4 py-3 rounded-lg"
              >
                💼 <span>Crear Oferta Laboral</span>
              </a>
            </li>
            <li>
              <a
                href="/forms/talent"
                className="flex items-center space-x-3 text-lg text-gray-900 hover:bg-gray-100 px-4 py-3 rounded-lg"
              >
                👀 <span>Conseguir Trabajo</span>
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
