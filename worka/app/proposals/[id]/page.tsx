'use client';

import Footer from "@/components/homepage/Footer";
import Navbar from "@/components/homepage/Navbar";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Talent {
    id: number;
    full_name: string;
    email: string;
    bio: string | null;
    profile_picture: string | null;
    resume_file: string | null;
    job_title: { title: string } | null;
    skills: { id: number; name: string; category: string }[];
}

export default function ProposalPage() {
    const params = useParams();
    const { id: uuid } = params as { id?: string };
    const [decodedId, setDecodedId] = useState<number | null>(null);
    const [talent, setTalent] = useState<Talent | null>(null);
    const [expandedBio, setExpandedBio] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    // Estados del formulario
    const [userType, setUserType] = useState("recruiter");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [description, setDescription] = useState("");
    console.log("UUID from URL:", uuid);

    // 🔹 First, decode the UUID
    useEffect(() => {
        if (uuid) {
            try {
                const storedUUIDs = JSON.parse(localStorage.getItem("talentUUIDs") || "{}");

                // Reverse lookup: Find the talentId corresponding to this UUID
                const originalId = Object.keys(storedUUIDs).find(
                    key => storedUUIDs[key] === uuid
                );

                if (originalId) {
                    setDecodedId(Number(originalId)); // Convert back to number
                } else {
                    console.error("UUID not found in localStorage");
                    setLoading(false);
                }

                console.log("Decoded ID:", originalId, storedUUIDs);
            } catch (error) {
                console.error("Invalid encoded UUID", error);
                setLoading(false);
            }
        }
    }, [uuid]);

    // 🔹 After decodedId is set, fetch the talent data
    useEffect(() => {
        if (decodedId !== null) {
            fetch(`https://talentiave.com/api/api/talents/${decodedId}`)
                .then(response => response.json())
                .then(data => {
                    setTalent(data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Error obteniendo el talento:", error);
                    setLoading(false);
                });
        }
    }, [decodedId]); // Fetch only when decodedId is available

    // Manejo del envío del formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const proposalData = {
            userType,
            name,
            email,
            description,
            talentId: decodedId
        };

        try {
            const response = await fetch("https://talentiave.com/api/api/upload/proposal", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(proposalData)
            });

            if (response.ok) {
                setMessage('✅ ¡Propuesta enviada con éxito, revisa la bandeja de entrada de tu email!')
                setIsSubmitting(false);
                setName("");
                setEmail("");
                setDescription("");
            } else {
                setMessage('❌ ¡Hubo un error al enviar la propuesta!')
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error("Error enviando la propuesta:", error);
            setMessage('❌ ¡Hubo un error al enviar la propuesta!')
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="text-center mt-10">Cargando...</div>;
    if (!talent) return <div className="text-center mt-10 text-red-500">Talento no encontrado</div>;

    return (
        <div>
            <div className="mt-10">
                <Navbar />
            </div>
            <div className="bg-gray-100 min-h-screen flex flex-col items-center p-6 pt-10">
                <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
                    {/* Avatar y nombre */}
                    <div className="flex items-center space-x-4">
                        <img
                            src={talent.profile_picture || "/img/default-user.png"}
                            alt={talent.full_name.split(" ")[0]}
                            className="w-20 h-20 rounded-full"
                        />
                        <div>
                            <h2 className="text-2xl text-[#10282c] font-bold">{talent.full_name.split(" ")[0]}</h2>
                            <p className="text-gray-600">{talent.job_title?.title || "Sin título"}</p>
                        </div>
                    </div>

                    {/* Bio con botón de "Ver más" */}
                    <div className="mt-4">
                        <p className="text-gray-700 whitespace-pre-wrap">
                            {expandedBio
                                ? talent.bio
                                : talent.bio?.substring(0, 300) || "Sin bio"}
                        </p>
                        {talent.bio && talent.bio.length > 300 && (
                            <button
                                onClick={() => setExpandedBio(!expandedBio)}
                                className="text-[#10282c] text-sm mt-1"
                            >
                                {expandedBio ? "▲ Ver menos" : "▼ Ver más"}
                            </button>
                        )}
                    </div>

                    {/* Skills */}
                    <div className="mt-4">
                        <h3 className="text-lg text-[#10282c] font-semibold">Habilidades</h3>
                        <div className="flex flex-wrap mt-2">
                            {talent.skills.map(skill => (
                                <span
                                    key={skill.id}
                                    className="bg-gray-200 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full m-1"
                                >
                                    {skill.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Datos restringidos */}
                    <div className="mt-6 bg-gray-100 p-4 rounded-lg text-gray-500">
                        <p className="text-sm">Para ver el correo electrónico y el CV de este talento, necesitas un plan premium.</p>
                    </div>

                    {/* Formulario de propuesta */}
                    <div className="mt-6">
                        <h3 className="text-lg text-[#10282c] font-semibold">Enviar una propuesta</h3>
                        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                            <label className="block">
                                <span className="text-gray-700">Tipo de usuario</span>
                                <select
                                    value={userType}
                                    onChange={(e) => setUserType(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded mt-1 text-[#10282c]"
                                    required
                                >
                                    <option value="talent">Talento</option>
                                    <option value="recruiter">Reclutador</option>
                                    <option value="company">Empresa</option>
                                </select>
                            </label>

                            <label className="block">
                                <span className="text-gray-700">Nombre</span>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded mt-1 text-[#10282c]"
                                />
                            </label>

                            <label className="block">
                                <span className="text-gray-700">Correo Electrónico</span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded mt-1 text-[#10282c]"
                                />
                            </label>

                            <label className="block">
                                <span className="text-gray-700">Descripción</span>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded mt-1 h-24 text-[#10282c]"
                                />
                            </label>

                            <button
                                type="submit"
                                className="w-full bg-[#10282c] text-white px-4 py-2 rounded-lg hover:bg-[#244c56]"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Enviando...' : 'Enviar Propuesta 🚀'}
                            </button>
                            {/* Success/Error Message */}
                            {message && (
                                <p className={`mt-4 text-lg ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                                    {message}
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
