"use client";

import { FaEnvelope } from "react-icons/fa";

interface ProposalsReceivedProps {
    totalProposals: number;
}

export default function ProposalsReceived({ totalProposals }: ProposalsReceivedProps) {
    return (
        <div className="bg-white shadow-md p-6 rounded">
            <div className="flex items-center gap-3">
                <FaEnvelope className="text-green-500 text-3xl" />
                <div>
                    <h2 className="text-lg font-semibold text-[#244c56] flex items-center gap-2">
                        Propuestas Recibidas
                    </h2>
                    <p className="text-gray-600">{totalProposals} Propuestas Recibidas</p>
                </div>
            </div>
        </div>
    );
}
