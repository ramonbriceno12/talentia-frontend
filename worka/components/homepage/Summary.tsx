const TalentiaveSummary = () => {
  return (
    <section
      className="relative pt-12 w-full min-h-[500px] flex flex-col bg-white text-gray-900 pb-8"
      style={{
        background: "linear-gradient(90deg, #244c56 50%, #349390 100%)",
      }}
    >
      <div className="container mx-auto px-6 flex flex-col items-center text-center relative z-10">
        {/* Centered Text */}
        <div className="max-w-3xl text-white">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            🌟 El talento correcto en el lugar adecuado 🌟
          </h2>
          <p className="text-xl mb-4">
            En 🚀 <strong>Talentiave</strong>, conectamos a los mejores profesionales con empresas que buscan potenciar sus equipos, ya sea en modalidad remota, híbrida o presencial. 🏢💻🌍
          </p>
          <p className="text-lg">
            🔹 <strong>Si eres talento</strong>, optimizamos tu perfil, mejoramos tu CV 📄 y potenciamos tu portafolio 💼 para que consigas la oportunidad que mereces.
          </p>
          <p className="text-lg mt-2">
            🔹 <strong>Si eres empresa</strong>, te conectamos con talento altamente calificado 🎯, agilizando el proceso de selección para que encuentres al candidato ideal sin complicaciones.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TalentiaveSummary;
