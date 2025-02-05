'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
export const dynamic = 'force-dynamic';

export default function CalendlyRedirectPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email'); // Capture email from URL
    const name = searchParams.get('name'); // Capture name from URL

    console.log(email)

    useEffect(() => {
        const trackUserClick = async () => {
            if (!email) return;

            try {
                await fetch(`https://talentiave.com/api/api/actions/calendly/${encodeURIComponent(email)}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' }
                });

                console.log("User click tracked successfully");

                // After tracking, redirect to Calendly after 3 seconds
                setTimeout(() => {
                    router.push(`https://calendly.com/contacto-talentiave/30min?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`);
                }, 3000);
            } catch (error) {
                console.error("Error tracking user click:", error);
            }
        };

        trackUserClick();
    }, [email, name, router]);

    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center bg-forms text-white">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg text-gray-900 flex flex-col items-center">
                <h2 className="text-2xl font-semibold text-center text-gray-800">
                    Redirigiéndote a Calendly...
                </h2>
                <p className="text-lg text-center text-gray-600 mt-2">
                    Estamos verificando tu acceso y te enviaremos a la página de agendamiento en unos segundos.
                </p>

                {/* Loading Spinner (Optional) */}
                <div className="mt-4 animate-spin rounded-full h-10 w-10 border-b-2 border-gray-600"></div>
            </div>
        </div>
    );
}
