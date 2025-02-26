import { useState, useEffect } from "react";

const FollowButton = ({ userId, isFollowing: initialFollowing }) => {
    const [isFollowing, setIsFollowing] = useState(initialFollowing);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token");

    // ✅ Ensure it updates when the prop changes
    useEffect(() => {
        setIsFollowing(initialFollowing);
    }, [initialFollowing]);

    const handleFollow = async () => {
        if (!token) return alert("You must be logged in to follow users.");

        setLoading(true);
        try {
            const url = isFollowing
                ? "http://localhost:5000/api/follows/unfollow"
                : "http://localhost:5000/api/follows/follow";

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ followedId: userId }),
            });

            if (!response.ok) throw new Error("Failed to update follow status");

            setIsFollowing(!isFollowing); // Toggle state on success
        } catch (error) {
            console.error("Error updating follow status:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleFollow}
            disabled={loading}
            className={`px-4 py-1 text-sm font-medium rounded-full transition-all shadow-sm flex items-center justify-center
                ${isFollowing ? "bg-gray-200 text-gray-700" : "bg-[#244c56] text-white hover:bg-[#349390]"}`}
        >
            {loading ? "..." : isFollowing ? "Following" : "Follow"}
        </button>
    );
};

export default FollowButton;
