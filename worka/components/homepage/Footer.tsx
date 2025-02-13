import { FaLinkedin, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="text-white py-4" style={{
        background: "linear-gradient(90deg, #244c56 50%, #349390 100%)",
    }}>
      <div className="container mx-auto px-6 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
        {/* Copyright */}
        <p className="text-sm">&copy; {new Date().getFullYear()} Talentia. Todos los derechos reservados.</p>

        {/* Social Media Icons */}
        <div className="flex space-x-4 mt-2 sm:mt-0">
          <a
            href="https://www.instagram.com/talentiave"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#349390] transition"
          >
            <FaInstagram size={20} />
          </a>
          <a
            href="https://www.linkedin.com/company/talentiave/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#349390] transition"
          >
            <FaLinkedin size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
