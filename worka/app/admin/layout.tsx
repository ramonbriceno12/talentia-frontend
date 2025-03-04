"use client";

import { usePathname, useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "./utils/authContext";
import Sidebar from "./components/Sidebar";
import { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthWrapper>{children}</AuthWrapper>
    </AuthProvider>
  );
}

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loadingUser } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Define authentication pages
  const authPages = ["/admin/login", "/admin/register"];

  useEffect(() => {
    if (!loadingUser && user === null) {
      router.push("/admin/login");
    }
  }, [user, router, loadingUser]);

  if (loadingUser) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  // If the user is on an authentication page, hide the sidebar
  if (authPages.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen relative">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />

      {/* Overlay when sidebar is open on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content with padding for mobile */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Navbar with Toggle */}
        <header className="bg-white shadow-md p-4 flex items-center justify-between md:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-700 focus:outline-none">
            <FaBars size={24} />
          </button>
          <h2 className="text-lg font-semibold">Admin Panel</h2>
        </header>

        {/* Main content area */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto h-screen bg-gray-100 relative">
          <div className="max-w-6xl mx-auto h-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
