"use client";

import { useState, useEffect } from "react";
import { FaTrash, FaUpload, FaExclamationCircle } from "react-icons/fa";

export default function ResumeUpload({ talentId }: { talentId: number }) {
    const [resumes, setResumes] = useState<{ id: number; resume_url: string }[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loadingUpload, setLoadingUpload] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState<{ [key: number]: boolean }>({});
    const [error, setError] = useState<string | null>(null);
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    // ✅ Fetch existing resumes
    const fetchResumes = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/talents/${talentId}`);
            if (!response.ok) throw new Error("Error al obtener los currículums");
            const data = await response.json();
            setResumes(data.resumes || []);
        } catch (error) {
            console.error("Error fetching resumes:", error);
        }
    };

    useEffect(() => {
        fetchResumes();
    }, [talentId]);

    // ✅ Handle File Selection with Validation
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            const validExtensions = ["pdf", "doc", "docx"];
            const fileExtension = file.name.split(".").pop()?.toLowerCase();

            if (!fileExtension || !validExtensions.includes(fileExtension)) {
                setError("Formato de archivo inválido. Solo se permiten PDF, DOC y DOCX.");
                setSelectedFile(null);
                return;
            }

            if (file.size > 10 * 1024 * 1024) {
                setError("El archivo no debe superar los 10MB.");
                setSelectedFile(null);
                return;
            }

            setSelectedFile(file);
            setError(null); // ✅ Clear error when valid
        }
    };

    // ✅ Upload Resume
    const handleUpload = async () => {
        if (!selectedFile || error) return;
        if (!token) return alert("¡No autorizado! Por favor, inicia sesión.");

        const formData = new FormData();
        formData.append("resume", selectedFile);

        setLoadingUpload(true);
        try {
            const response = await fetch(`http://localhost:5000/api/talents/${talentId}/resumes`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData,
            });

            if (!response.ok) throw new Error("Error al subir el currículum");
            const newResume = await response.json();

            // ✅ Update UI Immediately
            setResumes((prev) => [...prev, newResume]);

            setSelectedFile(null);
        } catch (error) {
            console.error("Error uploading resume:", error);
            setError("Hubo un problema al subir el currículum. Inténtalo nuevamente.");
        } finally {
            setLoadingUpload(false);
        }
    };

    // ✅ Remove Resume
    const handleDelete = async (resumeId: number) => {
        if (!token) return alert("¡No autorizado! Por favor, inicia sesión.");
        if (!confirm("¿Estás seguro de que quieres eliminar este currículum?")) return;

        setLoadingDelete((prev) => ({ ...prev, [resumeId]: true }));

        try {
            const response = await fetch(`http://localhost:5000/api/talents/${talentId}/resumes/${resumeId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` },
            });

            if (!response.ok) throw new Error("Error al eliminar el currículum");

            // ✅ Update UI Immediately
            setResumes((prev) => prev.filter((resume) => resume.id !== resumeId));
        } catch (error) {
            console.error("Error deleting resume:", error);
            setError("Hubo un problema al eliminar el currículum. Inténtalo nuevamente.");
        } finally {
            setLoadingDelete((prev) => ({ ...prev, [resumeId]: false }));
        }
    };

    return (
        <div className="mt-6 bg-white shadow-md p-4 rounded">
            <h2 className="text-xl font-semibold text-[#244c56]">Currículums</h2>

            {/* ✅ Resume List */}
            {resumes.length > 0 ? (
                <ul className="mt-3 space-y-2">
                    {resumes.map((resume) => (
                        <li key={resume.id} className="flex items-center justify-between border p-2 rounded">
                            <a href={resume.resume_url} target="_blank" rel="noopener noreferrer" className="text-[#244c56] underline">
                                {decodeURIComponent(resume.resume_url.split("/").pop())}
                            </a>
                            <button
                                onClick={() => handleDelete(resume.id)}
                                className="text-red-500 hover:text-red-700"
                                disabled={loadingDelete[resume.id]} // ✅ Disable only the clicked button
                            >
                                {loadingDelete[resume.id] ? "Eliminando..." : <FaTrash />}
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500 mt-3">No hay currículums subidos.</p>
            )}

            {/* ✅ File Upload */}
            <div className="mt-4">
                {/* Resume Upload Box */}
                <label htmlFor="resume" className="flex flex-col items-center border-2 border-dashed p-6 rounded-lg hover:border-[#349390] transition cursor-pointer">
                    <input
                        type="file"
                        id="resume"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    {/* Icon */}
                    <div className="text-gray-400 text-3xl mb-2">📄</div>

                    {/* Label */}
                    <p className="text-[#244c56] font-semibold text-center">
                        {selectedFile ? selectedFile.name : "Haz clic para subir tu currículum (PDF, DOC, DOCX) (*)"}
                    </p>

                    {/* File size limit info */}
                    <p className="text-gray-400 text-sm mt-1">El tamaño máximo es de 10MB</p>
                </label>

                {/* ✅ Error Message */}
                {error && (
                    <div className="text-red-500 flex items-center gap-2 mt-2">
                        <FaExclamationCircle /> {error}
                    </div>
                )}

                {/* Upload Button */}
                <button
                    onClick={handleUpload}
                    className="mt-3 bg-[#244c56] text-white px-4 py-2 rounded hover:bg-[#349390] transition flex items-center gap-2 w-full"
                    disabled={loadingUpload || !selectedFile || error !== null}
                >
                    {loadingUpload ? "Subiendo..." : <> <FaUpload /> Subir Currículum</>}
                </button>
            </div>
        </div>
    );
}
