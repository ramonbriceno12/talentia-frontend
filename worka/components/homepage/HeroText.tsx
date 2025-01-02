import { useState, useEffect } from "react";

const phrases = [
    "Impulsa Tu Carrera en Venezuela",
    "Conecta con Talento Venezolano",
    "Haz Realidad Tu Trabajo Ideal en Venezuela",
    "Descubre Empleos Remotos para Venezolanos",
    "Encuentra Oportunidades en el Mercado Local",
    "Crece Profesionalmente desde Venezuela",
];

export default function TypingEffect() {
    const [text, setText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [loop, setLoop] = useState(0);
    const typingSpeed = 150;
    const deletingSpeed = 75;

    useEffect(() => {
        const handleTyping = () => {
            const currentPhrase = phrases[loop % phrases.length];
            const updatedText = isDeleting
                ? currentPhrase.substring(0, text.length - 1)
                : currentPhrase.substring(0, text.length + 1);

            setText(updatedText);

            if (!isDeleting && updatedText === currentPhrase) {
                setTimeout(() => setIsDeleting(true), 1500); // Pause before deleting
            }

            if (isDeleting && updatedText === "") {
                setIsDeleting(false);
                setLoop(loop + 1);
            }
        };

        const timeout = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed);

        return () => clearTimeout(timeout);
    }, [text, isDeleting, loop]);

    return (
        <h1 className="text-6xl font-extrabold leading-tight tracking-wide drop-shadow-lg">
            {text}
            <span className="text-pink-400 animate-blink">|</span>
        </h1>
    );
}
