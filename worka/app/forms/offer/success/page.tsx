'use client'
import Footer from '@/components/homepage/Footer';
import Navbar from '@/components/homepage/Navbar';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react'; // Success icon
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function CompanySuccessPageComponent() {
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams); // Convert to URLSearchParams object
    const companyName = params.get('name') || 'Empresa'; // Default to 'Empresa' if no name is found

    return (
        <div className='bg-gray-200'>
            <div className="mt-10">
                <Navbar />
            </div>
            <div className="min-h-screen flex flex-col items-center justify-center text-white px-4 sm:px-6 lg:px-8 pb-8">

                {/* Success Message Container */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg text-gray-900 flex flex-col items-center"
                >
                    {/* Success Icon */}
                    <CheckCircle className="text-green-500 w-16 h-16 mb-4" />

                    {/* Success Message */}
                    <h2 className="text-2xl font-semibold text-center text-gray-800">
                        ¡Vacante publicada con éxito, {companyName}!
                    </h2>
                    <p className="text-lg text-center text-gray-600 mt-2">
                        Hemos recibido tu oferta de trabajo correctamente. Nuestro equipo la revisará y pronto recibirás candidatos interesados en la vacante.
                        ¡Gracias por confiar en Talentia para encontrar talento!
                    </p>

                    {/* Button to go back to the homepage */}
                    <a href="/" className="mt-6 buttons-color text-white px-6 py-2 rounded text-lg">
                        Volver al inicio
                    </a>
                </motion.div>
            </div>
            <Footer />
        </div>
    );
}

export default function CompanySuccessPage() {
    return (
        <Suspense fallback={<div className="text-center text-white">Cargando...</div>}>
            <CompanySuccessPageComponent />
        </Suspense>
    )
}
