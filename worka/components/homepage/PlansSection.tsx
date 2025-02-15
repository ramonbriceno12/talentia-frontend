import Link from "next/link";

const PlansSection = () => {
    return (
        <section id="plansSection" className="bg-gray-100 py-16 text-center" style={{
          background: "linear-gradient(90deg, #244c56 50%, #349390 100%)",
      }}>
            {/* Headline */}
            <div className="max-w-4xl mx-auto px-6">
                <h2 className="text-4xl md:text-5xl font-bold text-white">
                    Planes diseñados para potenciar tu éxito
                </h2>
                <p className="text-2xl md:text-3xl text-white mt-3">
                    Selecciona el plan adecuado y deja que{" "}
                    <span className="text-[#10282c] font-bold">Talentia</span> haga el trabajo por ti.
                </p>
            </div>

            {/* Plans Row */}
            <div className="flex flex-col md:flex-row justify-center items-center md:items-stretch gap-6 bg-gray-100 p-6 mt-10" style={{
                background: "linear-gradient(90deg, #244c56 50%, #349390 100%)",
            }}>
                {/* Plan Talento */}
                <div className="relative w-80 bg-white rounded-lg shadow-lg flex flex-col items-center p-6 border border-gray-300 md:min-h-[450px] flex-grow">
                    {/* Icon */}
                    <div className="text-5xl">🎯</div>
                    <h2 className="text-xl font-bold text-gray-700 mt-4">Plan Talento</h2>
                    <p className="text-sm text-gray-600 mt-2 text-center">
                        🔥 Optimiza tu perfil y destaca entre los mejores talentos.
                    </p>
                    <ul className="text-sm text-gray-700 text-left mt-4 space-y-2">
                        <li>✅ Revisión y optimización de CV</li>
                        <li>✅ Mejora de perfil en LinkedIn</li>
                        <li>✅ Asesoría en portfolio y presencia online</li>
                        <li>✅ Entrenamiento para entrevistas</li>
                        <li>✅ Acceso a oportunidades exclusivas</li>
                        <li>✅ Recomendaciones personalizadas de vacantes</li>
                    </ul>
                    <br/>
                    <Link
                        href="https://calendly.com/contacto-talentiave/optimizacion-de-perfil-profesional"
                        target="_blank"
                        className="mt-auto bg-[#349390] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#26766b] transition duration-300"
                    >
                        Agendar sesión 🚀
                    </Link>
                </div>

                {/* Plan Reclutador */}
                <div className="relative w-80 bg-white rounded-lg shadow-lg flex flex-col items-center p-6 border border-gray-300 md:min-h-[450px] flex-grow">
                    {/* Icon */}
                    <div className="text-5xl">📢</div>
                    <h2 className="text-xl font-bold text-gray-700 mt-4">Plan Reclutador</h2>
                    <p className="text-sm text-gray-600 mt-2 text-center">
                        🚀 Publicamos tu vacante y encontramos a los mejores candidatos.
                    </p>
                    <ul className="text-sm text-gray-700 text-left mt-4 space-y-2">
                        <li>✅ Publicación de oferta en nuestra plataforma</li>
                        <li>✅ Difusión en redes sociales y canales especializados</li>
                        <li>✅ Selección y filtrado de candidatos</li>
                        <li>✅ Entrevistas pre-filtro y evaluación de habilidades</li>
                        <li>✅ Contacto directo con los mejores perfiles</li>
                        <li>✅ Reporte detallado de los mejores candidatos</li>
                    </ul>
                    <br/>
                    <Link
                        href="https://calendly.com/contacto-talentiave/30min"
                        target="_blank"
                        className="mt-auto bg-[#349390] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#26766b] transition duration-300"
                    >
                        Agendar sesión 🚀
                    </Link>
                </div>

                {/* Plan Empresa */}
                <div className="relative w-80 bg-white rounded-lg shadow-lg flex flex-col items-center p-6 border border-gray-300 md:min-h-[450px] flex-grow">
                    {/* Icon */}
                    <div className="text-5xl">🏢</div>
                    <h2 className="text-xl font-bold text-gray-700 mt-4">Plan Empresa</h2>
                    <p className="text-sm text-gray-600 mt-2 text-center">
                        💼 Gestionamos todas tus vacantes y encontramos el talento ideal para tu empresa.
                    </p>
                    <ul className="text-sm text-gray-700 text-left mt-4 space-y-2">
                        <li>✅ Gestión completa del proceso de selección</li>
                        <li>✅ Creación y difusión de todas tus ofertas</li>
                        <li>✅ Evaluación técnica y cultural de candidatos</li>
                        <li>✅ Optimización del proceso de contratación</li>
                        <li>✅ Asesoría en estrategias de reclutamiento</li>
                        <li>✅ Soporte continuo y seguimiento post-contratación</li>
                    </ul>
                    <br/>
                    <Link
                        href="https://calendly.com/contacto-talentiave/company-onboarding-meeting"
                        target="_blank"
                        className="mt-auto bg-[#349390] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#26766b] transition duration-300"
                    >
                        Agendar sesión 🚀
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default PlansSection;
