"use client";

import { FaFileAlt } from "react-icons/fa";

export default function ProposalsReceived() {
  const proposals = 3; // Placeholder data

  return (
    <div className="bg-white shadow-md p-6 rounded">
      <div className="flex items-center gap-3">
        <FaFileAlt className="text-orange-500 text-3xl" />
        <div>
          <h2 className="text-lg font-semibold">Propuestas recibidas</h2>
          <p className="text-gray-600">{proposals} propuestas de trabajo</p>
        </div>
      </div>
    </div>
  );
}
