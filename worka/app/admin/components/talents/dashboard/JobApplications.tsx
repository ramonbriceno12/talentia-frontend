"use client";

import { FaBriefcase } from "react-icons/fa";

interface JobApplicationsProps {
  totalApplications: number;
}

export default function JobApplications({ totalApplications }: JobApplicationsProps) {
  return (
    <div className="bg-white shadow-md p-6 rounded">
      <div className="flex items-center gap-3">
        <FaBriefcase className="text-blue-500 text-3xl" />
        <div>
          <h2 className="text-lg font-semibold text-[#244c56]">Aplicaciones a empleos</h2>
          <p className="text-gray-600">{totalApplications} aplicaciones enviadas</p>
        </div>
      </div>
    </div>
  );
}
