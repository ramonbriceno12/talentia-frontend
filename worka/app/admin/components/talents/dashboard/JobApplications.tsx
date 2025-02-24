"use client";

import { FaBriefcase } from "react-icons/fa";

export default function JobApplications() {
  const jobApplications = 8; // Placeholder data

  return (
    <div className="bg-white shadow-md p-6 rounded">
      <div className="flex items-center gap-3">
        <FaBriefcase className="text-blue-500 text-3xl" />
        <div>
          <h2 className="text-lg font-semibold">Aplicaciones a empleos</h2>
          <p className="text-gray-600">{jobApplications} aplicaciones enviadas</p>
        </div>
      </div>
    </div>
  );
}
