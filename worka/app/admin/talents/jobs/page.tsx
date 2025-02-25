"use client";

import { useEffect, useState } from "react";
import { FaBriefcase } from "react-icons/fa";
import Link from "next/link";
import { useAuth } from "../../utils/authContext";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  created_at: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const { user } = useAuth();

  useEffect(() => {
    if (!token) return;

    const fetchJobs = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/jobs/admin/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch jobs");

        const data = await response.json();
        setJobs(data.jobs || []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [token]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#244c56] flex items-center gap-2">
        <FaBriefcase className="text-blue-500 text-3xl" /> Todos los Empleos
      </h1>
      <p className="text-gray-600 mt-2">Explora todas las oportunidades disponibles.</p>

      {loading ? (
        <p className="text-gray-500 mt-4">Cargando empleos...</p>
      ) : jobs.length === 0 ? (
        <p className="text-gray-500 mt-4">No hay empleos disponibles en este momento.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white shadow-md p-4 rounded-lg border">
              <h2 className="text-lg font-semibold text-[#244c56]">{job.title}</h2>
              <p className="text-gray-600 text-sm">{job.company}</p>
              <p className="text-gray-500 text-sm">{job.location}</p>
              <p className="text-gray-400 text-xs">Publicado el {new Date(job.created_at).toLocaleDateString()}</p>
              <Link href={`jobs/${job.id}`}>
                <button className="mt-4 bg-[#244c56] text-white px-4 py-2 rounded hover:bg-[#349390]">
                  Aplicar
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
