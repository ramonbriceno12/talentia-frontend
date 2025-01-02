'use client'
import Image from "next/image";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification({ message: "", type: "" });
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("User not found. Please check your credentials.");
        } else {
          throw new Error(data.message || "An unexpected error occurred.");
        }
      }

      // Successful login
      setNotification({ message: "Login successful! Redirecting...", type: "success" });
      console.log("Login successful:", data.token);

      // Simulate redirection after 2 seconds
      setTimeout(() => {
        window.location.href = "/dashboard";  // Redirect to dashboard or homepage
      }, 2000);

    } catch (err) {
      setNotification({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
      
      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 5000);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Floating Tooltip */}
      {notification.message && (
        <div
          className={`fixed top-6 right-6 px-6 py-4 rounded-lg shadow-lg animate-fade-in ${
            notification.type === "error"
              ? "bg-red-500 text-white"
              : "bg-green-500 text-white"
          }`}
        >
          <strong className="font-bold">
            {notification.type === "error" ? "Error: " : "Success! "}
          </strong>
          {notification.message}
          <span
            className="ml-4 cursor-pointer"
            onClick={() => setNotification({ message: "", type: "" })}
          >
            ✖
          </span>
        </div>
      )}

      {/* Left Section - Info */}
      <div className="w-1/2 flex flex-col items-center justify-center p-12 bg-blue-600 text-white">
        <div className="max-w-md text-center">
          <Image
            src="/next.svg"
            alt="Next.js Logo"
            width={120}
            height={28}
            className="mb-6"
          />
          <h1 className="text-4xl font-bold leading-tight">
            Welcome to Worka
          </h1>
          <p className="mt-4 text-lg">
            Find the best opportunities in tech, design, and marketing. Join now
            and start your journey!
          </p>
          <ul className="mt-6 space-y-3 text-left text-lg">
            <li>🚀 Job Listings for Junior Roles</li>
            <li>💬 Real-time Messaging</li>
            <li>📊 Track Job Proposals</li>
          </ul>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-1/2 flex items-center justify-center p-12 bg-gray-50 dark:bg-gray-900">
        <main className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold text-center text-gray-800 dark:text-white">
            Login
          </h2>

          <form className="mt-8" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 p-3 w-full border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 p-3 w-full border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-300"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
            Don’t have an account?{" "}
            <a href="/register" className="text-blue-500 hover:underline">
              Sign up
            </a>
          </p>
        </main>
      </div>
    </div>
  );
}
