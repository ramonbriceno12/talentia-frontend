import { useState } from "react";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";

export default function ExperienceSalarySection({ 
    talentId, 
    yearsOfExperience, 
    expectedSalary, 
    jobTypePreference, 
    onSave 
}: { 
    talentId: number; 
    yearsOfExperience: number | null; 
    expectedSalary: number | null; 
    jobTypePreference: string | null; 
    onSave: (updatedData: { years_of_experience: number; expected_salary: number; job_type_preference: string }) => void;
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [updatedData, setUpdatedData] = useState({
        years_of_experience: yearsOfExperience ?? 0,
        expected_salary: expectedSalary ?? 0,
        job_type_preference: jobTypePreference ?? "" // Store as a string (e.g., "full-time/part-time")
    });

    // ✅ Toggle Job Type Selection
    const toggleJobType = (value: string) => {
        let selectedTypes = updatedData.job_type_preference ? updatedData.job_type_preference.split("/") : [];

        if (selectedTypes.includes(value)) {
            selectedTypes = selectedTypes.filter((t) => t !== value); // Remove if selected
        } else {
            selectedTypes.push(value); // Add if not selected
        }

        setUpdatedData((prev) => ({
            ...prev,
            job_type_preference: selectedTypes.join("/") // Convert array to string with "/"
        }));
    };

    // ✅ Save Experience & Salary
    const handleSave = async () => {
        if (updatedData.years_of_experience < 0 || updatedData.expected_salary < 0) {
            alert("Values must be positive numbers.");
            return;
        }

        setLoading(true);
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`http://localhost:5000/api/talents/experience/${talentId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(updatedData)
            });

            if (!response.ok) {
                throw new Error("Failed to update experience & salary.");
            }

            onSave(updatedData); // ✅ Update the main view instantly
            setIsEditing(false);
            alert("Experience & Salary updated successfully!");
        } catch (error) {
            console.error("Error updating experience & salary:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-6 bg-white shadow-md p-4 rounded relative">
            {/* Header with Edit & Close Button */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#244c56]">Experience & Salary</h2>

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
                            onClick={() => { 
                                setUpdatedData({ 
                                    years_of_experience: yearsOfExperience ?? 0, 
                                    expected_salary: expectedSalary ?? 0, 
                                    job_type_preference: jobTypePreference ?? "" 
                                }); 
                                setIsEditing(false); 
                            }} 
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

            {/* Editable Fields */}
            {isEditing ? (
                <div className="space-y-4">
                    <label className="block text-gray-700">
                        Years of Experience:
                        <input
                            type="number"
                            className="border border-gray-300 p-2 rounded w-full"
                            value={updatedData.years_of_experience}
                            onChange={(e) => setUpdatedData({ ...updatedData, years_of_experience: Number(e.target.value) || 0 })}
                        />
                    </label>

                    <label className="block text-gray-700">
                        Expected Salary ($):
                        <input
                            type="number"
                            className="border border-gray-300 p-2 rounded w-full"
                            value={updatedData.expected_salary}
                            onChange={(e) => setUpdatedData({ ...updatedData, expected_salary: Number(e.target.value) || 0 })}
                        />
                    </label>

                    <label className="block text-gray-700">
                        Job Type Preference:
                        <div className="flex flex-wrap gap-2 mt-3">
                            {[
                                { label: "Tiempo completo", value: "full-time" },
                                { label: "Medio tiempo", value: "part-time" },
                                { label: "Por horas", value: "hourly" },
                                { label: "Por proyecto", value: "project" },
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => toggleJobType(option.value)}
                                    className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                                        updatedData.job_type_preference.includes(option.value)
                                            ? "bg-[#10282c] text-white"
                                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </label>
                </div>
            ) : (
                <div>
                    <p className="text-gray-600">Years of Experience: {yearsOfExperience ?? "N/A"}</p>
                    <p className="text-gray-600">Expected Salary: ${expectedSalary ?? "N/A"}</p>
                    <p className="text-gray-600">
                        Job Type Preference: {jobTypePreference ? jobTypePreference.split("/").join(", ") : "N/A"}
                    </p>
                </div>
            )}
        </div>
    );
}
