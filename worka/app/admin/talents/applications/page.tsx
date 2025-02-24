"use client";

import { useEffect, useState } from "react";
import { FaBriefcase } from "react-icons/fa";
import { useAuth } from "../../utils/authContext";

interface Application {
  job_id: number;
  job_title: string;
  company: string;
  location: string;
  applied_at: string;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const { user } = useAuth();

  useEffect(() => {
    if (!token) return;

    const fetchApplications = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/applications/talent/${user?.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch applications");

        const data = await response.json();
        setApplications(data.applications || []);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [token]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#244c56] flex items-center gap-2">
        <FaBriefcase className="text-blue-500 text-3xl" /> Aplicaciones a Empleos
      </h1>
      <p className="text-gray-600 mt-2">Aquí puedes ver todos los trabajos a los que has aplicado.</p>

      {loading ? (
        <p className="text-gray-500 mt-4">Cargando aplicaciones...</p>
      ) : applications.length === 0 ? (
        <p className="text-gray-500 mt-4">No has aplicado a ningún empleo aún.</p>
      ) : (
        <div className="mt-6 bg-white shadow-md p-4 rounded-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left text-[#244c56]">
                <th className="p-3">Puesto</th>
                <th className="p-3">Empresa</th>
                <th className="p-3">Ubicación</th>
                <th className="p-3">Fecha de Aplicación</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.job_id} className="border-b hover:bg-gray-100 transition text-gray-600">
                  <td className="p-3 font-medium">{app.job_title}</td>
                  <td className="p-3">{app.company}</td>
                  <td className="p-3">{app.location}</td>
                  <td className="p-3 text-gray-600">{new Date(app.applied_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
