"use client";

import { FaCheckCircle } from "react-icons/fa";

export default function ProfileCompletion({ completionPercentage }: { completionPercentage: number }) {
    return (
        <div className="bg-white shadow-md p-6 rounded">
            <div className="flex items-center gap-3">
                <FaCheckCircle className={`text-3xl ${completionPercentage >= 80 ? "text-green-500" : "text-yellow-500"}`} />
                <div>
                    <h2 className="text-lg font-semibold">Perfil Completo</h2>
                    <p className="text-gray-600">Tu perfil está completo en un <strong>{completionPercentage}%</strong></p>
                    <div className="w-full bg-gray-200 h-2 rounded mt-2">
                        <div 
                            className={`h-2 rounded ${completionPercentage >= 80 ? "bg-green-500" : "bg-yellow-500"}`} 
                            style={{ width: `${completionPercentage}%` }} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
