import { useState } from "react";
import TypingEffect from "./HeroText";

export default function HeroSection() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [subscriberEmail, setSubscriberEmail] = useState("");
    const [subscriberName, setSubscriberName] = useState("");
    const [submissionStatus, setSubmissionStatus] = useState("");
    const [loading, setLoading] = useState('Enviar');
    const [submitDisabled, setSubmitDisabled] = useState(false);

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    const openModal = () => {
        // Reset submission status and email whenever we open the modal
        setSubmissionStatus(null);
        setSubscriberEmail("");
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const submitSubscriber = async (e) => {
        e.preventDefault();
        setLoading('Enviando...');
        setSubmitDisabled(true);
        try {
            const response = await fetch(
                "https://talentiave.com/api/api/actions/subscription/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email: subscriberEmail, name: subscriberName }),
                }
            );

            if (response.ok) {
                setSubmissionStatus("success");
                setLoading('Enviar');
                setSubmitDisabled(false);
            } else {
                setSubmissionStatus("error");
                setLoading('Enviar');
                setSubmitDisabled(false);
            }
        } catch (error) {
            console.error("Error sending subscriber email:", error);
            setSubmissionStatus("error");
            setLoading('Enviar');
            setSubmitDisabled(false);
        }
    };

    return (
        <section className="relative pt-36 w-full min-h-[500px] flex flex-col bg-white text-gray-900">
            {/* Main Content Container */}
            <div className="container mx-auto px-6 flex flex-col items-center text-center relative z-10">
                <div className="max-w-3xl">
                    {/* Fixed Height for Typing Effect */}
                    <div className="h-[250px] py-6 flex items-center justify-center mb-6">
                        <TypingEffect />
                    </div>

                    <p className="mt-12 text-2xl">
                        NUESTRA IA TE CONECTA CON CANDIDATOS DE ALTA CALIDAD, PRE-EVALUADOS Y
                        LISTOS PARA UNIRSE A TU EQUIPO EN TIEMPO RÉCORD✨
                    </p>
                </div>
            </div>
            <br />

            {/* Promotional Banner – Full Page Width */}
            <div className="w-full">
                <div className="bg-[#244c56] text-white text-center py-3 px-4">
                    <p className="text-1xl">
                        ¡Oferta Especial!, obtén un PDF totalmente gratuito con un paso a paso para optimizar tu perfil profesional.
                    </p>
                    {/* Button to trigger modal */}
                    <button
                        onClick={openModal}
                        className="mt-4 bg-white text-[#244c56] font-bold py-2 px-4 rounded"
                    >
                        Obtener PDF
                    </button>
                </div>
            </div>

            {/* Sidebar Overlay (if applicable) */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={closeSidebar}
                ></div>
            )}

            {/* Modal for Email Submission */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    {/* Background overlay */}
                    <div
                        className="fixed inset-0 bg-black opacity-50"
                        onClick={closeModal}
                    ></div>
                    {/* Modal content */}
                    <div className="relative bg-white p-8 rounded-lg shadow-lg z-10 max-w-md w-full mx-4">
                        {/* Close button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl font-bold"
                        >
                            &times;
                        </button>
                        {submissionStatus === "success" ? (
                            <div className="text-center">
                                <h2 className="text-xl font-bold mb-2">¡Gracias por suscribirte!</h2>
                                <p className="text-sm text-gray-600 mb-4">
                                    Hemos enviado el PDF a tu correo electrónico.
                                </p>
                                <button
                                    onClick={closeModal}
                                    className="bg-[#244c56] text-white py-2 px-4 rounded"
                                >
                                    Cerrar
                                </button>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-xl font-bold mb-2">Ingresa tus datos</h2>
                                <p className="text-sm text-gray-600 mb-4">
                                    Enviaremos el PDF a tu correo electrónico.
                                </p>
                                {submissionStatus === "error" && (
                                    <p className="text-sm text-red-500 mb-4">
                                        Hubo un error al enviar tu suscripción. Por favor, inténtalo de nuevo.
                                    </p>
                                )}
                                <form onSubmit={submitSubscriber}>
                                    <input 
                                        type="text" 
                                        placeholder="Tu nombre" 
                                        className="border border-gray-300 p-2 w-full rounded mb-4" 
                                        value={subscriberName} 
                                        onChange={(e) => setSubscriberName(e.target.value)} 
                                        required 
                                    />
                                    <input
                                        type="email"
                                        placeholder="tuemail@ejemplo.com"
                                        className="border border-gray-300 p-2 w-full rounded mb-4"
                                        value={subscriberEmail}
                                        onChange={(e) => setSubscriberEmail(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className="bg-[#244c56] text-white py-2 px-4 rounded w-full"
                                        disabled={submitDisabled}
                                    >
                                        {loading}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
