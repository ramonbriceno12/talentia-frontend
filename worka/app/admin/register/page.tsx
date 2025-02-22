"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/homepage/Navbar";
import Footer from "@/components/homepage/Footer";
import { useAuth } from "../utils/authContext";
import Select from 'react-select';

export default function RegisterPage() {
    const { fetchUser } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState({ value: "talent", label: "Talent" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const roleOptions = [
        { value: "talent", label: "Talent" },
        { value: "recruiter", label: "Recruiter" },
        { value: "company", label: "Company" },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, name, role: role.value }),
            });

            const data = await response.json();

            if (!response.ok) {
                setLoading(false);
                if (data.message === "User already exists with a password. Please log in.") {
                    setError(data.message);
                    return;
                }
                setError(data.message);
                return;
            }

            setSuccess(data.message || "Registration successful! Redirecting to login...");
            localStorage.setItem("token", data.user.token);
            await fetchUser();
            setTimeout(() => router.push("/admin/login"), 2000);
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
                    {success && <p className="text-green-500 text-center">{success}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border rounded text-[#244c56]"
                            required
                        />
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
                            placeholder="Set Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border rounded text-[#244c56]"
                            required
                        />
                        <Select
                            name="role"
                            options={roleOptions}
                            value={role}
                            onChange={setRole} // Set role on change
                            className="basic-single-select mt-3 text-[#244c56] bg-[#244c56]"
                            classNamePrefix="select"
                            placeholder="Select your role..."
                            isSearchable
                        />
                        <button type="submit" className="w-full bg-[#244c56] text-white p-2 rounded" disabled={loading}>
                            {loading ? "Registering..." : "Register"}
                        </button>
                    </form>

                    <p className="text-center text-[#244c56] mt-4">
                        Already have an account? <a href="/admin/login" className="underline text-[#244c56]">Log in</a>
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
}
