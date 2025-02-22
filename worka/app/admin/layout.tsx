"use client";

import { usePathname } from "next/navigation";
import { AuthProvider, useAuth } from "./utils/authContext";
import Sidebar from "./components/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthWrapper>{children}</AuthWrapper>
    </AuthProvider>
  );
}

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();

  // Define authentication pages
  const authPages = ["/admin/login", "/admin/register"];

  // If the user is on an authentication page, show the page without the sidebar
  if (authPages.includes(pathname)) {
    return <>{children}</>;
  }

  // If user is not logged in, prevent access to admin panel
  if (!user) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  // If user is logged in, show sidebar + content
  return (
    <div className="flex h-screen">
      <Sidebar /> {/* Sidebar is now an external component */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
