import { useState } from "react";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";

export default function BioSection({ bio, talentId, onSave }: { 
    bio: string; 
    talentId: number; 
    onSave: (updatedBio: string) => void;
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [updatedBio, setUpdatedBio] = useState(bio);
    const [loading, setLoading] = useState(false);

    // ✅ Save Bio
    const handleSave = async () => {
        if (updatedBio.trim().length < 10) {
            alert("Bio must be at least 10 characters long.");
            return;
        }

        setLoading(true);
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`http://localhost:5000/api/talents/bio/${talentId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ bio: updatedBio }) // ✅ Send only Bio
            });

            if (!response.ok) {
                throw new Error("Failed to update bio.");
            }

            onSave(updatedBio); // ✅ Update the main view instantly
            setIsEditing(false);
            alert("Bio updated successfully!");
        } catch (error) {
            console.error("Error updating bio:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-6 bg-white shadow-md p-4 rounded relative">
            {/* Header with Edit & Close Button */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#244c56]">Bio</h2>

                {isEditing ? (
                    <div className="flex space-x-2">
                        <button
                            className="bg-[#244c56] text-white px-4 py-2 rounded hover:bg-[#349390] transition"
                            onClick={handleSave}
                            disabled={loading}
                        >
                            {loading ? "Saving..." : <><FaSave size={16} className="inline-block mr-2" /> Save</>}
                        </button>

                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                            onClick={() => { setUpdatedBio(bio); setIsEditing(false); }} // Reset & Close
                        >
                            <FaTimes size={16} className="inline-block mr-2" /> Close
                        </button>
                    </div>
                ) : (
                    <button
                        className="text-gray-500 hover:text-gray-700 px-4 py-2 rounded"
                        onClick={() => setIsEditing(true)}
                    >
                        <FaEdit size={18} className="inline-block mr-2" /> Edit
                    </button>
                )}
            </div>

            {/* Editable Bio */}
            {isEditing ? (
                <textarea
                    className="border border-gray-300 p-2 rounded w-full h-32 text-[#244c56]"
                    value={updatedBio}
                    onChange={(e) => setUpdatedBio(e.target.value)}
                />
            ) : (
                <p className="text-gray-600 ">{bio || "No bio available."}</p>
            )}
        </div>
    );
}
