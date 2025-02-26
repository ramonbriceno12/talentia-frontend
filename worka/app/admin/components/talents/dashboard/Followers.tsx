"use client";

import { FaUserFriends } from "react-icons/fa";

interface FollowersProps {
  totalFollowers: number;
}

export default function Followers({ totalFollowers }: FollowersProps) {
  return (
    <div className="bg-white shadow-md p-6 rounded">
      <div className="flex items-center gap-3">
        <FaUserFriends className="text-green-500 text-3xl" />
        <div>
          <h2 className="text-lg font-semibold text-[#244c56]">Seguidores</h2>
          <p className="text-gray-600">{totalFollowers} seguidores</p>
        </div>
      </div>
    </div>
  );
}
