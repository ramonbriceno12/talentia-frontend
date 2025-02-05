'use client'
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react'; // Success icon
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';


function SuccessPageComponent() {
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams); // Convert to URLSearchParams object
    const name = params.get('name') || 'Usuario'; // Default to 'Usuario' if no name is found

    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center bg-forms text-white">
            {/* Logo */}
            <img src="/img/LOGO-01.png" alt="Talentia Logo" className="mb-6 w-64 h-auto" />

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
                    ¡Formulario enviado con éxito, {name}!
                </h2>
                <p className="text-lg text-center text-gray-600 mt-2">
                    Hemos recibido tu información con éxito! En breve, recibirás un correo electrónico con las instrucciones para continuar con el proceso.
                </p>

                {/* Button to go back to the homepage */}
                <a href="/" className="mt-6 buttons-color text-white px-6 py-2 rounded text-lg">
                    Volver al inicio
                </a>
            </motion.div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div className="text-center text-white">Cargando...</div>}>
            <SuccessPageComponent />
        </Suspense>
    );

}
