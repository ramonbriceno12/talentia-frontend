'use client'
import { useState, useEffect } from "react";
import { useParams, useRouter } from 'next/navigation';
import Navbar from "@/components/homepage/Navbar";
import Footer from "@/components/homepage/Footer";

export default function JobDetailView() {
    const params = useParams();
    const [id, setId] = useState(null);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        coverLetter: "",
        pdf: null,
    });

    useEffect(() => {
        async function unwrapParams() {
            const resolvedParams = await params;
            setId(resolvedParams.id);
        }
        unwrapParams();
    }, [params]);

    useEffect(() => {
        const fetchJob = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const response = await fetch(`http://talentiave.com:5000/api/jobs/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setJob(data);
                } else {
                    setJob(null);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching job:", error);
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    const handleFormChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,  // Store the file in formData
        }));
    };


    const handleFormSubmit = async (e) => {
        e.preventDefault();

        console.log(id);
        console.log(formData);

        if (formData.pdf) {
            const submissionData = new FormData();
            submissionData.append('resume', formData.pdf);  // File
            submissionData.append('job_id', id);  // Job ID
            submissionData.append('name', formData.name);  // User Name
            submissionData.append('email', formData.email);  // User Email
            submissionData.append('coverLetter', formData.coverLetter);  // Cover Letter Text

            try {
                setUploading(true);  // Start loading state
                const response = await fetch('http://talentiave.com:5000/api/upload/application', {
                    method: 'POST',
                    body: submissionData,
                });

                const data = await response.json();
                console.log(data);

                if (response.ok) {
                    alert("Application submitted successfully!");
                }
            } catch (error) {
                console.error('Error uploading application:', error);
            } finally {
                setUploading(false);  // End loading state
            }
        } else {
            alert("Please upload a resume.");
        }
    };




    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-lg text-gray-700">Loading job details...</p>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-lg text-gray-700">Job not found.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen mt-24">
            <Navbar />
            <section className="flex-grow bg-talentia text-gray-900 min-h-screen flex p-6 items-stretch">
                <div className="max-w-10xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                    <div className="bg-white shadow-md rounded-lg overflow-hidden p-8 flex flex-col flex-grow">
                        <h1 className="text-4xl font-bold">{job.title}</h1>
                        <p className="text-gray-600 mt-2">{job.company}</p>
                        <p className="text-gray-500 mt-1">{job.location}</p>

                        <div className="mt-8 flex-grow">
                            <h3 className="text-2xl font-semibold">Job Description</h3>
                            <p className="mt-4 leading-relaxed">{job.description}</p>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-2xl font-semibold">Salary</h3>
                            <p className="mt-2">{job.salary || 'Not specified'}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col flex-grow">
                        <h2 className="text-2xl font-bold mb-4">Apply for Job</h2>
                        <form onSubmit={handleFormSubmit} className="flex flex-col flex-grow">
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-gray-700">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleFormChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-gray-700">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleFormChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="pdf" className="block text-gray-700">Resume (PDF)</label>
                                <div className="relative w-full border border-gray-300 rounded-lg overflow-hidden bg-white flex items-center justify-between p-2 cursor-pointer">
                                    <span className="text-gray-500">
                                        {formData.pdf ? formData.pdf.name : "Upload your resume (PDF)"}
                                    </span>
                                    <input
                                        type="file"
                                        id="pdf"
                                        name="pdf"
                                        accept="application/pdf"
                                        onChange={handleFormChange}  // Correctly triggers file upload
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        required
                                    />
                                    <button type="button" className="px-4 py-1 bg-indigo-600 text-white rounded-lg">Choose File</button>
                                </div>
                            </div>

                            <div className="mb-4 flex-grow">
                                <label htmlFor="coverLetter" className="block text-gray-700">Cover Letter</label>
                                <textarea
                                    id="coverLetter"
                                    name="coverLetter"
                                    rows="6"
                                    value={formData.coverLetter || ""}
                                    onChange={handleFormChange}
                                    className="w-full p-2 border rounded resize-none h-full"
                                    placeholder="Write your cover letter here..."
                                    required
                                />
                            </div>

                            <div className="flex justify-end space-x-4 mt-6">
                                <button
                                    type="submit"
                                    className={`text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 ${uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                                        }`}
                                    disabled={uploading}
                                >
                                    {uploading ? (
                                        <>
                                            <svg
                                                className="animate-spin h-5 w-5 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                                ></path>
                                            </svg>
                                            <span>Uploading...</span>
                                        </>
                                    ) : (
                                        <span>Submit</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}
