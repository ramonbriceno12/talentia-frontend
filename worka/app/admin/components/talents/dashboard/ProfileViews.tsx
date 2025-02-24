"use client";

import { FaEye, FaUser } from "react-icons/fa";

export default function ProfileViews({ profileViews, viewers }: { profileViews: number; viewers: any[] }) {
  return (
    <div className="bg-white shadow-md p-6 rounded">
      <div className="flex items-center gap-3">
        <FaEye className="text-purple-500 text-3xl" />
        <div>
          <h2 className="text-lg font-semibold text-[#244c56]">Vistas de perfil</h2>
          <p className="text-gray-600">
            {profileViews === 0
              ? "Nadie ha visto tu perfil aún."
              : profileViews === 1
              ? "1 persona ha visto tu perfil."
              : `${profileViews} personas han visto tu perfil.`}
          </p>
        </div>
      </div>

      {/* Show last 3 unique viewers if available */}
      {viewers.length > 0 && (
        <div className="mt-4">
          <h3 className="text-md font-semibold text-gray-700 mb-2">Personas que vieron tu perfil</h3>
          <div className="flex flex-wrap gap-3">
            {viewers.slice(0, 3).map((viewer) => (
              <div key={viewer.id} className="flex items-center gap-2 p-2 border rounded shadow-sm bg-gray-100">
                {viewer.profile_picture ? (
                  <img
                    src={viewer.profile_picture}
                    alt={viewer.full_name}
                    className="w-8 h-8 rounded-full border border-gray-300"
                  />
                ) : (
                  <FaUser className="text-gray-500 text-2xl" />
                )}
                <span className="text-sm text-gray-700">{viewer.full_name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
