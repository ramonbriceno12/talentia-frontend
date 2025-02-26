import { useState } from "react";

const ConnectButton = ({ userId, targetId, connectionStatus }) => {
    const [status, setStatus] = useState(connectionStatus);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token");

    const handleConnect = async () => {
        if (status !== "none") return; // Prevent unnecessary requests

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/connections/request`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId, targetId }),
            });

            if (!response.ok) throw new Error("Failed to send connection request");

            setStatus("pending");
        } catch (error) {
            console.error("Error sending connection request:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleConnect}
            disabled={loading || status === "accepted"}
            className={`px-4 py-1 text-sm font-medium rounded-full transition-all shadow-sm 
                ${status === "accepted" ? "bg-gray-200 text-gray-700 cursor-not-allowed" 
                : status === "pending" ? "bg-yellow-500 text-white cursor-not-allowed" 
                : "bg-[#244c56] text-white hover:bg-[#349390]"}`}
        >
            {loading ? "..." : status === "accepted" ? "Connected" : status === "pending" ? "Pending" : "Connect"}
        </button>
    );
};

export default ConnectButton;
