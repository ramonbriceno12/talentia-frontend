"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaBriefcase, FaMapMarkerAlt, FaListUl, FaTrash, FaExclamationCircle, FaUpload } from "react-icons/fa";
import { useAuth } from "../../../utils/authContext";

interface Job {
    id: number;
    title: string;
    company: string;
    location: string;
    is_remote: boolean;
    description: string;
    skills: string[];
    created_at: string;
}

interface Resume {
    id: number;
    resume_url: string;
}

export default function JobDetailsPage() {
    const { id } = useParams(); // Get job ID from URL
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingApply, setLoadingApply] = useState<boolean>(false);
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [selectedResume, setSelectedResume] = useState<number | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [coverLetter, setCoverLetter] = useState<string>("");
    const [showSuccess, setShowSuccess] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [cvError, setCvError] = useState<string | null>(null);
    const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
    const [hasApplied, setHasApplied] = useState<boolean>(false);
    const [applicationData, setApplicationData] = useState<any>(null);
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const { user } = useAuth();
    const talentId = user?.id;

    useEffect(() => {
        if (!token || !id) return;

        const fetchJobDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/jobs/admin/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) throw new Error("Failed to fetch job details");

                const data = await response.json();
                setJob(data);
            } catch (error) {
                console.error("Error fetching job details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetails();
    }, [token, id]);

    useEffect(() => {
        if (talentId && id) {
            fetchResumes();
            checkApplicationStatus();
        }
    }, [talentId, id]);

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

    const checkApplicationStatus = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/applications/check?job_id=${id}&applicant_id=${talentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error("Failed to check application status");

            const data = await response.json();
            setHasApplied(data.hasApplied);
            if (data.hasApplied) {
                setApplicationData(data.application); // Store application data if already applied
            }
        } catch (error) {
            console.error("Error checking application status:", error);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            const validExtensions = ["pdf", "doc", "docx"];
            const fileExtension = file.name.split(".").pop()?.toLowerCase();

            if (!fileExtension || !validExtensions.includes(fileExtension)) {
                setCvError("Formato de archivo inválido. Solo se permiten PDF, DOC y DOCX.");
                setSelectedFile(null);
                return;
            }

            if (file.size > 10 * 1024 * 1024) {
                setCvError("El archivo no debe superar los 10MB.");
                setSelectedFile(null);
                return;
            }

            setSelectedFile(file);
            setCvError(null); // Clear error when valid
        }
    };

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

            // Update UI Immediately
            setResumes((prev) => [...prev, newResume]);

            setSelectedFile(null);
        } catch (error) {
            console.error("Error uploading resume:", error);
            setCvError("Hubo un problema al subir el currículum. Inténtalo nuevamente.");
        } finally {
            setLoadingUpload(false);
        }
    };

    const handleApply = async () => {
        setCvError("");
        setError("");
        setLoadingApply(true);
        setShowSuccess(false);

        if (!selectedResume) {
            setError("Por favor, selecciona un currículum.");
            setLoadingApply(false);
            return;
        }

        if (!token || !user || !job) {
            setError("No autorizado. Por favor, inicia sesión.");
            setLoadingApply(false);
            return;
        }

        try {
            const selectedResumeUrl = resumes.find((resume) => resume.id === selectedResume)?.resume_url;

            if (!selectedResumeUrl) {
                setError("No se pudo encontrar el currículum seleccionado.");
                setLoadingApply(false);
                return;
            }

            const applicationResponse = await fetch(`http://localhost:5000/api/applications`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    job_id: job.id,
                    applicant_id: user.id,
                    resume_url: selectedResumeUrl,
                    cover_letter: coverLetter,
                }),
            });

            if (!applicationResponse.ok) {
                const errorMessage = getErrorMessage(applicationResponse.status);
                setError(errorMessage);
                setLoadingApply(false);
                return;
            }

            const applicationSubmitted = await applicationResponse.json();

            console.log(applicationSubmitted)

            // Update state with the new application data
            setHasApplied(true);
            setApplicationData({
                applied_at: applicationSubmitted.application.applied_at, // Ensure this is a valid date string
                resume_url: applicationSubmitted.application.resume_url,
                cover_letter: applicationSubmitted.application.cover_letter,
            });

            setShowSuccess(true);
        } catch (error) {
            console.error("Error applying for job:", error);
            setError("Hubo un problema al enviar la aplicación. Inténtalo nuevamente.");
        } finally {
            setLoadingApply(false);
        }
    };

    // Helper function to map status codes to user-friendly messages
    const getErrorMessage = (statusCode: number): string => {
        switch (statusCode) {
            case 400:
                return "Datos inválidos. Por favor, revisa la información proporcionada.";
            case 401:
                return "Ya has aplicado a este empleo.";
            case 404:
                return "El empleo no fue encontrado.";
            case 500:
                return "Error en el servidor. Por favor, intenta más tarde.";
            default:
                return "Hubo un problema al enviar la aplicación. Inténtalo nuevamente.";
        }
    };

    return (
        <div className="p-6">
            {loading ? (
                <p className="text-gray-500">Cargando detalles del empleo...</p>
            ) : job ? (
                <>
                    {/* Job Details Card */}
                    <div className="bg-white shadow-md p-6 rounded-lg">
                        <h1 className="text-2xl font-bold text-[#244c56] flex items-center gap-2">
                            <FaBriefcase className="text-blue-500 text-3xl" /> {job.title}
                        </h1>
                        <p className="text-gray-600 text-lg font-semibold mt-2">{job.company}</p>
                        <p className="text-gray-500 text-sm flex items-center gap-2">
                            <FaMapMarkerAlt className="text-gray-400" />
                            {job.is_remote ? "Remoto" : job.location}
                        </p>
                        <p className="text-gray-400 text-xs mt-2">Publicado el {new Date(job.created_at).toLocaleDateString()}</p>

                        <div className="mt-6">
                            <h2 className="text-lg font-semibold text-[#244c56]">Descripción del Empleo</h2>
                            <p className="text-gray-600 mt-2">{job.description}</p>
                        </div>

                        <div className="mt-6">
                            <h2 className="text-lg font-semibold text-[#244c56] flex items-center gap-2">
                                <FaListUl className="text-blue-500" /> Habilidades Requeridas
                            </h2>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {job.skills.map((skill, index) => (
                                    <span key={index} className="px-3 py-1 bg-[#244c56] text-white rounded-full flex items-center">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Application Card */}
                    <div className="bg-white shadow-md p-6 rounded-lg mt-6">

                        {hasApplied ? (
                            // Show application details if already applied
                            <div>
                                <h2 className="text-lg font-semibold text-[#244c56]">¡Aplicación enviada con éxito!</h2>

                                <div className="mt-4">
                                    <p className="text-gray-600">Ya has aplicado a este empleo.</p>
                                    <div className="mt-4">
                                        <p className="text-gray-600">
                                            <strong>Fecha de aplicación:</strong> {new Date(applicationData.applied_at).toLocaleDateString()}
                                        </p>
                                        <p className="text-gray-600">
                                            <strong>Currículum enviado:</strong>{" "}
                                            <a
                                                href={applicationData.resume_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[#244c56] hover:underline"
                                            >
                                                Ver currículum
                                            </a>
                                        </p>
                                        {applicationData.cover_letter && (
                                            <p className="text-gray-600">
                                                <strong>Carta de presentación:</strong> {applicationData.cover_letter}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Show application form if not applied
                            <>
                                <h2 className="text-lg font-semibold text-[#244c56]">Aplicar al Empleo</h2>
                                <p className="text-gray-600 mt-2">Selecciona un currículum existente o sube uno nuevo.</p>

                                {/* Resume Selection */}
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700">Selecciona un currículum</label>
                                    <select
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-[#244c56]"
                                        value={selectedResume || ""}
                                        onChange={(e) => setSelectedResume(Number(e.target.value))}
                                    >
                                        <option value="">Selecciona un currículum</option>
                                        {resumes.map((resume) => (
                                            <option key={resume.id} value={resume.id}>
                                                {decodeURIComponent(resume.resume_url.split("/").pop())}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Upload New Resume */}
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

                                    {/* CV Error Message */}
                                    {cvError && (
                                        <div className="text-red-500 flex items-center gap-2 mt-2">
                                            <FaExclamationCircle /> {cvError}
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

                                {/* Cover Letter Input */}
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700">Carta de presentación (opcional)</label>
                                    <textarea
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-[#244c56]"
                                        rows={4}
                                        placeholder="Escribe tu carta de presentación aquí..."
                                        value={coverLetter}
                                        onChange={(e) => setCoverLetter(e.target.value)}
                                    />
                                </div>

                                {/* Success Message */}
                                {showSuccess && <p className="text-green-500 mt-4 text-md">¡Aplicación enviada con éxito!</p>}

                                {/* Error Message */}
                                {error && (
                                    <div className="text-red-500 flex items-center gap-2 mt-2">
                                        <FaExclamationCircle /> {error}
                                    </div>
                                )}

                                {/* Apply Button */}
                                <button
                                    className="mt-6 bg-[#244c56] text-white px-4 py-2 rounded hover:bg-[#349390] w-full"
                                    onClick={handleApply}
                                    disabled={loadingApply}
                                >
                                    {loadingApply ? "Enviando..." : "Aplicar Ahora"}
                                </button>
                            </>
                        )}
                    </div>
                </>
            ) : (
                <p className="text-gray-500">Este empleo no existe o ha sido eliminado.</p>
            )}
        </div>
    );
}