'use client';

import { useEffect, useState } from "react";
import { useAuth } from "../../../utils/authContext";
import { useParams } from "next/navigation";

export default function InvoicePage() {
    const [payment, setPayment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { user } = useAuth();
    const { id: transaction_id } = useParams(); // Obtener el ID del pago desde la URL
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) return;

        const fetchPayment = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/billing/talents/${user?.id}/payments/${decodeURIComponent(transaction_id)}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) throw new Error("Failed to fetch payment");

                const data = await response.json();
                setPayment(data);
            } catch (error) {
                console.error("Error fetching payment:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPayment();
    }, [token, user?.id, transaction_id]);

    if (loading) {
        return <div>Cargando factura...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!payment) {
        return <div>No se encontró la factura.</div>;
    }

    return (
        <div className="p-8 bg-white rounded-xl shadow-lg max-w-4xl mx-auto">
            {/* Encabezado */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#244c56]">Factura</h1>
                    <p className="text-gray-600">Número de factura: {payment.transaction_id}</p>
                </div>
                <div className="text-right">
                    <p className="text-gray-600">Fecha de emisión:</p>
                    <p className="font-semibold">{new Date(payment.createdAt).toLocaleDateString()}</p>
                </div>
            </div>

            {/* Información del Cliente */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-[#244c56] mb-4">Información del Cliente</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-gray-600">Nombre:</p>
                        <p className="font-semibold">{user?.full_name}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Correo electrónico:</p>
                        <p className="font-semibold">{user?.email}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Rol:</p>
                        <p className="font-semibold">{user?.role}</p>
                    </div>
                </div>
            </div>

            {/* Detalles del Pago */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-[#244c56] mb-4">Detalles del Pago</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-gray-600">Método de Pago:</p>
                        <p className="font-semibold">{payment.payment_method.name}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Monto:</p>
                        <p className="font-semibold">${payment.amount}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Moneda:</p>
                        <p className="font-semibold">{payment.currency}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Estado:</p>
                        <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                payment.status === "completed"
                                    ? "bg-green-100 text-green-700"
                                    : payment.status === "pending"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                        >
                            {payment.status === "completed"
                                ? "Completado"
                                : payment.status === "pending"
                                ? "Pendiente"
                                : "Fallido"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Resumen */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-[#244c56] mb-4">Resumen</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-gray-600">Fecha de Creación:</p>
                        <p className="font-semibold">{new Date(payment.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Última Actualización:</p>
                        <p className="font-semibold">{new Date(payment.updatedAt).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            {/* Botón de Descarga (Simulado) */}
            <div className="flex justify-end">
                <button
                    className="bg-[#244c56] text-white px-6 py-2 rounded-lg hover:bg-[#1a3640] transition-all duration-200"
                    onClick={() => alert("Descargar factura")}
                >
                    Descargar Factura
                </button>
            </div>
        </div>
    );
}