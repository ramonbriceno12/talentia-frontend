"use client";

import { useEffect, useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { useAuth } from "../../utils/authContext";

interface Proposal {
  id: number;
  description: string;
  sent_by: {
    id: number | null;
    name: string;
    email: string;
  };
  created_at: string;
}

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const { user } = useAuth();

  useEffect(() => {
    if (!token) return;

    const fetchProposals = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/proposals/talent/${user?.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch proposals");

        const data = await response.json();
        setProposals(data.proposals || []);
      } catch (error) {
        console.error("Error fetching proposals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [token]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#244c56] flex items-center gap-2">
        <FaEnvelope className="text-green-500 text-3xl" /> Propuestas Recibidas
      </h1>
      <p className="text-gray-600 mt-2">Aquí puedes ver todas las propuestas que has recibido.</p>

      {loading ? (
        <p className="text-gray-500 mt-4">Cargando propuestas...</p>
      ) : proposals.length === 0 ? (
        <p className="text-gray-500 mt-4">No has recibido propuestas aún.</p>
      ) : (
        <div className="mt-6 bg-white shadow-md p-4 rounded-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left text-[#244c56]">
                <th className="p-3">Descripción</th>
                <th className="p-3">Enviado por</th>
                <th className="p-3">Correo Electrónico</th>
                <th className="p-3">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {proposals.map((proposal) => (
                <tr key={proposal.id} className="border-b hover:bg-gray-100 transition text-gray-600">
                  <td className="p-3">{proposal.description}</td>
                  <td className="p-3">{proposal.sent_by.name}</td>
                  <td className="p-3">{proposal.sent_by.email}</td>
                  <td className="p-3 text-gray-600">{new Date(proposal.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
