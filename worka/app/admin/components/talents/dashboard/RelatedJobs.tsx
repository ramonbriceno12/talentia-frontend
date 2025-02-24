"use client";

import { FaStar } from "react-icons/fa";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  is_remote: boolean;
}

interface RelatedJobsProps {
  jobs: Job[];
}

export default function RelatedJobs({ jobs }: RelatedJobsProps) {
  return (
    <div className="bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-xl font-semibold flex items-center gap-2 text-[#244c56] mb-4">
        <FaStar className="text-yellow-500" /> Empleos Relacionados
      </h2>

      {jobs.length === 0 ? (
        <p className="text-gray-500 [#244c56]">No hay trabajos relacionados en este momento.</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {jobs.map((job) => (
            <div key={job.id} className="bg-gray-100 p-4 rounded-lg shadow-md w-full md:w-[48%] lg:w-[30%]">
              <h3 className="text-lg font-medium text-[#244c56]">{job.title}</h3>
              <p className="text-sm text-gray-600">
                {job.company} • {job.is_remote ? "Remoto" : job.location}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
