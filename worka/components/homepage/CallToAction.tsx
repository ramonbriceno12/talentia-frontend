import { FaLinkedin, FaTwitter, FaFacebook, FaInstagram } from "react-icons/fa";

export default function CallToAction() {
    return (
        <section className="py-16 text-center">
            <h2 className="text-4xl font-semibold text-white">
                🚀 Ready to Start?
            </h2>
            <p className="mt-4 text-lg text-white">
                Sign up today and discover new job opportunities or connect with top talent.
            </p>

            {/* Option Buttons */}
            <div className="mt-8 flex justify-center space-x-6">
                <a
                    href="/forms/talent"
                    className="inline-block talentia-button text-white bg-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                    I’m a Talent
                </a>
                <a
                    href="/forms/offer"
                    className="inline-block talentia-button text-white bg-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                    I’m a Company
                </a>
            </div>

            {/* Social Icons */}
            <div className="mt-12 flex justify-center space-x-6">
            <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="talentia-text hover:text-blue-800 transition"
                >
                    <FaInstagram size={32} />
                </a>
                <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="talentia-text hover:text-blue-800 transition"
                >
                    <FaLinkedin size={32} />
                </a>
                <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="talentia-text hover:text-blue-500 transition"
                >
                    <FaTwitter size={32} />
                </a>
                <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="talentia-text hover:text-blue-700 transition"
                >
                    <FaFacebook size={32} />
                </a>
            </div>
        </section>
    );
}
