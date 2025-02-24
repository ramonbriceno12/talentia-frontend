"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaBriefcase, FaMapMarkerAlt, FaListUl } from "react-icons/fa";
import { useAuth } from "../../../utils/authContext";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  is_remote: boolean;
  description: string;
  skills: string[];
  created_at: string;
}

export default function JobDetailsPage() {
  const { id } = useParams(); // Get job ID from URL
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const { user } = useAuth();

  useEffect(() => {
    if (!token || !id) return;

    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/jobs/admin/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch job details");

        const data = await response.json();
        setJob(data);
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [token, id]);

  return (
    <div className="p-6">
      {loading ? (
        <p className="text-gray-500">Cargando detalles del empleo...</p>
      ) : job ? (
        <div className="bg-white shadow-md p-6 rounded-lg">
          <h1 className="text-2xl font-bold text-[#244c56] flex items-center gap-2">
            <FaBriefcase className="text-blue-500 text-3xl" /> {job.title}
          </h1>
          <p className="text-gray-600 text-lg font-semibold mt-2">{job.company}</p>
          <p className="text-gray-500 text-sm flex items-center gap-2">
            <FaMapMarkerAlt className="text-gray-400" />
            {job.is_remote ? "Remoto" : job.location}
          </p>
          <p className="text-gray-400 text-xs mt-2">Publicado el {new Date(job.created_at).toLocaleDateString()}</p>

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-[#244c56]">Descripción del Empleo</h2>
            <p className="text-gray-600 mt-2">{job.description}</p>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-[#244c56] flex items-center gap-2">
              <FaListUl className="text-blue-500" /> Habilidades Requeridas
            </h2>
            <ul className="mt-2 space-y-1">
              {job.skills.map((skill, index) => (
                <li key={index} className="text-gray-600">
                  • {skill}
                </li>
              ))}
            </ul>
          </div>

          <button className="mt-6 bg-[#244c56] text-white px-4 py-2 rounded hover:bg-[#349390]">
            Aplicar Ahora
          </button>
        </div>
      ) : (
        <p className="text-gray-500">Este empleo no existe o ha sido eliminado.</p>
      )}
    </div>
  );
}
