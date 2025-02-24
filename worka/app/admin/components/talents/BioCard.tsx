import { useState } from "react";
import { FaEdit, FaExclamationCircle, FaSave, FaTimes } from "react-icons/fa";

export default function BioSection({ bio, talentId, onSave }: { 
    bio: string; 
    talentId: number; 
    onSave: (updatedBio: string) => void;
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [updatedBio, setUpdatedBio] = useState(bio);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ✅ Handle Bio Change & Remove Error
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newBio = e.target.value;
        setUpdatedBio(newBio);

        if (newBio.trim().length >= 10) {
            setError(null); // ✅ Clear error when valid
        }
    };

    // ✅ Save Bio
    const handleSave = async () => {
        if (updatedBio.trim().length < 10) {
            setError("La biografía debe tener al menos 10 caracteres.");
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
                throw new Error("Error al actualizar la biografía.");
            }

            onSave(updatedBio); // ✅ Update the main view instantly
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating bio:", error);
            setError("Hubo un problema al actualizar la biografía. Inténtalo nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-6 bg-white shadow-md p-4 rounded relative">
            {/* Header with Edit & Close Button */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#244c56]">Biografía</h2>

                {isEditing ? (
                    <div className="flex space-x-2">
                        <button
                            className="bg-[#244c56] text-white px-4 py-2 rounded hover:bg-[#349390] transition"
                            onClick={handleSave}
                            disabled={loading}
                        >
                            {loading ? "Guardando..." : <><FaSave size={16} className="inline-block mr-2" /> Guardar</>}
                        </button>

                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                            onClick={() => { 
                                setUpdatedBio(bio); 
                                setError(null); // ✅ Clear error on cancel
                                setIsEditing(false); 
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

            {/* Editable Bio */}
            {isEditing ? (
                <>
                    <textarea
                        className={`border p-2 rounded w-full h-32 text-[#244c56] ${
                            error ? "border-red-500" : "border-gray-300"
                        }`}
                        value={updatedBio}
                        onChange={handleChange}
                    />
                    
                    {/* ✅ Error Message */}
                    {error && (
                        <div className="text-red-500 flex items-center gap-2 mt-1">
                            <FaExclamationCircle /> {error}
                        </div>
                    )}
                </>
            ) : (
                <p className="text-gray-600">{bio || "No hay biografía disponible."}</p>
            )}
        </div>
    );
}
