import React, { useState } from "react";
import { useRouter } from "next/navigation";

// Component for an individual plan card with dropdown features
function PlanCard({ plan, onPlanSelect }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`p-4 rounded-2xl shadow-lg ${plan.bgColor} text-white flex flex-col justify-between`}
    >
      {/* Header Section: Always Visible */}
      <div>
        <h3 className="text-2xl font-bold mb-2">{plan.title}</h3>
        <p className="text-2xl font-semibold">{plan.price}</p>
        <p className="mt-2 text-xl">{plan.description}</p>
      </div>

      {/* Dropdown Toggle & Benefits */}
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="mt-4 flex items-center justify-center focus:outline-none"
        >
          <span className="text-2xl">{isOpen ? "▲" : "▼"}</span>
        </button>
        {isOpen && (
          <ul className="mt-4 text-xl space-y-2">
            {plan.benefits.map((benefit, i) => (
              <li key={i}>{benefit}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Action Button */}
      <button
        onClick={() => onPlanSelect(plan.id.toString())}
        className="mt-6 px-6 py-3 bg-[#10282c] text-white font-semibold rounded-xl"
      >
        ¡Elige este plan!
      </button>
    </div>
  );
}

export default function PlansSection() {
  const router = useRouter();

  const handlePlanSelection = (planId) => {
    // router.push(`/forms/talent/?plan=${planId}`);
    router.push('https://instagram.com/talentiave')
  };

  const plans = [
    {
      id: 1,
      title: "Plan Gratuito",
      price: "Gratis",
      description:
        "Ideal para talentos que buscan iniciarse en la optimización de su perfil profesional con recursos básicos.",
      benefits: [
        "✅ Checklist en PDF con estrategias clave para mejorar tu CV, LinkedIn y portafolio.",
        "✅ El PDF se enviará a tu correo electrónico tras el registro.",
        "✅ Orientación básica para optimizar tu presencia profesional.",
      ],
      bgColor: "bg-[#244c56]",
    },
    {
      id: 2,
      title: "Plan Regular",
      price: "$15",
      description:
        "Para talentos que desean asesoría personalizada para mejorar su perfil y aumentar sus oportunidades laborales.",
      benefits: [
        "✅ Checklist en PDF con estrategias clave para mejorar tu CV, LinkedIn y portafolio.",
        "✅ Sesión 1-1 de 45 minutos con un experto para revisar y optimizar tu perfil.",
        "✅ Análisis detallado de tus fortalezas y debilidades para mejorar tu visibilidad.",
        "✅ Consejos estratégicos sobre cómo postular a trabajos y ampliar tu red de contactos.",
      ],
      bgColor: "bg-[#0e7c7b]",
    },
    {
      id: 3,
      title: "Plan Premium",
      price: "$30",
      description:
        "Para talentos que desean una fuerte presencia digital, máxima exposición y acceso directo a oportunidades laborales.",
      benefits: [
        "✅ Todo lo incluido en el Plan Regular",
        "✅ Optimización avanzada del perfil de LinkedIn con integración de palabras clave estratégicas.",
        "✅ Revisión y mejora del CV con redacción y optimización profesional.",
        "✅ Creación de portafolio personalizado con diseño profesional y branding personal.",
        "✅ Publicación destacada en Instagram y historia permanente en nuestro perfil.",
        "✅ Posicionamiento prioritario en nuestro directorio de talentos.",
        "✅ Aplicación directa a vacantes de empresas que busquen perfiles como el tuyo.",
        "✅ Visibilidad en nuestro sitio web e Instagram como talento disponible.",
        "✅ Estrategia personalizada de marca profesional y acompañamiento en procesos de reclutamiento.",
        "✅ Postulación ilimitada a vacantes en nuestra plataforma.",
        "✅ Feedback personalizado para mejorar tus postulaciones.",
      ],
      bgColor: "bg-[#ff4612]",
    },
  ];

  return (
    <section className="py-8 pt-20 pb-20 bg-gray-100 text-gray-900">
      {/* Use a full-width container with minimal horizontal padding */}
      <div className="mx-auto max-w-full px-2 text-center">
        <h2 className="text-4xl font-bold mb-4">
          Planes de Exposición y Optimización
        </h2>
        <p className="text-lg mb-8">
          Mejora tu perfil, gana visibilidad y conéctate con empresas de todo el
          mundo. Elige el plan que mejor se adapte a tus necesidades.
        </p>

        {/* Grid layout */}
        <div className="grid md:grid-cols-3 gap-4 items-start">
          {plans.map((plan, index) => (
            <PlanCard
              key={index}
              plan={plan}
              onPlanSelect={handlePlanSelection}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
