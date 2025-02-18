'use client'
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Footer from '@/components/homepage/Footer';
import Navbar from '@/components/homepage/Navbar';
import Select from 'react-select';

const steps = [
    { id: 1, label: 'Company Info' },
    { id: 2, label: 'Upload Job Requirements' },
];

export default function CompanyForm() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        companyName: '',
        email: '',
        address: '',
        jobRequirements: null,
        jobRequirementsLink: '',
        uploadOption: 'file',
        country: '',
    });

    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [fileError, setFileError] = useState('');
    const [countries, setCountries] = useState([]);

    useEffect(() => {
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

        fetchCountries();

    }, []);

    const handleCountryChange = (selectedOption) => {
        setFormData((prev) => ({ ...prev, country: selectedOption?.value || "" }));
    };

    const nextStep = () => setStep((prev) => Math.min(prev + 1, steps.length));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

    const handleFormChange = (e: any) => {
        const { name, value, files } = e.target;

        if (files) {
            const file = files[0];
            const allowedTypes = [
                "application/pdf",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
                "application/vnd.ms-excel", // .xls
                "application/msword", // .doc
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document" // .docx
            ];

            if (file && !allowedTypes.includes(file.type)) {
                setFileError("❌ Solo se permiten archivos en formato PDF, Excel o Word.");
                return;
            }
            setFileError('');
        }

        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const missingFields = [];
        if (!formData.companyName) missingFields.push("Nombre de la Empresa");
        if (!formData.email) missingFields.push("Correo Electrónico");
        if (!formData.address) missingFields.push("Ubicación");
        if (!formData.country) missingFields.push("Pais");

        if (formData.uploadOption === 'file' && !formData.jobRequirements) {
            missingFields.push("Archivo de Requerimientos");
        }

        if (formData.uploadOption === 'link' && !formData.jobRequirementsLink) {
            missingFields.push("Enlace de Requerimientos");
        }

        if (missingFields.length > 0) {
            setMessage(`⚠️ Los siguientes campos son obligatorios: ${missingFields.join(", ")}`);
            return;
        }

        setIsSubmitting(true);
        setMessage('');

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.companyName);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('address', formData.address);
            formDataToSend.append('country', formData.country);

            if (formData.uploadOption === 'file') {
                formDataToSend.append('jobRequirements', formData.jobRequirements);
            } else {
                formDataToSend.append('jobRequirementsLink', formData.jobRequirementsLink);
            }

            const response = await fetch('https://talentiave.com/api/api/upload/company', {
                method: 'POST',
                body: formDataToSend,
            });

            if (!response.ok) {
                throw new Error('Error al enviar el formulario');
            }

            setMessage('✅ ¡Formulario enviado con éxito!');
            setTimeout(() => {
                setMessage('');
                router.push(`/forms/offer/success?name=${formData.companyName}`);
            }, 3000);

        } catch (error) {
            setMessage('❌ Error al enviar el formulario. Inténtalo de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setFormData((prev) => ({ ...prev, jobRequirements: file }));
    };


    return (
        <div className='bg-gray-100'>
            <div className='mt-10'>
                <Navbar />
            </div>
            <div className="min-h-screen flex flex-col items-center bg-gray-100 justify-center text-white px-4 sm:px-6 lg:px-8 mb-8">
                <Link href="/">
                    <img
                        src="/img/LOGO-04.png"
                        alt="Talentia Logo"
                        className="mb-6 w-64 h-auto cursor-pointer"
                    />
                </Link>
                <motion.div
                    key={step}
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg text-gray-900"
                >
                    <form onSubmit={handleSubmit}>
                        {step === 1 && (
                            <div>
                                <h2 className="text-3xl font-semibold mb-6">Información de la Empresa</h2>
                                <div className="mb-4">
                                    <label htmlFor="companyName" className="block text-lg">Nombre de la Empresa</label>
                                    <input
                                        type="text"
                                        id="companyName"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleFormChange}
                                        className="w-full p-3 rounded border focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="email" className="block text-lg">Correo Electrónico</label>
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
                                    <label htmlFor="country" className="block text-lg">País</label>
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
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="address" className="block text-lg">Ubicación</label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleFormChange}
                                        className="w-full p-3 rounded border focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div>
                                <h2 className="text-3xl font-semibold mb-6">Sube los Requerimientos</h2>
                                <div className="flex gap-4">
                                    <button type="button" onClick={() => setFormData(prev => ({ ...prev, uploadOption: 'file' }))} className={`px-4 py-2 rounded ${formData.uploadOption === 'file' ? 'buttons-color text-white' : 'bg-gray-200'}`}>
                                        📂 Subir Archivo
                                    </button>
                                    <button type="button" onClick={() => setFormData(prev => ({ ...prev, uploadOption: 'link' }))} className={`px-4 py-2 rounded ${formData.uploadOption === 'link' ? 'buttons-color text-white' : 'bg-gray-200'}`}>
                                        🔗 Usar Enlace
                                    </button>
                                </div>
                                {formData.uploadOption === 'file' ? (
                                    <div className="mt-4 flex flex-col items-center border-2 border-dashed p-10 rounded-lg hover:border-indigo-500">
                                        <input
                                            type="file"
                                            id="jobRequirements"
                                            name="jobRequirements"
                                            accept=".pdf,.doc,.docx,.xls,.xlsx"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        <p className="text-gray-400 text-sm mt-2">
                                            El tamaño máximo es de 20MB
                                        </p>
                                        <label htmlFor="jobRequirements" className="cursor-pointer text-indigo-600">
                                            {formData.jobRequirements ? formData.jobRequirements.name : '📂 Haz clic para subir el archivo (PDF, Word, Excel)'}
                                        </label>
                                        {fileError && <p className="text-red-500 text-sm mt-2">{fileError}</p>}
                                    </div>
                                ) : (
                                    <input
                                        type="text"
                                        name="jobRequirementsLink"
                                        value={formData.jobRequirementsLink}
                                        onChange={handleFormChange}
                                        className="mt-4 w-full p-3 rounded border focus:ring-2 focus:ring-indigo-500"
                                        placeholder="🔗 Pega el enlace aquí"
                                        required
                                    />
                                )}


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
