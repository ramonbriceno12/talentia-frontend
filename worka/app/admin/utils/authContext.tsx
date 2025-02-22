"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  profile_picture?: string;
};

type AuthContextType = {
  user: User | null;
  fetchUser: () => Promise<void>; // Ensure fetchUser returns a Promise
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // useCallback to ensure function identity remains stable
  const fetchUser = useCallback(async () => {
    if (user) return; // Avoid fetching if user is already set

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        logout();
      }
    } catch (error) {
      console.error("Error fetching user", error);
    }
  }, [user]); // Only re-run if `user` changes

  useEffect(() => {
    fetchUser(); // Call fetchUser only on first render
  }, [fetchUser]);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/admin/login"); // Use router push instead of full page reload
  };

  return (
    <AuthContext.Provider value={{ user, fetchUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
