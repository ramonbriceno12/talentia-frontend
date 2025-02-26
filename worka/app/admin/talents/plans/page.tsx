"use client";

import { FaCheck, FaCrown, FaStar, FaRocket } from "react-icons/fa";

const plans = [
    {
        name: "Básico",
        price: "$0",
        features: [
            "Perfil Básico",
            "5 Solicitudes de Empleo/Mes",
            "Soporte por Email",
            "Visibilidad Limitada",
        ],
        cta: "Comenzar",
        recommended: false,
    },
    {
        name: "Profesional",
        price: "$25",
        features: [
            "Solicitudes Ilimitadas",
            "Filtros Avanzados",
            "Impulso de Perfil",
            "Perfil Personalizable",
            "Soporte Prioritario",
        ],
        cta: "Elegir Profesional",
        recommended: true, // Destacar este plan
    },
    {
        name: "Élite",
        price: "$60",
        features: [
            "Todas las Características Profesionales",
            "Posición Destacada",
            "Acceso Directo a Reclutadores",
            "Asesoramiento de Carrera Personalizado",
            "Listados de Empleo Exclusivos",
        ],
        cta: "Elegir Élite",
        recommended: false,
    },
];

export default function PlanSelection() {
    return (
        <div className="bg-[#f7fafc] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Tarjeta de Planes */}
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-3xl font-bold text-center text-[#244c56] mb-8">
                        Elige Tu Plan
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {plans.map((plan, index) => (
                            <div
                                key={index}
                                className={`bg-white p-6 rounded-lg shadow-md ${plan.recommended
                                    ? "border-2 border-[#ff4612] transform scale-105"
                                    : "border border-gray-200"
                                    }`}
                            >
                                {plan.recommended && (
                                    <div className="text-center mb-4">
                                        <span className="bg-[#ff4612] text-white px-3 py-1 rounded-full text-sm font-semibold">
                                            Más Popular
                                        </span>
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold text-center text-[#244c56] mb-4">
                                    {plan.name}
                                </h3>
                                <p className="text-4xl font-bold text-center text-[#ff4612] mb-6">
                                    {plan.price}
                                    <span className="text-lg text-gray-500">/mes</span>
                                </p>
                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center">
                                            <FaCheck className="text-green-500 mr-2" />
                                            <span className="text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    className={`w-full py-3 font-semibold rounded-lg ${plan.recommended
                                        ? "bg-[#ff4612] text-white hover:bg-[#e53e1e]"
                                        : "bg-[#244c56] text-white hover:bg-[#1a3640]"
                                        }`}
                                >
                                    {plan.cta}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tarjeta de Comparación de Planes */}
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h3 className="text-2xl font-bold text-center text-[#244c56] mb-8">
                        Comparación de Planes
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-lg shadow-lg">
                            <thead>
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        Característica
                                    </th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                                        Básico
                                    </th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                                        Profesional
                                    </th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                                        Élite
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    "Solicitudes de Empleo",
                                    "Visibilidad del Perfil",
                                    "Perfil Personalizable",
                                    "Soporte Prioritario",
                                    "Acceso Directo a Reclutadores",
                                    "Asesoramiento de Carrera",
                                ].map((feature, index) => (
                                    <tr key={index} className="border-t border-gray-200">
                                        <td className="px-6 py-4 text-sm text-gray-700">{feature}</td>
                                        <td className="px-6 py-4 text-center text-sm text-gray-700">
                                            {index === 0 ? "5/mes" : index < 3 ? "✓" : "✗"}
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm text-gray-700">
                                            {index < 4 ? "✓" : "✗"}
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm text-gray-700">✓</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Tarjeta de Testimonios */}
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h3 className="text-2xl font-bold text-center text-[#244c56] mb-8">
                        Confiado por Talentos en Todo el Mundo
                    </h3>
                    <div className="flex justify-center space-x-12">
                        <FaStar className="text-yellow-400 text-4xl" />
                        <FaRocket className="text-[#ff4612] text-4xl" />
                        <FaCrown className="text-[#244c56] text-4xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}