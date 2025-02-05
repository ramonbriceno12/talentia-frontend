'use client'
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Select from 'react-select';

const steps = [
    { id: 1, label: 'Job Details' },
    { id: 2, label: 'Location & Salary' },
    { id: 3, label: 'Company Info' },
];

const venezuelanStates = [
    { value: 'AMAZONAS', label: 'AMAZONAS' },
    { value: 'ANZOÁTEGUI', label: 'ANZOÁTEGUI' },
    { value: 'APURE', label: 'APURE' },
    { value: 'ARAGUA', label: 'ARAGUA' },
    { value: 'BARINAS', label: 'BARINAS' },
    { value: 'BOLÍVAR', label: 'BOLÍVAR' },
    { value: 'CARABOBO', label: 'CARABOBO' },
    { value: 'COJEDES', label: 'COJEDES' },
    { value: 'DELTA AMACURO', label: 'DELTA AMACURO' },
    { value: 'DISTRITO CAPITAL', label: 'DISTRITO CAPITAL' },
    { value: 'FALCÓN', label: 'FALCÓN' },
    { value: 'GUÁRICO', label: 'GUÁRICO' },
    { value: 'LARA', label: 'LARA' },
    { value: 'MÉRIDA', label: 'MÉRIDA' },
    { value: 'MIRANDA', label: 'MIRANDA' },
    { value: 'MONAGAS', label: 'MONAGAS' },
    { value: 'NUEVA ESPARTA', label: 'NUEVA ESPARTA' },
    { value: 'PORTUGUESA', label: 'PORTUGUESA' },
    { value: 'SUCRE', label: 'SUCRE' },
    { value: 'TÁCHIRA', label: 'TÁCHIRA' },
    { value: 'TRUJILLO', label: 'TRUJILLO' },
    { value: 'LA GUAIRA', label: 'LA GUAIRA' },
    { value: 'YARACUY', label: 'YARACUY' },
    { value: 'ZULIA', label: 'ZULIA' },
];


export default function MultiStepJobForm() {
    const [step, setStep] = useState(1);
    const [isClient, setIsClient] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        skills: [],
        location: '',
        salary: 0,
        isRemote: false,
        companyName: '',
        email: '',
        logo: null,
        roleType: '',
        startDate: '',
        experienceLevel: '',
        remotePolicy: ''
    });

    const [skillsOptions, setSkillsOptions] = useState([]);
    const [categoriesOptions, setCategoriesOptions] = useState([]);

    // Fetch skills
    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await fetch('https://talentiave.com/api/api/skills');
                const data = await response.json();
                const formattedSkills = data.map(skill => ({
                    value: skill.id,
                    label: skill.name,
                    category: skill.category
                }));
                setSkillsOptions(formattedSkills);
            } catch (error) {
                console.error('Error fetching skills:', error);
            }
        };

        // Fetch job categories
        const fetchCategories = async () => {
            try {
                const response = await fetch('https://talentiave.com/api/api/job-categories');
                const data = await response.json();
                const formattedCategories = data.map(category => ({
                    value: category.id,
                    label: category.name
                }));
                setCategoriesOptions(formattedCategories);
            } catch (error) {
                console.error('Error fetching job categories:', error);
            }
        };

        fetchSkills();
        fetchCategories();
        setIsClient(true);
    }, []);

    const nextStep = () => setStep((prev) => Math.min(prev + 1, steps.length));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

    const handleFormChange = (e: any) => {
        const { name, value, files, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : files ? files[0] : value;

        setFormData((prev) => ({
            ...prev,
            [name]: val,
        }));
    };

    const handleSkillsChange = (selectedSkills) => {
        setFormData((prev) => ({
            ...prev,
            skills: selectedSkills,
        }));
    };

    const handleCategoryChange = (selectedCategory) => {
        setFormData((prev) => ({
            ...prev,
            category: selectedCategory
        }));
    };

    const handleLocationChange = (selectedLocation) => {
        setFormData((prev) => ({
            ...prev,
            location: selectedLocation
        }));
    };

    const handleSliderChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            salary: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Data Submitted: ", formData);
        // Here you can send the data to your backend API
        // Example:
        // fetch('/api/submit-job', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(formData),
        // })
        // .then(response => response.json())
        // .then(data => {
        //     console.log('Success:', data);
        // })
        // .catch((error) => {
        //     console.error('Error:', error);
        // });
    };

    return (
        <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-green-500 to-blue-600 text-white">
            <motion.div
                key={step}
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-3xl bg-white p-10 rounded-lg shadow-lg text-gray-900"
            >
                <form onSubmit={handleSubmit}>
                    {step === 1 && (
                        <div>
                            <h2 className="text-3xl font-semibold mb-6">Detalles de la Oferta</h2>
                            <div className="mb-4">
                                <label htmlFor="title" className="block text-lg">Posición</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleFormChange}
                                    className="w-full p-3 rounded border focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="description" className="block text-lg">Descripción</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={4}
                                    value={formData.description}
                                    onChange={handleFormChange}
                                    className="w-full p-3 rounded border focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="category" className="block text-lg">Categoría</label>
                                {isClient && (
                                    <Select
                                        isMulti
                                        name="category"
                                        options={categoriesOptions}
                                        value={formData.category}
                                        onChange={handleCategoryChange}
                                        classNamePrefix="select"
                                        placeholder="Selecciona una categoría..."
                                        isSearchable
                                    />
                                )}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="skills" className="block text-lg">Skills</label>
                                {isClient && (
                                    <Select
                                        isMulti
                                        name="skills"
                                        options={skillsOptions}
                                        value={formData.skills}
                                        onChange={handleSkillsChange}
                                        classNamePrefix="select"
                                        placeholder="Selecciona los skills..."
                                        isSearchable
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <h2 className="text-3xl font-semibold mb-6">Locación & Salary</h2>
                            <div className="mb-4">
                                <label htmlFor="location" className="block text-lg">Locación</label>
                                <Select
                                    options={venezuelanStates}
                                    value={formData.location}
                                    onChange={handleLocationChange}
                                    placeholder="Selecciona la ciudad..."
                                />
                            </div>
                            <div className="mb-10">
                                <label htmlFor="salary" className="block text-lg mb-3">Salario</label>
                                <div className="relative flex items-center">
                                    <input
                                        type="range"
                                        id="salary"
                                        name="salary"
                                        min="0"
                                        max="20000"
                                        step="100"

                                        value={formData.salary}
                                        onChange={handleSliderChange}
                                        className="w-full h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg appearance-none focus:outline-none"
                                        style={{
                                            WebkitAppearance: 'none',
                                        }}
                                    />
                                    {/* Salary Bubble */}
                                    <div
                                        className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-sm font-semibold px-4 py-1 rounded-lg shadow"
                                        style={{
                                            left: `calc(${(formData.salary / 20000) * 100}%)`
                                        }}
                                    >
                                        ${formData.salary.toLocaleString()}
                                    </div>
                                </div>

                                {/* Custom Thumb (For WebKit Browsers) */}
                                <style jsx>{`
                                input[type="range"]::-webkit-slider-thumb {
                                    -webkit-appearance: none;
                                    appearance: none;
                                    width: 20px;
                                    height: 20px;
                                    background: #4CAF50;
                                    border-radius: 50%;
                                    cursor: pointer;
                                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
                                }
                                input[type="range"]::-moz-range-thumb {
                                    width: 20px;
                                    height: 20px;
                                    background: #4CAF50;
                                    border-radius: 50%;
                                    cursor: pointer;
                                }
                                input[type="range"]:hover::-webkit-slider-thumb {
                                    background: #45a049;
                                    transform: scale(1.1);
                                }
                            `}</style>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <h2 className="text-3xl font-semibold mb-6">Job Type</h2>

                            {/* Role Type */}
                            <div className="mb-4">
                                <label htmlFor="roleType" className="block text-lg">Rol</label>
                                <Select
                                    options={[
                                        { value: 'full-time', label: 'Full-time' },
                                        { value: 'part-time', label: 'Part-time' },
                                        { value: 'contract', label: 'Contract' },
                                        { value: 'internship', label: 'Internship' },
                                        { value: 'freelance', label: 'Freelance' }
                                    ]}
                                    value={formData.roleType}
                                    onChange={(selectedOption) =>
                                        setFormData((prev) => ({ ...prev, roleType: selectedOption }))
                                    }
                                    placeholder="Selecciona el tipo de rol..."
                                />
                            </div>

                            {/* Starting Date */}
                            <div className="mb-4">
                                <label htmlFor="startDate" className="block text-lg">Fecha de inicio</label>
                                <input
                                    type="date"
                                    id="startDate"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleFormChange}
                                    className="w-full p-3 rounded border focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            {/* Experience Level */}
                            <div className="mb-4">
                                <label htmlFor="experienceLevel" className="block text-lg">Nivel de Experiencia</label>
                                <Select
                                    options={[
                                        { value: 'entry', label: 'Entry-level' },
                                        { value: 'junior', label: 'Junior' },
                                        { value: 'mid', label: 'Mid-level' },
                                        { value: 'senior', label: 'Senior' },
                                        { value: 'lead', label: 'Lead' }
                                    ]}
                                    value={formData.experienceLevel}
                                    onChange={(selectedOption) =>
                                        setFormData((prev) => ({ ...prev, experienceLevel: selectedOption }))
                                    }
                                    placeholder="Select experience level..."
                                />
                            </div>

                            {/* Remote Policy */}
                            <div className="mb-4">
                                <label htmlFor="remotePolicy" className="block text-lg">Tipo de Trabajo</label>
                                <Select
                                    options={[
                                        { value: 'remote', label: 'Fully Remote' },
                                        { value: 'hybrid', label: 'Hybrid' },
                                        { value: 'onsite', label: 'On-site' }
                                    ]}
                                    value={formData.remotePolicy}
                                    onChange={(selectedOption) =>
                                        setFormData((prev) => ({ ...prev, remotePolicy: selectedOption }))
                                    }
                                    placeholder="Selecciona el tipo de trabajo..."
                                />
                            </div>
                        </div>
                    )}


                    <div className="flex justify-between mt-8">
                        {step > 1 && (
                            <button onClick={prevStep} className="bg-gray-300 px-6 py-2 rounded">
                                Atras
                            </button>
                        )}
                        {step < steps.length ? (
                            <button onClick={nextStep} className="bg-green-600 px-6 py-2 text-white rounded">
                                Siguiente
                            </button>
                        ) : (
                            <button type="submit" className="bg-blue-500 px-6 py-2 text-white rounded">
                                Enviar
                            </button>
                        )}
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
