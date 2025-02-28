"use client";

import { FaUserFriends } from "react-icons/fa";

interface ConnectionsProps {
  totalConnections: number;
}

export default function Connections({ totalConnections }: ConnectionsProps) {
  return (
    <div className="bg-white shadow-md p-6 rounded">
      <div className="flex items-center gap-3">
        <FaUserFriends className="text-green-500 text-3xl" />
        <div>
          <h2 className="text-lg font-semibold text-[#244c56]">Conexiones</h2>
          <p className="text-gray-600">{totalConnections} conexiones</p>
        </div>
      </div>
    </div>
  );
}
