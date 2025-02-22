'use client'
import { useState, Suspense, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Select from 'react-select';
import Footer from '@/components/homepage/Footer';
import Navbar from '@/components/homepage/Navbar';

const steps = [
  { id: 1, label: 'Personal Info' },
  { id: 2, label: 'Upload Resume' },
];

function MultiStepFormComponent() {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams); // Convert to URLSearchParams object
  const plan = params.get('plan') || 1; // Default to 'Usuario' if no name is found
  const [jobTitles, setJobTitles] = useState([]);
  const [skills, setSkills] = useState([]);
  const [countries, setCountries] = useState([]);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    resume: null,
    avatar: null,
    job_title: '',
    plan_id: plan,
    skills: [], // Make sure skills is always an array
    country: '',
    years_of_experience: 0,
    expected_salary: 0,
    links: [{ link_type: "", url: "" }],
    job_type: ""
  });

  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [fileError, setFileError] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {

    const fetchJobTitles = async () => {
      try {
        const response = await fetch('https://talentiave.com/api/api/job-titles');
        const data = await response.json();
        setJobTitles(data);
      } catch (error) {
        console.error('Error fetching job titles:', error);
      }
    };

    const fetchSkills = async () => {
      try {
        const response = await fetch('https://talentiave.com/api/api/skills');
        const data = await response.json();
        setSkills(data);
      } catch (error) {
        console.error('Error fetching job titles:', error);
      }
    };

    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();

        const countryOptions = data.map((country) => ({
          value: country.name.common, // Using country code as value
          label: `${country.flag} ${country.name.common}`, // Displaying common name
        }));

        setCountries(countryOptions)

      } catch (error) {
        console.error('Error fetching countries')
      }
    }

    fetchJobTitles();
    fetchSkills();
    fetchCountries();

  }, []);

  const handleCountryChange = (selectedOption) => {
    setFormData((prev) => ({ ...prev, country: selectedOption?.value || "" }));
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // Handle Links Change
  const handleLinkChange = (index, field, value) => {
    const updatedLinks = [...formData.links];
    updatedLinks[index][field] = value;
    setFormData((prev) => ({ ...prev, links: updatedLinks }));
  };

  // Add New Link Field
  const addLink = () => {
    setFormData((prev) => ({
      ...prev,
      links: [...prev.links, { link_type: "", url: "" }],
    }));
  };

  // Remove Link Field
  const removeLink = (index) => {
    const updatedLinks = formData.links.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, links: updatedLinks }));
  };

  const handleFormChange = (e: any) => {
    const { name, value, files } = e.target;
    if (name === "name") {
      // Regex to allow only letters (including accents) and spaces, rejecting emails and numbers
      const nameRegex = /^(?!.*\b(gmail|hotmail|yahoo|outlook|icloud|mail|email|com|net|org|info|biz|dot|arroba)\b)[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

      if (!nameRegex.test(value) || /\d/.test(value)) {
        setMessage("❌ Ingresa un nombre válido sin números, correos o palabras no permitidas.");
        return;
      }
    }
    if (files) {
      const file = files[0];
      if (name === 'resume' && file && file.type !== 'application/pdf') {
        setFileError('❌ Solo se permiten archivos en formato PDF.');
        return;
      }

      if (name === 'avatar' && file) {
        const reader = new FileReader();
        reader.onload = () => setAvatarPreview(reader.result);
        reader.readAsDataURL(file);
      }



      setFileError('');
    }
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleJobTitleChange = (selectedOption: any) => {
    setFormData((prev) => ({
      ...prev,
      job_title: selectedOption.value, // Store only one selected job title
    }));
  };

  const handleSkillsChange = (selectedOptions: any) => {
    setFormData((prev) => ({
      ...prev,
      skills: selectedOptions.map((option: any) => option.value), // Store only skill names in state
    }));
  }

  const toggleJobType = (value) => {
    let selectedTypes = formData.job_type ? formData.job_type.split("/") : [];

    if (selectedTypes.includes(value)) {
      selectedTypes = selectedTypes.filter((t) => t !== value); // Remove if selected
    } else {
      selectedTypes.push(value); // Add if not selected
    }

    setFormData((prev) => ({
      ...prev,
      job_type: selectedTypes.join("/"), // Convert array to string with "/"
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const missingFields = [];

    if (!formData.name) missingFields.push("Nombre");
    if (!formData.email) missingFields.push("Correo electrónico");
    if (!formData.resume) missingFields.push("Currículum");
    if (!formData.avatar) missingFields.push("Foto de perfil");
    if (!formData.job_title) missingFields.push("Cargo");
    if (!formData.skills.length) missingFields.push("Habilidades");
    if (!formData.country) missingFields.push("Pais");
    if (!formData.years_of_experience) missingFields.push('Tiempo de Experiencia')
    if (!formData.expected_salary) missingFields.push('Expectativa Salarial')
    if (!formData.job_type) missingFields.push('Preferencia de Tipo de Trabajo');

    if (missingFields.length > 0) {
      setMessage(`⚠️ Faltan los siguientes campos: ${missingFields.join(", ")}.`);
      return;
    }
    setIsSubmitting(true);
    setMessage('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      if (formData.avatar) formDataToSend.append('avatar', formData.avatar);
      formDataToSend.append('resume', formData.resume);
      formDataToSend.append('job_title', formData.job_title);
      formDataToSend.append('plan_id', plan);
      formDataToSend.append('country', formData.country);
      formDataToSend.append('years_of_experience', formData.years_of_experience);
      formDataToSend.append('expected_salary', formData.expected_salary);
      formDataToSend.append('links', JSON.stringify(formData.links));
      formDataToSend.append('job_type', formData.job_type);

      if (Array.isArray(formData.skills) && formData.skills.length > 0) {
        formDataToSend.append('skills', formData.skills.join(",")); // Convert array to a comma-separated string
      }

      const response = await fetch('https://talentiave.com/api/api/upload/talent', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) throw new Error('Error al enviar el formulario');

      setMessage('✅ ¡Formulario enviado con éxito!');
      setTimeout(() => {
        router.push(`/forms/talent/success?name=${formData.name}`);
      }, 3000);
    } catch (error) {
      setMessage('❌ Error al enviar el formulario. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='bg-gray-100'>
      <div className='mt-10'>
        <Navbar />
      </div>
      <div className="min-h-screen flex flex-col bg-gray-200 items-center justify-center text-white px-4 sm:px-6 lg:px-8 mb-8 pt-12">
        <motion.div
          key={step}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg text-gray-900"
        >
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div>
                <h2 className="text-3xl font-semibold">Información Personal</h2>
                <p className="mb-6 text-gray-600">Campos obligatorios (*)</p>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-lg">Nombre (*)</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className="w-full p-3 rounded border focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-lg">Correo Electrónico (*)</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    className="w-full p-3 rounded border focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="country" className="block text-lg">País (*)</label>
                  <Select
                    name="countries"
                    options={countries} // Use the formatted country data
                    value={
                      formData.country
                        ? countries.find((c) => c.value === formData.country) // Ensure it displays correctly
                        : null
                    }
                    onChange={handleCountryChange}
                    className="basic-single-select"
                    classNamePrefix="select"
                    placeholder="Selecciona tu país..."
                    isSearchable
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="avatar" className="block text-lg font-medium">
                    Foto PNG o JPG (*)
                  </label>

                  <div className="flex items-center space-x-4 mt-2">
                    {/* Image Preview */}
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar Preview"
                        className="w-16 h-16 rounded-full border border-gray-300 shadow-sm"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        📷
                      </div>
                    )}

                    {/* File Upload Button */}
                    <label
                      htmlFor="avatar"
                      className="px-5 py-2 bg-[#10282c] text-white font-medium rounded-lg cursor-pointer hover:bg-[#244c56] transition shadow-md"
                    >
                      Subir Foto
                    </label>

                    {/* Hidden File Input */}
                    <input
                      type="file"
                      id="avatar"
                      name="avatar"
                      accept="image/png, image/jpeg"
                      onChange={handleFormChange}
                      className="hidden"
                      required
                    />
                  </div>

                  {/* Subtle File Size Info */}
                  <p className="text-gray-400 text-xs mt-2">
                    El tamaño máximo es de 10MB
                  </p>
                </div>

              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-3xl font-semibold">Sube tu Currículum</h2>
                <p className="mb-6 text-gray-600">Campos obligatorios (*)</p>
                <div className="mb-4">
                  <label htmlFor="years_of_experience" className="block text-lg">Tiempo de Experiencia (*)</label>
                  <input
                    type="range"
                    id="years_of_experience"
                    name="years_of_experience"
                    min="0"
                    max="50"
                    value={formData.years_of_experience}
                    onChange={(e) => {
                      const value = Math.min(50, Math.max(0, Number(e.target.value))); // Ensures value is between 0-50
                      handleFormChange({ target: { name: 'years_of_experience', value } });
                    }}
                    className="w-full mt-3 range-input"
                  />

                  <div className="flex justify-between text-sm text-gray-500">
                    <span>0</span>
                    <span className="text-[#244c56]">{formData.years_of_experience}</span>
                    <span>50</span>
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="expected_salary" className="block text-lg">Expectativa Salarial / Mes (*)</label>

                  <input
                    type="range"
                    id="expected_salary"
                    name="expected_salary"
                    min="0"
                    max="20000"
                    step="100" // Adjusts increments to 100 for better precision
                    value={formData.expected_salary}
                    onChange={(e) => {
                      const value = Math.min(20000, Math.max(0, Number(e.target.value))); // Ensure it stays in range
                      handleFormChange({ target: { name: 'expected_salary', value } });
                    }}
                    className="w-full mt-3 range-input"
                  />

                  <div className="flex justify-between text-sm text-gray-500">
                    <span>$0</span>
                    <span className="text-[#244c56]">${formData.expected_salary}</span>
                    <span>$20,000</span>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-lg">Cargo (*)</label>
                  <Select
                    name="jobTitle"
                    options={jobTitles.map((job) => ({ value: job.title, label: job.title }))}
                    value={formData.jobTitle}
                    onChange={handleJobTitleChange}
                    className="basic-single-select mt-3"
                    classNamePrefix="select"
                    placeholder="Selecciona un cargo..."
                    isSearchable
                    filterOption={(candidate, input) =>
                      candidate.label.toLowerCase().includes(input.toLowerCase())
                    }
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-lg">Habilidades (*)</label>
                  <Select
                    isMulti
                    name="skills"
                    options={skills.map((skill) => ({ value: skill.name, label: skill.name }))}
                    value={formData.skills?.length > 0
                      ? formData.skills.map((skill) => ({ value: skill, label: skill }))
                      : []} // Ensure it's always an array
                    onChange={handleSkillsChange}
                    className="basic-single-select mt-3"
                    classNamePrefix="select"
                    placeholder="Selecciona tus skills..."
                    isSearchable
                    filterOption={(candidate, input) =>
                      candidate.label.toLowerCase().includes(input.toLowerCase())
                    }
                  />
                  <p className="text-gray-400 text-sm mt-2">
                    Agregar más habilidades aumenta tu visibilidad en la plataforma.
                  </p>
                </div>
                <div className="mb-4">
                  <label className="block text-lg">Preferencia de Tipo de Trabajo (*)</label>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {[
                      { label: "Tiempo completo", value: "full-time" },
                      { label: "Medio tiempo", value: "part-time" },
                      { label: "Por horas", value: "hourly" },
                      { label: "Por proyecto", value: "project" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => toggleJobType(option.value)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition ${formData.job_type.includes(option.value)
                          ? "bg-[#10282c] text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-lg mb-2">Enlaces (Opcional)</label>

                  {formData.links.map((link, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg shadow-sm border border-gray-300 mt-3 transition-all hover:shadow-md"
                    >
                      {/* Link Icon & Type Input */}
                      <div className="flex items-center gap-2 w-1/3">
                        <span className="text-gray-500 text-xl">
                          {link.link_type.toLowerCase().includes("linkedin") ? "🔗" :
                            link.link_type.toLowerCase().includes("github") ? "🐙" :
                              link.link_type.toLowerCase().includes("portfolio") ? "💼" :
                                "🌐"}
                        </span>
                        <input
                          type="text"
                          placeholder="Ejemplo: LinkedIn, GitHub..."
                          value={link.link_type}
                          onChange={(e) => handleLinkChange(index, "link_type", e.target.value)}
                          className="p-2 w-full bg-white border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* URL Input */}
                      <input
                        type="url"
                        placeholder="https://example.com"
                        value={link.url}
                        onChange={(e) => handleLinkChange(index, "url", e.target.value)}
                        className="p-2 w-2/3 bg-white border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />

                      {/* Delete Button */}
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeLink(index)}
                          className="p-2 text-red-600 bg-red-100 rounded-full hover:bg-red-200 transition"
                        >
                          ✖
                        </button>
                      )}
                    </div>
                  ))}

                  {/* Add Link Button */}
                  <button
                    type="button"
                    onClick={addLink}
                    className="mt-3 flex items-center gap-2 px-4 py-2 buttons-color text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                  >
                    ➕ Agregar otro enlace
                  </button>
                </div>

                <div className="flex flex-col items-center border-2 border-dashed p-10 rounded-lg hover:border-indigo-500">
                  <input
                    type="file"
                    id="resume"
                    name="resume"
                    accept="application/pdf"
                    onChange={handleFormChange}
                    className="hidden"
                  />
                  <p className="text-gray-400 text-sm mt-2">
                    El tamaño máximo es de 10MB
                  </p>
                  <label htmlFor="resume" className="cursor-pointer text-[#244c56]">
                    {formData.resume ? formData.resume.name : 'Haz clic para subir tu currículum (PDF) (*)'}
                  </label>
                  {fileError && <p className="text-red-500 text-sm mt-2">{fileError}</p>}
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-between mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-300 hover:bg-gray-400 px-6 py-2 rounded"
                >
                  Atrás
                </button>
              )}
              {step < steps.length ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="buttons-color px-6 py-2 text-white rounded"
                >
                  Siguiente
                </button>
              ) : (
                <button
                  type="submit"
                  className="buttons-color px-6 py-2 text-white rounded flex items-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar'}
                </button>
              )}
            </div>

            {/* Success/Error Message */}
            {message && (
              <p className={`mt-4 text-lg ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}
          </form>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}

export default function MultiStepForm() {
  return (
    <Suspense fallback={<div className="text-center text-white">Cargando...</div>}>
      <MultiStepFormComponent />
    </Suspense>
  );

}
