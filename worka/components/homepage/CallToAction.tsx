import { FaLinkedin, FaInstagram } from "react-icons/fa";
import { useRouter } from "next/navigation";
export default function CallToAction() {
    const router = useRouter();
    return (
        <section className="bg-gray-100 py-16 text-center px-6">
      {/* Headline */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
          🚀 ¿ESTÁS LISTO PARA COMENZAR?
        </h2>
        <p className="mt-4 text-2xl md:text-3xl text-gray-700">
          SOLO ESTÁS A UN PASO DE ENCONTRAR{" "}
          <span className="text-[#349390] font-bold">EL TRABAJO DE TUS SUEÑOS</span>
        </p>
      </div>

      {/* Call-to-Action Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4 sm:px-0">
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

      {/* Social Media Icons */}
      <div className="mt-12 flex justify-center space-x-6">
        <a
          href="https://www.instagram.com/talentiave"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-700 hover:text-[#349390] transition"
        >
          <FaInstagram size={40} />
        </a>
        <a
          href="https://www.linkedin.com/company/talentiave/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-700 hover:text-[#349390] transition"
        >
          <FaLinkedin size={40} />
        </a>
      </div>
    </section>
    );
}
