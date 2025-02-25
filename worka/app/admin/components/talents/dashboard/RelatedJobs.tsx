"use client";

import Link from "next/link";
import { FaStar } from "react-icons/fa";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  is_remote: boolean;
  created_at: string;
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
              <h2 className="text-lg font-semibold text-[#244c56]">{job.title}</h2>
              <p className="text-gray-600 text-sm">{job.company}</p>
              <p className="text-gray-500 text-sm">{job.location}</p>
              <p className="text-gray-400 text-xs">Publicado el {new Date(job.created_at).toLocaleDateString()}</p>
              <Link href={`jobs/${job.id}`}>
                <button className="mt-4 bg-[#244c56] text-white px-4 py-2 rounded hover:bg-[#349390]">
                  Ver Detalles
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
