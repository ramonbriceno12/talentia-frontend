import { FaLinkedin, FaTwitter, FaFacebook, FaInstagram } from "react-icons/fa";

export default function CallToAction() {
    return (
        <section className="py-16 text-center">
            <h2 className="text-4xl font-semibold text-white">
                🚀 ¿ESTÁS Listo para Comenzar?
            </h2>
            <p className="mt-4 text-lg text-white">
                SOLO ESTÁS A UN PASO DE ENCONTRAR EL TRABAJO DE TUS SUEÑOS
            </p>

            {/* Option Buttons */}
            <div className="mt-8 flex justify-center space-x-6">
                <a
                    href="/forms/talent"
                    className="inline-block talentia-button text-white bg-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                    Encontrar Trabajo
                </a>
                <a
                    href="/forms/offer"
                    className="inline-block talentia-button text-white bg-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                    Crear Oferta Laboral
                </a>
            </div>

            {/* Social Icons */}
            <div className="mt-12 flex justify-center space-x-6">
            <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="talentia-text hover:text-blue-800 transition"
                >
                    <FaInstagram size={32} />
                </a>
                <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="talentia-text hover:text-blue-800 transition"
                >
                    <FaLinkedin size={32} />
                </a>
            </div>
        </section>
    );
}
