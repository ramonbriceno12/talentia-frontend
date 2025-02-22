"use client";

import { useAuth } from "./utils/authContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const { user, fetchUser, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      await fetchUser(); // Fetch user data
      setLoading(false); // Stop loading when user is fetched
    };

    checkUser();
  }, [fetchUser]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/admin/login"); // Redirect only if user is still null after loading
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome, {user.name}!</h1>
      <p className="mt-2 text-gray-600">Role: {user.role}</p>
      <div className="mt-4">
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
