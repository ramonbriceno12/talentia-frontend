import { useState } from "react";

const ConnectButton = ({ userId }) => {
    const [isConnected, setIsConnected] = useState(false);

    const handleConnect = async () => {
        try {
            // Simulate API call (replace with actual request)
            setIsConnected(!isConnected);
        } catch (error) {
            console.error("Error updating connection status", error);
        }
    };

    return (
        <button
            onClick={handleConnect}
            className={`px-4 py-1 text-sm font-medium rounded-full transition-all shadow-sm 
                ${isConnected ? "bg-gray-200 text-gray-700" : "bg-[#244c56] text-white hover:bg-[#349390]"}`}
        >
            {isConnected ? "Connected" : "Connect"}
        </button>
    );
};

export default ConnectButton;
