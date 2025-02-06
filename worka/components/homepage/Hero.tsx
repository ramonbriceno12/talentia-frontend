import { useState, useEffect } from "react";
import TypingEffect from "./HeroText";

export default function HeroSection() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState("all");
    const [jobs, setJobs] = useState([]);
    const [filteredResults, setFilteredResults] = useState({
        jobs: [],
        talents: [],
        companies: [],
    });


    const closeSidebar = () => {
        setSidebarOpen(false);
        setSearchQuery("");
    };

    return (
        <section className="relative pt-24 w-full min-h-[500px] flex flex-col bg-white text-gray-900">
            {/* Main Content Container */}
            <div className="container mx-auto px-6 flex flex-col items-center text-center relative z-10">
                <div className="max-w-3xl">
                    {/* Fixed Height for Typing Effect */}
                    <div className="h-[300px] py-6 flex items-center justify-center mb-6">
                        <TypingEffect />
                    </div>

                    <p className="mt-12 text-2xl">
                        NUESTRA IA TE CONECTA CON CANDIDATOS DE ALTA CALIDAD, PRE-EVALUADOS Y LISTOS PARA UNIRSE A TU EQUIPO EN TIEMPO RÉCORD✨
                    </p>
                </div>
            </div>
            <br />
            {/* Promotional Banner – Full Page Width */}
            <div className="w-full">
                <div className="bg-[#244c56] text-white text-center py-3 px-4">
                    <p className="text-2xl">
                        ¡Oferta Especial! <br/> Nuestro plan Premium está en promoción: <br />
                        <span className="line-through">$100.00</span> $50.00 para Talentos <br />
                        <span className="line-through">$200.00</span> $70.00 para Empresas
                    </p>
                </div>
            </div>

            {/* Overlay (if applicable) */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={closeSidebar}
                ></div>
            )}
        </section>


    );
}
