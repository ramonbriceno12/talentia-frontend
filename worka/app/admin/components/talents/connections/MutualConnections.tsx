import React, { useEffect, useState } from "react";

interface MutualConnection {
  id: number;
  full_name: string;
  profile_picture: string;
}

interface MutualConnectionsProps {
  userId: number;
  targetId: number;
}

const MutualConnections: React.FC<MutualConnectionsProps> = ({ userId, targetId }) => {
  const [mutualConnections, setMutualConnections] = useState<MutualConnection[]>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMutualConnections = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/connections/talents/mutual/${userId}/${targetId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.ok) throw new Error("Failed to fetch mutual connections");

        const data = await response.json();
        setMutualConnections(data.mutualConnections || []);
      } catch (error) {
        console.error("Error fetching mutual connections:", error);
      }
    };

    fetchMutualConnections();
  }, [userId, targetId, token]);

  if (mutualConnections.length === 0) return null; // Hide if no mutual connections

  return (
    <div className="flex -space-x-2 mt-2">
      {mutualConnections.slice(0, 5).map((talent, index) => (
        <img
          key={talent.id}
          src={talent.profile_picture || "/default-avatar.jpg"}
          alt={talent.full_name}
          className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
          style={{ zIndex: mutualConnections.length - index }} // Layer effect
        />
      ))}
    </div>
  );
};

export default MutualConnections;
