"use client";

import Link from "next/link";
import { useAuth } from "../utils/authContext";

export default function Sidebar() {
  const { user } = useAuth();

  if (!user) return null; // Ensure no sidebar shows for unauthenticated users

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
    <aside className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold">Admin Panel</h2>
      <nav className="mt-4">
        {userMenu.map((item) => (
          <Link key={item.path} href={item.path} className="block py-2 hover:bg-gray-700 px-3 rounded">
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
