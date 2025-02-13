import { useState } from "react";
import TypingEffect from "./HeroText";
import { useRouter } from "next/navigation";

export default function HeroSection() {
    const router = useRouter();
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
        <section className="relative pt-36 w-full min-h-[500px] flex flex-col bg-white text-gray-900 pb-12" style={{
            background: "linear-gradient(90deg, #244c56 50%, #349390 100%)",
        }}>

            <div className="container mx-auto px-6 flex flex-col items-center text-center relative z-10">
                <div className="max-w-3xl">
                    {/* Typing Effect Placeholder */}
                    <div className="flex flex-col items-start sm:items-center text-left sm:text-center w-full max-w-3xl">
                        {/* Title */}
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl text-white font-bold leading-tight">
                            Agiliza tu búsqueda de empleo o encuentra el talento ideal 🚀
                        </h1>

                        {/* Paragraph */}
                        <p className="mt-4 text-2xl text-white leading-relaxed">
                            Talentia y nuestra IA encuentra los mejores candidatos en minutos. Optimiza tu proceso de contratación ahora.
                        </p>

                        {/* Buttons - Now properly aligned */}
                        <div className="mt-6 flex flex-col sm:flex-row justify-start sm:justify-center gap-4 w-full">
                            <button
                                onClick={() => router.push("/forms/talent/")}
                                className="bg-white text-[#244c56] font-bold py-3 px-6 rounded-full text-lg shadow-lg hover:bg-gray-100 transition w-full sm:w-auto"
                            >
                                💼 Regístrate como Talento →
                            </button>

                            <button
                                onClick={() => router.push("/forms/offer/")}
                                className="bg-white text-[#244c56] font-bold py-3 px-6 rounded-full text-lg shadow-lg hover:bg-gray-100 transition w-full sm:w-auto"
                            >
                                📄 Publicar Oferta de Trabajo →
                            </button>
                        </div>
                    </div>


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
