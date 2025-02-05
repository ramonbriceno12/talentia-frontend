'use client'
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

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
    });

    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [fileError, setFileError] = useState('');

    const nextStep = () => setStep((prev) => Math.min(prev + 1, steps.length));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

    const handleFormChange = (e: any) => {
        const { name, value, files } = e.target;

        if (files) {
            const file = files[0];
            if (file && file.type !== "application/pdf") {
                setFileError("❌ Solo se permiten archivos en formato PDF.");
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
        if (!formData.jobRequirements) missingFields.push("Archivo de Requerimientos");

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
            formDataToSend.append('jobRequirements', formData.jobRequirements);

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
                router.push(`offer/success?name=${formData.companyName}`);
            }, 3000);

            setFormData({ companyName: '', email: '', address: '', jobRequirements: null });
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
        <div className="min-h-screen flex flex-col items-center justify-center bg-forms text-white px-4 sm:px-6 lg:px-8">
            <img
                src="/img/LOGO-01.png"
                alt="Talentia Logo"
                className="mb-6 w-64 h-auto"
            />
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
                            <div className="flex flex-col items-center border-2 border-dashed p-10 rounded-lg hover:border-indigo-500">
                                <input
                                    type="file"
                                    id="jobRequirements"
                                    name="jobRequirements"
                                    accept="application/pdf"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <label htmlFor="jobRequirements" className="cursor-pointer text-indigo-600">
                                    {formData.jobRequirements ? formData.jobRequirements.name : 'Haz clic para subir el archivo (PDF)'}
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
    );
}
