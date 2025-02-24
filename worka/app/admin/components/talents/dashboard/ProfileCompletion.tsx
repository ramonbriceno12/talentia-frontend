"use client";

import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

export default function ProfileCompletion({ completionPercentage, missingFields }: { 
    completionPercentage: number; 
    missingFields: string[];
}) {
    return (
        <div className="bg-white shadow-md p-6 rounded">
            <div className="flex items-center gap-3">
                <FaCheckCircle className={`text-3xl ${completionPercentage >= 80 ? "text-green-500" : "text-yellow-500"}`} />
                <div>
                    <h2 className="text-lg font-semibold">Perfil Completo</h2>
                    <p className="text-gray-600">
                        Tu perfil está completo en un <strong>{completionPercentage}%</strong>
                    </p>
                    <div className="w-full bg-gray-200 h-2 rounded mt-2">
                        <div 
                            className={`h-2 rounded ${completionPercentage >= 80 ? "bg-green-500" : "bg-yellow-500"}`} 
                            style={{ width: `${completionPercentage}%` }} 
                        />
                    </div>
                </div>
            </div>

            {/* Show missing fields if profile is incomplete */}
            {completionPercentage < 100 && (
                <div className="mt-4">
                    <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <FaExclamationTriangle className="text-yellow-500" />
                        Completa estos campos para mejorar tu perfil:
                    </h3>
                    <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                        {missingFields.map((field, index) => (
                            <li key={index}>{field}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
