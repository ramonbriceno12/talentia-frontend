"use client";

import { FaCheckCircle } from "react-icons/fa";

export default function ProfileCompletion() {
  const profileCompletion = 75; // Placeholder data

  return (
    <div className="bg-white shadow-md p-6 rounded">
      <div className="flex items-center gap-3">
        <FaCheckCircle className="text-green-500 text-3xl" />
        <div>
          <h2 className="text-lg font-semibold">Perfil Completo</h2>
          <p className="text-gray-600">{profileCompletion}% completado</p>
        </div>
      </div>
    </div>
  );
}
