"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../utils/authContext";
import Navbar from "@/components/homepage/Navbar";
import Footer from "@/components/homepage/Footer";

export default function LoginPage() {
  const router = useRouter();
  const { user, fetchUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showRegisterLink, setShowRegisterLink] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect if user is already logged in
  useEffect(() => {

    if (user) {
      console.log(user)
      let redirectUrl = "talents"; // Default redirect URL

      switch (user.role) {
        case "recruiter":
          redirectUrl = "recruiters";
          break;
        case "company":
          redirectUrl = "companies";
          break;
        default:
          break;
      }

      setTimeout(() => {
        router.push(`/admin/${redirectUrl}/dashboard`)
      }, 1500)

    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setShowRegisterLink(false);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setLoading(false);
        if (data.status === "no_password") {
          setError(data.message);
          setShowRegisterLink(true);
        } else {
          setError(data.message);
        }
        return;
      }

      localStorage.setItem("token", data.user.token);
      await fetchUser();

    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex flex-1 items-center justify-center" style={{
        background: "linear-gradient(90deg, #244c56 50%, #349390 100%)",
      }}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          </div>
        )}

        <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
          {/* Logo */}
          <img src="/img/LOGO-04.png" alt="Talentia Logo" className="w-64 mx-auto" />
          {error && <p className="text-red-500 text-center">{error}</p>}

          {showRegisterLink && (
            <p className="text-center text-blue-500">
              <a href="/admin/register" className="underline text-[#244c56]">Click here to set your password</a>
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded text-[#244c56]"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded text-[#244c56]"
              required
            />
            <button type="submit" className="w-full bg-[#244c56] text-white p-2 rounded" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-[#244c56] mt-4">
            Don't have an account? <a href="/admin/register" className="underline text-[#244c56]">Register</a>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
