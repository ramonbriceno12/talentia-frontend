"use client";

import { FaStar } from "react-icons/fa";

export default function RelatedJobs() {
  const relatedJobs = [
    { id: 1, title: "Frontend Developer", company: "TechCorp" },
    { id: 2, title: "UI/UX Designer", company: "Designify" },
    { id: 3, title: "Project Manager", company: "BizFlow" },
  ]; // Placeholder data

  return (
    <div className="bg-white shadow-md p-6 rounded">
      <h2 className="text-lg font-semibold flex items-center gap-2 text-[#244c56]">
        <FaStar className="text-yellow-500" /> Empleos relacionados
      </h2>
      <ul className="mt-3 space-y-2">
        {relatedJobs.map((job) => (
          <li key={job.id} className="text-gray-600">
            <strong>{job.title}</strong> en {job.company}
          </li>
        ))}
      </ul>
    </div>
  );
}
