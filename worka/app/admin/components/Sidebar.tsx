"use client";

import Link from "next/link";
import { useAuth } from "../utils/authContext";
import { FaTimes } from "react-icons/fa";

export default function Sidebar({ isOpen, closeSidebar }: { isOpen: boolean, closeSidebar: () => void }) {
  const { user } = useAuth();

  if (!user) return null; // No sidebar if user is not logged in

  // Define menu options based on user role
  const menuOptions = {
    talent: [
      { path: "/admin", label: "Dashboard" },
      { path: "/admin/jobs", label: "My Applications" },
      { path: "/admin/profile", label: "Profile" },
    ],
    recruiter: [
      { path: "/admin", label: "Dashboard" },
      { path: "/admin/jobs", label: "Manage Jobs" },
      { path: "/admin/candidates", label: "Candidates" },
    ],
    company: [
      { path: "/admin", label: "Dashboard" },
      { path: "/admin/jobs", label: "Company Jobs" },
      { path: "/admin/employees", label: "Employees" },
    ],
  };

  const userMenu = menuOptions[user.role] || [];

  return (
    <aside className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white p-4 z-50 
      transform ${isOpen ? "translate-x-0" : "-translate-x-full"} 
      md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}>

      {/* Mobile Close Button */}
      <div className="md:hidden flex justify-end">
        <button onClick={closeSidebar} className="text-gray-400 hover:text-white">
          <FaTimes size={20} />
        </button>
      </div>

      <h2 className="text-xl font-bold mb-4">Admin Panel</h2>

      <nav>
        {userMenu.map((item) => (
          <Link 
            key={item.path} 
            href={item.path} 
            className="block py-2 px-3 rounded hover:bg-gray-700 transition"
            onClick={closeSidebar} // ✅ Close sidebar when menu is clicked
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
