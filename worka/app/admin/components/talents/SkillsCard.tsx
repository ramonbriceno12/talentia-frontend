import { useState, useEffect } from "react";
import { FaEdit, FaPlus, FaSave, FaTimes } from "react-icons/fa";

export default function SkillsSection({ 
    talentId, 
    skills = [], // ✅ Default to empty array to prevent errors
    onSave 
}: { 
    talentId: number; 
    skills: { id: number; name: string; category: string }[]; 
    onSave: (updatedSkills: { id: number; name: string; category: string }[]) => void;
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [availableSkills, setAvailableSkills] = useState<{ id: number; name: string; category: string }[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [updatedSkills, setUpdatedSkills] = useState(skills); // ✅ Stores the updated list locally

    // ✅ Fetch all available skills once when editing starts
    useEffect(() => {
        if (isEditing && availableSkills.length === 0) {
            fetch("http://localhost:5000/api/skills")
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setAvailableSkills(data);
                    } else if (Array.isArray(data.skills)) {
                        setAvailableSkills(data.skills);
                    } else {
                        setAvailableSkills([]); // ✅ Prevent undefined errors
                    }
                })
                .catch(err => {
                    console.error("Error fetching skills:", err);
                    setAvailableSkills([]); // ✅ Fallback to empty array
                });
        }
    }, [isEditing]);

    // ✅ Add a skill (Only adds to local state)
    const handleAddSkill = (skill: { id: number; name: string; category: string }) => {
        if (updatedSkills.some(s => s.id === skill.id)) return; // Prevent duplicate skills
        setUpdatedSkills([...updatedSkills, skill]);
    };

    // ✅ Remove a skill (Only removes from local state)
    const handleRemoveSkill = (skillId: number) => {
        setUpdatedSkills(updatedSkills.filter(skill => skill.id !== skillId));
    };

    // ✅ Save skills (Sends entire updated list in a single request)
    const handleSave = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`http://localhost:5000/api/talents/skills/${talentId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ user_id: talentId, skills: updatedSkills.map(skill => skill.id) })
            });

            if (!response.ok) throw new Error("Failed to update skills.");

            onSave(updatedSkills); // ✅ Update main view with new skills
            setIsEditing(false);
        } catch (error) {
            console.error("Error saving skills:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-6 bg-white shadow-md p-4 rounded relative">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#244c56]">Skills</h2>

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
                            onClick={() => { setUpdatedSkills(skills); setIsEditing(false); }} // Reset & Close
                        >
                            <FaTimes size={16} className="inline-block mr-2" /> Close
                        </button>
                    </div>
                ) : (
                    <button className="text-gray-500 hover:text-gray-700 px-4 py-2 rounded" onClick={() => setIsEditing(true)}>
                        <FaEdit size={18} className="inline-block mr-2" /> Edit
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="space-y-4">
                    {/* Search Input */}
                    <input
                        type="text"
                        placeholder="Search skills..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border p-2 rounded w-full"
                    />

                    {/* Selected Skills */}
                    <div className="flex flex-wrap gap-2">
                        {updatedSkills.map(skill => (
                            <span key={skill.id} className="px-3 py-1 bg-blue-200 text-blue-700 rounded flex items-center">
                                {skill.name}
                                <button className="ml-2 text-red-500 hover:text-red-700" onClick={() => handleRemoveSkill(skill.id)}>
                                    <FaTimes size={14} />
                                </button>
                            </span>
                        ))}
                    </div>

                    {/* Available Skills */}
                    <div className="border p-2 rounded max-h-40 overflow-y-auto">
                        {availableSkills
                            .filter(skill => skill.name.toLowerCase().includes(search.toLowerCase()) && !updatedSkills.some(s => s.id === skill.id))
                            .map(skill => (
                                <button
                                    key={skill.id}
                                    className="block w-full text-left px-3 py-2 hover:bg-gray-200 transition"
                                    onClick={() => handleAddSkill(skill)}
                                >
                                    <FaPlus size={12} className="inline-block mr-2" /> {skill.name} ({skill.category})
                                </button>
                            ))}
                    </div>
                </div>
            ) : (
                <p className="text-gray-500">{skills.length > 0 ? skills.map(skill => skill.name).join(", ") : "No skills added"}</p>
            )}
        </div>
    );
}
