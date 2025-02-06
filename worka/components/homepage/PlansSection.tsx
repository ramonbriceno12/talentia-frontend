import React, { useState } from "react";
import { useRouter } from "next/navigation";


function formatPrice(priceStr) {
  // If the price is "Gratis", just return it
  if (priceStr.toLowerCase() === "gratis") {
    return priceStr;
  }

  // Extract the numeric part (handles cases like "$15" and "Desde $50")
  const numericValue = parseFloat(priceStr.replace(/[^0-9.]/g, ""));
  if (isNaN(numericValue)) return priceStr; // Fallback in case of error

  // If the original string includes "Desde", keep it in the output
  if (priceStr.includes("Desde")) {
    return `Desde $${numericValue.toFixed(2)}`;
  }
  return `$${numericValue.toFixed(2)}`;
}
// Component for an individual plan card with dropdown features
function PlanCard({ plan, onPlanSelect }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`p-4 rounded-2xl shadow-lg ${plan.bgColor} text-white flex flex-col justify-between`}
    >
      {/* Header Section: Always Visible */}
      <br />
      <div>
        <h3 className="text-3xl font-bold mb-2">{plan.title}</h3>
        <p className="text-2xl font-semibold">
          {formatPrice(plan.price)}
        </p>
        <br />
        <p className="mt-2 text-2xl">{plan.description}</p>
      </div>
      <br />
      {/* Dropdown Toggle & Benefits */}
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="mt-4 flex items-center justify-center focus:outline-none"
        >
          <span className="text-2xl">{isOpen ? "▲ Ocultar" : "▼ Mostrar Beneficios"}</span>
        </button>
        {isOpen && (
          <ul className="mt-4 text-xl space-y-2 text-left">
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
  // State to track which type of plans to display ("talent" or "company")
  const [selectedType, setSelectedType] = useState("talent");

  // Update the route based on the selected plan type.
  const handlePlanSelection = (planId) => {
    if (selectedType === "talent") {
      router.push(`/forms/talent/?plan=${planId}`);
    } else {
      router.push(`/forms/company/?plan=${planId}`);
    }
  };

  // Data for talent plans
  const talentPlans = [
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
      price: "$25",
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
      price: "$50",
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

  // Data for the single company plan
  const companyPlans = [
    {
      id: 4,
      title: "Plan Empresa",
      price: "Desde $70",
      description:
        "Nos encargamos de todo el proceso de reclutamiento para que encuentres el talento ideal sin complicaciones. Explícanos tu vacante o proyecto, y nosotros hacemos el resto.",
      benefits: [
        "✅ Publicación y promoción de tu oferta en nuestra plataforma y redes sociales.",
        "✅ Búsqueda activa de talentos calificados según tu perfil.",
        "✅ Filtros y preselección de candidatos para que solo recibas perfiles adecuados.",
        "✅ Entrevistas iniciales con los candidatos para validar experiencia y habilidades.",
        "✅ Aplicación de pruebas técnicas si el cargo lo requiere.",
        "✅ Presentación de un shortlist con los mejores talentos listos para entrevista final.",
        "✅ Asesoría en la elección del candidato ideal.",
        "✅ Seguimiento post-contratación para garantizar la mejor integración del talento a tu empresa.",
      ],
      bgColor: "bg-[#244c56]",
    },
  ];


  // Decide which plans to display based on the selected type
  const plansToDisplay = selectedType === "talent" ? talentPlans : companyPlans;

  return (
    <section className="py-8 pt-20 pb-20 bg-gray-100 text-gray-900">
      <div className="mx-auto max-w-full px-2 text-center">
        <h2 className="text-4xl font-bold mb-4">
          {selectedType === "talent"
            ? "Planes de Exposición y Optimización para Talentos"
            : "Plan para Empresas"}
        </h2>
        <p className="text-2xl mb-8">
          {selectedType === "talent"
            ? "Mejora tu perfil profesional, gana visibilidad y conéctate con empresas o proyectos que se ajusten a tu experiencia. Elige el plan que mejor se adapte a tus necesidades."
            : "Potencia la marca de tu empresa, accede a talentos de calidad y mejora tu estrategia de reclutamiento."}
        </p>

        {/* Toggle Buttons */}
        <div className="flex justify-center mb-8">
          <button
            className={`mx-2 px-4 py-2 rounded ${selectedType === "talent"
              ? "bg-[#244c56] text-white"
              : "bg-gray-200 text-gray-600"
              }`}
            onClick={() => setSelectedType("talent")}
          >
            Talento
          </button>
          <button
            className={`mx-2 px-4 py-2 rounded ${selectedType === "company"
              ? "bg-[#244c56] text-white"
              : "bg-gray-200 text-gray-600"
              }`}
            onClick={() => setSelectedType("company")}
          >
            Empresa
          </button>
        </div>

        {/* Grid layout for plans */}
        <div
          className={`grid ${selectedType === "talent" ? "md:grid-cols-3" : "md:grid-cols-1"
            } gap-4 items-start`}
        >
          {plansToDisplay.map((plan, index) => (
            <PlanCard key={index} plan={plan} onPlanSelect={handlePlanSelection} />
          ))}
        </div>
      </div>
    </section>
  );
}
