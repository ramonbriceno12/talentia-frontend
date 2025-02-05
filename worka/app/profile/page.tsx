'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import CallToAction from '@/components/homepage/CallToAction';
import Footer from '@/components/homepage/Footer';
import Navbar from '@/components/homepage/Navbar';

export default function Profile() {
    const [user, setUser] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);
    const [resumeFile, setResumeFile] = useState(null);
    const [links, setLinks] = useState([]);
    const [skills, setSkills] = useState([]);
    const [newLinkType, setNewLinkType] = useState('');
    const [newLinkUrl, setNewLinkUrl] = useState('');
    const [newSkill, setNewSkill] = useState('');
    const [loadingAvatar, setLoadingAvatar] = useState(false);
    const [loadingResume, setLoadingResume] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser).user;
                setUser(parsedUser);
                setProfilePicture(parsedUser.profile_picture);
                setResumeFile(parsedUser.resume_file);
                setLinks(parsedUser.links || []);
                setSkills(parsedUser.skills || []);
            }
        }
    }, []);

    const handleProfilePictureUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('avatar', file);
            formData.append('user_id', user.id);
            setLoadingAvatar(true);

            try {
                const response = await fetch('http://talentiave.com:5000/api/upload/avatar', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const data = await response.json();

                if (response.ok) {
                    setProfilePicture(data.fileUrl);
                    const updatedUser = { ...user, profile_picture: data.fileUrl };
                    setUser(updatedUser);
                    localStorage.setItem('user', JSON.stringify({ user: updatedUser }));
                }
            } catch (error) {
                console.error('Error uploading profile picture:', error);
            } finally {
                setLoadingAvatar(false);
            }
        }
    };

    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('resume', file);
            formData.append('user_id', user.id);
            setLoadingResume(true);

            try {
                const response = await fetch('http://talentiave.com:5000/api/upload/resume', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const data = await response.json();

                if (response.ok) {
                    setResumeFile(data.fileUrl);
                    const updatedUser = { ...user, resume_file: data.fileUrl };
                    setUser(updatedUser);
                    localStorage.setItem('user', JSON.stringify({ user: updatedUser }));
                }
            } catch (error) {
                console.error('Error uploading resume:', error);
            } finally {
                setLoadingResume(false);
            }
        }
    };

    const handleAddLink = () => {
        if (newLinkType && newLinkUrl) {
            const newLink = { type: newLinkType, url: newLinkUrl };
            const updatedLinks = [...links, newLink];

            setLinks(updatedLinks);
            setNewLinkType('');
            setNewLinkUrl('');
            localStorage.setItem('user', JSON.stringify({ user: { ...user, links: updatedLinks, skills } }));
        }
    };

    const handleAddSkill = () => {
        if (newSkill) {
            const updatedSkills = [...skills, newSkill];

            setSkills(updatedSkills);
            setNewSkill('');
            localStorage.setItem('user', JSON.stringify({ user: { ...user, skills: updatedSkills, links } }));
        }
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-lg text-gray-700">Loading profile...</p>
            </div>
        );
    }

    console.log(user)

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <section className="flex-grow bg-talentia text-gray-900 mt-24 min-h-screen flex flex-col items-center p-6 space-y-8">

                {/* Top Section - Avatar and Resume */}
                <div className="max-w-6xl w-full bg-white shadow-md rounded-lg overflow-hidden p-8 flex flex-col items-center">
                    {/* Avatar Section */}
                    <div className="relative w-40 h-40 md:w-48 md:h-48 flex items-center justify-center bg-gray-100 rounded-full overflow-hidden border-4 border-blue-500">
                        {loadingAvatar ? (
                            <div className="flex items-center justify-center h-full w-full">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
                            </div>
                        ) : (
                            <>
                                {profilePicture ? (
                                    <Image
                                        src={profilePicture}
                                        alt="Profile Picture"
                                        layout="fill"
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                        <svg className="w-16 h-16" viewBox="0 0 24 24">
                                            <path d="M12 4v16m8-8H4"></path>
                                        </svg>
                                        <p className="mt-2 text-sm">Upload Picture</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={handleProfilePictureUpload}
                                />
                            </>
                        )}
                    </div>
                    <h1 className="text-4xl font-bold mt-6">{user.name}</h1>
                    <p className="text-gray-600 mt-2">{user.email}</p>
                    <p className="text-gray-500 mt-4">{user.bio || 'No bio available'}</p>

                    {/* Resume Section */}
                    <div className="mt-12 w-full text-center">
                        {resumeFile ? (
                            <a href={resumeFile} download className="bg-blue-600 text-white px-6 py-3 rounded-lg">
                                📄 Download Resume
                            </a>
                        ) : (
                            <p className="text-gray-500">No resume uploaded yet</p>
                        )}
                        <input
                            type="file"
                            accept="application/pdf"
                            className="mt-4 block mx-auto text-sm"
                            onChange={handleResumeUpload}
                        />
                    </div>
                </div>

                {/* Bottom Section - Links and Skills */}
                <div className="max-w-6xl w-full bg-white shadow-md rounded-lg overflow-hidden p-8">

                    {/* Links Section */}
                    <div className="mb-12">
                        <h3 className="text-2xl font-semibold text-center">Links</h3>
                        {links.map((link, index) => (
                            <div key={index} className="mt-4 text-center">
                                <strong>{link.type}:</strong>{' '}
                                <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    {link.url}
                                </a>
                            </div>
                        ))}
                        <div className="flex flex-col md:flex-row gap-4 mt-6">
                            <input
                                type="text"
                                placeholder="Link Type"
                                value={newLinkType}
                                onChange={(e) => setNewLinkType(e.target.value)}
                                className="border p-2 rounded w-full"
                            />
                            <input
                                type="url"
                                placeholder="URL"
                                value={newLinkUrl}
                                onChange={(e) => setNewLinkUrl(e.target.value)}
                                className="border p-2 rounded w-full"
                            />
                        </div>
                        <div className="text-center mt-4">
                            <button
                                onClick={handleAddLink}
                                className="bg-blue-600 px-4 py-2 text-white rounded"
                            >
                                ➕ Add Link
                            </button>
                        </div>
                    </div>

                    {/* Skills Section */}
                    <div>
                        <h3 className="text-2xl font-semibold text-center">Skills</h3>
                        <div className="flex flex-wrap mt-4 gap-2 justify-center">
                            {skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-4 mt-6">
                            <input
                                type="text"
                                placeholder="Add a skill"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                className="border p-2 rounded w-full"
                            />
                        </div>
                        <div className="text-center mt-4">
                            <button
                                onClick={handleAddSkill}
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                ➕ Add Skill
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );

}
