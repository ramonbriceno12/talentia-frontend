const OpenedLettersSection = () => {
    return (
        <section className="bg-gray-100 py-16 text-center">
            {/* Headline */}
            <div className="max-w-4xl mx-auto px-6">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                    Talentia hace el trabajo por ti
                </h2>
                <p className="text-2xl md:text-3xl text-gray-700 mt-3">
                    Conéctate con empresas y consigue oportunidades{" "}
                    <span className="text-[#349390] font-bold">en segundos</span>.
                </p>
            </div>

            {/* Letters Row */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 min-h-[300px] bg-gray-100 p-6 mt-10">
                {/* Card 1 - Job Offer Published */}
                <div className="relative w-64 h-48 bg-white rounded-lg shadow-lg flex flex-col justify-center items-center p-4 border border-gray-300">
                    {/* Checkmark */}
                    <div className="absolute -top-5 bg-[#349390] text-white w-10 h-10 flex items-center justify-center rounded-full shadow-md">
                        ✅
                    </div>
                    <h2 className="text-lg font-bold text-gray-700 mt-4">📢 Oferta Publicada</h2>
                    <p className="text-sm text-gray-600 mt-2 text-center">
                        🎉 ¡Tu oferta de trabajo ya está en línea! Prepárate para recibir candidatos de calidad.
                    </p>
                </div>

                {/* Card 2 - CV Optimized */}
                <div className="relative w-64 h-48 bg-white rounded-lg shadow-lg flex flex-col justify-center items-center p-4 border border-gray-300">
                    {/* Checkmark */}
                    <div className="absolute -top-5 bg-[#349390] text-white w-10 h-10 flex items-center justify-center rounded-full shadow-md">
                        ✅
                    </div>
                    <h2 className="text-lg font-bold text-gray-700 mt-4">📄 CV Optimizado</h2>
                    <p className="text-sm text-gray-600 mt-2 text-center">
                        ✨ ¡Tu CV ha sido mejorado con Talentia y nuestra IA! Destaca entre los demás candidatos.
                    </p>
                </div>

                {/* Card 3 - Received a Job Proposal */}
                <div className="relative w-64 h-48 bg-white rounded-lg shadow-lg flex flex-col justify-center items-center p-4 border border-gray-300">
                    {/* Checkmark */}
                    <div className="absolute -top-5 bg-[#349390] text-white w-10 h-10 flex items-center justify-center rounded-full shadow-md">
                        ✅
                    </div>
                    <h2 className="text-lg font-bold text-gray-700 mt-4">📬 ¡Propuesta Recibida!</h2>
                    <p className="text-sm text-gray-600 mt-2 text-center">
                        💌 ¡Un empleador ha mostrado interés en tu perfil! Revisa la propuesta y responde.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default OpenedLettersSection;
