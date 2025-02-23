"use client";

import { useState, useEffect } from "react";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import Select from "react-select";

export default function ProfileCard({ talentData, onSave }: { talentData: any; onSave: (updatedData: any) => void }) {
    const [isEditing, setIsEditing] = useState(false);
    const [jobTitles, setJobTitles] = useState<{ value: string; label: string }[]>([]);

    // ✅ Set default values to avoid `undefined`
    const [updatedData, setUpdatedData] = useState({
        full_name: "",
        job_title: "",
        email: "",
        profile_picture: "",
        headline: "",
    });

    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [jobTitlesLoading, setJobTitlesLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ✅ Fetch job titles (with error handling)
    useEffect(() => {
        const fetchJobTitles = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/job-titles");
                if (!response.ok) throw new Error("Failed to fetch job titles");
                const data = await response.json();
                setJobTitles(data.map((job: any) => ({
                    id: job.id,         // ✅ Store job ID
                    value: job.title,   // ✅ Store job title
                    label: job.title,
                })));
            } catch (err) {
                setError("Error fetching job titles");
                console.error("Error fetching job titles:", err);
            } finally {
                setJobTitlesLoading(false);
            }
        };

        fetchJobTitles();
    }, []);

    // ✅ Load talent data safely
    useEffect(() => {
        if (talentData && jobTitles.length > 0) {
            const matchingJobTitle = jobTitles.find(job => job.value === talentData.job_title?.title);

            setUpdatedData({
                full_name: talentData?.full_name || "",
                job_title: matchingJobTitle || { id: "", value: "", label: "" }, // ✅ Ensure full object
                email: talentData?.email || "",
                profile_picture: talentData?.profile_picture || "",
                headline: talentData?.headline || "",
            });

            setAvatarPreview(talentData?.profile_picture || null);
        }
    }, [talentData, jobTitles]);

    // ✅ Show error instead of infinite spinner
    if (error) {
        return (
            <div className="p-6 text-red-500">
                {error} — Please refresh or try again later.
            </div>
        );
    }

    // ✅ Prevent infinite loading
    if (!talentData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    // ✅ Handle Input Change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUpdatedData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleJobTitleChange = (selectedOption: any) => {
        setUpdatedData((prev) => ({
            ...prev,
            job_title: {
                id: selectedOption.id,  // ✅ Store ID
                value: selectedOption.value, // ✅ Store Value
                label: selectedOption.label, // ✅ Store Label
            },
        }));
    };

    // ✅ Handle Profile Picture Selection & Preview
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                alert("File size should be less than 10MB.");
                return;
            }
            setSelectedFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    // ✅ Validate Form Data
    const validateForm = () => {
        if (updatedData.full_name.trim().length < 2) {
            alert("Full name must be at least 2 characters long.");
            return false;
        }
        if (!updatedData.job_title?.value || updatedData.job_title.value.trim().length < 3) {
            // ✅ Use `job_title.value` instead of `job_title.trim()`
            alert("Job title must be at least 3 characters long.");
            return false;
        }
        if (updatedData.headline.trim().length < 3) {
            alert("Job title must be at least 3 characters long.");
            return false;
        }
        if (!/^\S+@\S+\.\S+$/.test(updatedData.email)) {
            alert("Invalid email format.");
            return false;
        }
        return true;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        setLoading(true);
        const formData = new FormData();
        formData.append("full_name", updatedData.full_name);
        formData.append("email", updatedData.email);
        formData.append("headline", updatedData.headline);

        // ✅ Attach Job Title (Send `job_title_id`)
        if (updatedData.job_title?.id) {
            formData.append("job_title_id", updatedData.job_title.id.toString()); // ✅ Send only the ID
        }

        if (selectedFile) {
            formData.append("profile_picture", selectedFile);
        }

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Unauthorized! Please log in again.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/talents/profile/${talentData.id}`, {
                method: "PATCH",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error updating profile.");
            }

            const updatedTalent = await response.json();

            // ✅ Find the Correct Job Title Object
            const matchingJobTitle = jobTitles.find(
                (job) => job.id === parseInt(updatedTalent.talent.job_title_id, 10)
            );

            // ✅ Update `updatedData` Correctly with `{ title }`
            const updatedProfile = {
                ...updatedTalent.talent,
                job_title: matchingJobTitle ? { title: matchingJobTitle.value } : null, // ✅ Ensure it has `title`
            };

            // ✅ Update State & Parent Component
            setUpdatedData(updatedProfile);
            onSave(updatedProfile);

            setAvatarPreview(updatedTalent.talent.profile_picture || null);
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error saving profile:", error);
            alert(error.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="mt-6 bg-white shadow-md p-4 rounded relative">
            {/* Edit & Save Buttons */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-[#244c56]">Perfil</h2>

                {isEditing ? (
                    <div>
                        <button
                            className="bg-[#244c56] text-white px-4 py-2 rounded hover:bg-[#349390] transition"
                            onClick={handleSave}
                            disabled={loading}
                        >
                            {loading ? "Guardando..." : <><FaSave size={16} className="inline-block mr-2" /> Guardar</>}
                        </button>
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition ml-2"
                            onClick={() => {
                                setIsEditing(false); // Close Editing
                                setUpdatedData({ ...talentData }); // Reset Data to Initial State
                                setAvatarPreview(talentData.profile_picture || null); // Reset Image Preview
                            }}
                        >
                            <FaTimes size={16} className="inline-block mr-2" /> Cancelar
                        </button>
                    </div>

                ) : (
                    <button
                        className="text-gray-500 hover:text-gray-700 px-4 py-2 rounded"
                        onClick={() => setIsEditing(true)}
                    >
                        <FaEdit size={18} className="inline-block mr-2" /> Editar
                    </button>
                )}
            </div>

            {/* Profile Picture Upload & Preview */}
            <div className="flex items-center mb-4">
                <div className="mr-4">
                    {avatarPreview ? (
                        <img
                            src={avatarPreview}
                            alt="Profile Preview"
                            className="w-16 h-16 rounded-full border border-gray-300 shadow-sm"
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                            📷
                        </div>
                    )}
                    {isEditing && (
                        <label className="block text-xs text-[#244c56] cursor-pointer mt-1">
                            <input
                                type="file"
                                accept="image/png, image/jpeg"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            Cambiar Foto
                        </label>
                    )}
                </div>

                {/* Editable Fields */}
                <div className="flex-1">
                    {isEditing ? (
                        <>
                            <div className="mb-2">
                                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                <input
                                    type="text"
                                    name="full_name"
                                    value={updatedData.full_name}
                                    onChange={handleChange}
                                    className="border border-gray-300 p-2 rounded w-full mb-2 text-[#244c56]"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block text-sm font-medium text-gray-700">Titular</label>
                                <input
                                    type="text"
                                    name="headline"
                                    value={updatedData.headline}
                                    onChange={handleChange}
                                    className="border border-gray-300 p-2 rounded w-full mb-2 text-[#244c56]"
                                />
                            </div>

                            <div className="mb-2">
                                <label className="block text-sm font-medium text-gray-700">Cargo</label>
                                <Select
                                    name="job_title"
                                    options={jobTitles}
                                    value={jobTitles.find((job) => job.id === updatedData.job_title?.id) || null} // ✅ Match by ID
                                    onChange={handleJobTitleChange}
                                    className="basic-single-select mt-2 text-[#244c56]"
                                    classNamePrefix="select"
                                    placeholder="Selecciona un cargo..."
                                    isSearchable
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={updatedData.email}
                                    onChange={handleChange}
                                    className="border border-gray-300 p-2 rounded w-full text-[#244c56]"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <h2 className="text-xl font-semibold text-[#244c56]">{talentData?.full_name || "No Name"}</h2>
                            <p className="text-gray-600">{talentData?.headline || "No Headline"}</p>
                            <p className="text-gray-600">
                                {talentData?.job_title?.title ? talentData.job_title.title : "No Title"}
                            </p>
                            <p className="text-gray-600">{talentData?.email || "No Email"}</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
