import { useAuth } from "@/app/admin/utils/authContext";
import React, { useEffect, useState } from "react";
import UserBadge from "../status/StatusBadge";
import FollowButton from "../buttons/FollowButton";
import MutualConnections from "../connections/MutualConnections";

const TalentFollowers = ({ userId }) => {
    const [followers, setFollowers] = useState([]);
    const [followStatuses, setFollowStatuses] = useState({});
    const { user } = useAuth();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token || !userId) return;

        const fetchFollowers = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5000/api/follows/followers/${userId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (!response.ok) throw new Error("Failed to fetch followers");

                const data = await response.json();
                console.log(data)
                setFollowers(data.followers || []);

                // ✅ Extract follower user IDs for follow check
                const followerIds = data.followers
                    .map((follower) => follower.follower?.id)
                    .filter(Boolean); // Remove null values

                if (followerIds.length > 0) {
                    fetchFollowStatuses(followerIds);
                }
            } catch (error) {
                console.error("Error fetching followers:", error);
            }
        };

        const fetchFollowStatuses = async (followerIds) => {
            try {
                const response = await fetch(`http://localhost:5000/api/follows/statuses/${userId}`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ talentIds: followerIds }),
                });

                if (!response.ok) throw new Error("Failed to fetch follow statuses");

                const data = await response.json();
                const statusMap = {};

                // ✅ Map follow statuses correctly
                followerIds.forEach((id) => {
                    statusMap[id] = data.followStatuses.includes(id); // Explicit true/false
                });

                setFollowStatuses(statusMap);
            } catch (error) {
                console.error("Error fetching follow statuses:", error);
            }
        };

        fetchFollowers();
    }, [token, userId]);

    // ✅ Send Message
    const handleSendMessage = (followerId) => {
        console.log(`📩 Sending message to follower ID: ${followerId}`);
        // Navigate to messaging system (or open chat modal)
    };

    // ✅ Invite to Job
    const handleInviteToJob = async (followerId) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/jobs/invite/${followerId}`,
                {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                    body: JSON.stringify({ recruiterId: user.id }),
                }
            );

            if (!response.ok) throw new Error("Failed to send job invite");

            alert("✅ Invitation sent!");
        } catch (error) {
            console.error("Error inviting to job:", error);
        }
    };

    return (
        <div className="p-6">
            {followers.length > 0 ? (
                <div>
                    <div className="flex overflow-x-auto pb-4">
                        {followers.map((follower) => (
                            <div
                                key={follower.id}
                                className="flex-shrink-0 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4 flex flex-col items-center text-center mx-2"
                            >
                                <UserBadge
                                    imageUrl={follower.follower?.profile_picture || "/img/default-user.png"}
                                    statusBadge={follower.follower?.status_badge || null}
                                />
                                <h3 className="text-lg font-semibold text-gray-900 mt-3">
                                    {follower.follower?.full_name || "Usuario Desconocido"}
                                </h3>
                                <p className="text-gray-500 text-sm">
                                    {follower.follower?.job_title?.title || "Sin título"}
                                </p>

                                <MutualConnections userId={userId} targetId={follower.follower?.id} />

                                {/* 🔥 Interactive Buttons */}
                                <div className="flex mt-4 space-x-2">
                                    {follower.follower?.allow_messages && (
                                        <button
                                            onClick={() => handleSendMessage(follower.follower?.id)}
                                            className="px-3 py-1 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 text-xs"
                                        >
                                            💬 Message
                                        </button>
                                    )}

                                    {user?.role === "recruiter" && (
                                        <button
                                            onClick={() => handleInviteToJob(follower.follower?.id)}
                                            className="px-3 py-1 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 text-xs"
                                        >
                                            🏢 Invite to Job
                                        </button>
                                    )}

                                    <FollowButton
                                        userId={follower.follower?.id}
                                        isFollowing={followStatuses[follower.follower?.id] || false}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                // ✅ Improved message for no followed users
                <div className="flex flex-col items-center justify-center py-12">
                    <img
                        src="/img/default-user.png" // Add a relevant illustration
                        alt="No followed users"
                        className="w-24 h-24 mb-6"
                    />
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                        ¡Comienza a seguir a otros usuarios!
                    </h2>
                    <p className="text-gray-500 text-center max-w-md">
                        Descubre talentos increíbles, conecta con profesionales y mantente al día con sus actividades.
                    </p>
                    <button
                        onClick={() => {
                            // Add navigation or action to explore users
                            console.log("Explore users clicked");
                        }}
                        className="mt-6 px-6 py-2 bg-[#244c56] text-white rounded-lg shadow hover:bg-[#349390] transition-colors"
                    >
                        Explorar Usuarios
                    </button>
                </div>
            )}
        </div>
    );
};

export default TalentFollowers;