import { FaLinkedin, FaTwitter, FaFacebook } from "react-icons/fa";

export default function CallToAction() {
    return (
        <section className="py-16 text-center">
            <h2 className="text-4xl font-semibold text-gray-800 dark:text-white">
                Ready to Start?
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Sign up today and discover new job opportunities.
            </p>
            <a
                href="/auth"
                className="mt-8 inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
                Join Now
            </a>

            {/* Social Icons */}
            <div className="mt-12 flex justify-center space-x-6">
                <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:text-blue-800 transition"
                >
                    <FaLinkedin size={32} />
                </a>
                <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-500 transition"
                >
                    <FaTwitter size={32} />
                </a>
                <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 transition"
                >
                    <FaFacebook size={32} />
                </a>
            </div>
        </section>
    )
}
