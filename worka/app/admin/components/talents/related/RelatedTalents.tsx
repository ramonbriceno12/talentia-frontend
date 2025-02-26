import React, { useEffect, useState } from "react";
import UserBadge from "../status/StatusBadge";
import ConnectButton from "../buttons/ConnectButton";
import FollowButton from "../buttons/FollowButton";

interface Talent {
    id: number;
    full_name: string;
    profile_picture: string;
    job_title: { title: string };
    status_badge: "open_to_work" | "recruiting" | null;
}

interface RelatedTalentsProps {
    userId: number; // The logged-in user ID
}

const RelatedTalents: React.FC<RelatedTalentsProps> = ({ userId }) => {
    const [relatedTalents, setRelatedTalents] = useState<Talent[]>([]);
    const [followStatuses, setFollowStatuses] = useState({});
    const [connectionStatuses, setConnectionStatuses] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const token = localStorage.getItem('token')

    useEffect(() => {
        const fetchRelatedTalents = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/talents/related/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!response.ok) throw new Error("Failed to fetch related talents");

                const data = await response.json();
                setRelatedTalents(data.relatedTalents || []);

                const talentIds = data.relatedTalents.map((talent) => talent.id);
                if (talentIds.length > 0) {
                    fetchFollowStatuses(talentIds);
                    fetchConnectionStatuses(talentIds);
                }
            } catch (error: any) {
                console.error("Error fetching related talents:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchFollowStatuses = async (talentIds) => {
            try {
                const response = await fetch(`http://localhost:5000/api/follows/statuses/${userId}`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ talentIds }),
                });

                if (!response.ok) throw new Error("Failed to fetch follow statuses");

                const data = await response.json();
                const statusMap = {};

                // Set follow status correctly for each talent
                talentIds.forEach((id) => {
                    statusMap[id] = data.followStatuses.includes(id); // Explicit true/false
                });
                setFollowStatuses(statusMap);
            } catch (error) {
                console.error("Error fetching follow statuses:", error);
            }
        };

        const fetchConnectionStatuses = async (talentIds) => {
            try {
                const response = await fetch(`http://localhost:5000/api/connections/statuses/${userId}`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ talentIds }),
                });

                if (!response.ok) throw new Error("Failed to fetch connection statuses");

                const data = await response.json();
                console.log(data)
                setConnectionStatuses(data.connectionStatuses);
            } catch (error) {
                console.error("Error fetching connection statuses:", error);
            }
        };

        fetchRelatedTalents();
    }, [userId, token]);

    if (loading) return <p className="text-center text-gray-600">Cargando talentos relacionados...</p>;
    if (error) return <p className="text-center text-red-500">Error: {error}</p>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-[#244c56]">Talentos Relacionados</h2>

            {relatedTalents.length === 0 ? (
                <p className="text-center text-gray-500">No hay talentos relacionados.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {relatedTalents.map((talent) => (
                        <div key={talent.id} className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 flex flex-col items-center text-center transition hover:shadow-xl">

                            {/* Profile Image + Badge */}
                            <UserBadge
                                imageUrl={talent.profile_picture || "img/default-user.png"}
                                statusBadge={talent.status_badge || null}
                            />

                            {/* User Name */}
                            <h3 className="text-lg font-semibold text-gray-900 mt-3">
                                {talent.full_name}
                            </h3>

                            {/* Job Title */}
                            <p className="text-gray-500 text-sm">
                                {talent.job_title?.title || "Sin título"}
                            </p>

                            {/* Buttons - Placed Side by Side */}
                            <div className="flex space-x-2 mt-3">
                                <ConnectButton userId={userId} targetId={talent.id} connectionStatus={connectionStatuses[talent.id] || "none"} />
                                <FollowButton userId={talent.id} isFollowing={followStatuses[talent.id] || false} />
                            </div>
                        </div>
                    ))}
                </div>

            )}
        </div>
    );
};

export default RelatedTalents;
