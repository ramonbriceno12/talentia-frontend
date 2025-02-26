'use client';

import { useEffect, useState } from "react";
import { useAuth } from "../../utils/authContext";

export default function BillingPage() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Número de elementos por página

    const { user } = useAuth();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) return;

        const fetchPayments = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/billing/talents/${user?.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) throw new Error("Failed to fetch payments");

                const data = await response.json();
                setPayments(data || []);
            } catch (error) {
                console.error("Error fetching payments:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, [token, user?.id]);

    // Calcular los pagos para la página actual
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPayments = payments.slice(indexOfFirstItem, indexOfLastItem);

    // Cambiar de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return <div>Cargando historial de pagos...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg mb-6">
            <h2 className="text-2xl font-bold mb-6 text-[#244c56]">Historial de Pagos</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg overflow-hidden">
                    <thead className="bg-[#244c56]">
                        <tr>
                            <th className="py-4 px-6 text-left text-white font-semibold">ID de Transacción</th>
                            <th className="py-4 px-6 text-left text-white font-semibold">Monto</th>
                            <th className="py-4 px-6 text-left text-white font-semibold">Moneda</th>
                            <th className="py-4 px-6 text-left text-white font-semibold">Método de Pago</th>
                            <th className="py-4 px-6 text-left text-white font-semibold">Estado</th>
                            <th className="py-4 px-6 text-left text-white font-semibold">Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPayments.map((payment) => (
                            <tr
                                key={payment.id}
                                className="border-b border-gray-200 hover:bg-blue-50 transition-all duration-200"
                            >
                                <td className="py-4 px-6 text-gray-700 underline"><a href={`/admin/talents/billing/${encodeURIComponent(payment.transaction_id)}`}>{payment.transaction_id}</a></td>
                                <td className="py-4 px-6 text-gray-700 font-medium">${payment.amount}</td>
                                <td className="py-4 px-6 text-gray-700">{payment.currency}</td>
                                <td className="py-4 px-6 text-gray-700">{payment.payment_method.name}</td>
                                <td className="py-4 px-6">
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
                                </td>
                                <td className="py-4 px-6 text-gray-700">
                                    {new Date(payment.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            <div className="flex justify-center mt-6">
                {Array.from({ length: Math.ceil(payments.length / itemsPerPage) }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => paginate(index + 1)}
                        className={`mx-1 px-4 py-2 rounded-full ${
                            currentPage === index + 1
                                ? "bg-[#244c56] text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}