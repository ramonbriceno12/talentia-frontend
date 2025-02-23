"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../utils/authContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ProfileCard from "../../components/talents/ProfileCard";
import BioSection from "../../components/talents/BioCard";
import ResumeUpload from "../../components/talents/ResumesCard";
import ExperienceSalarySection from "../../components/talents/ExperienceCard";
import SkillsSection from "../../components/talents/SkillsCard";

export default function TalentDashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [talentData, setTalentData] = useState<any>(null);

    useEffect(() => {
        if (!user) {
            router.push("/admin/login");
            return;
        }

        const fetchTalentData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/talents/${user.id}`);
                if (response.ok) {
                    const data = await response.json();
                    console.log(data)
                    setTalentData(data);
                } else {
                    console.error("Failed to fetch talent data");
                }
            } catch (error) {
                console.error("Error fetching talent data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTalentData();
    }, [user, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    if (!talentData) {
        return <div className="p-6 text-red-500">Error loading data</div>;
    }

    const handleProfileUpdate = (updatedData: any) => {
        setTalentData((prev: any) => ({ ...prev, ...updatedData }));
        console.log("Updated Data:", updatedData); // We'll integrate API submission next
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-[#244c56]">Welcome, {talentData.full_name}!</h1>
            <p className="mt-2 text-gray-600 font-semibold">Role: {user?.role}</p>

            {/* Profile Card with Editing */}
            <ProfileCard talentData={talentData} onSave={handleProfileUpdate} />

            {/* Bio Section */}
            <BioSection
                bio={talentData.bio}
                talentId={talentData.id}
                onSave={(updatedBio) => setTalentData((prev) => ({ ...prev, bio: updatedBio }))}
            />

            {/* Resumes */}
            <ResumeUpload talentId={talentData.id} />

            {/* Experience & Salary Section */}
            <ExperienceSalarySection
                talentId={talentData.id}
                yearsOfExperience={talentData.years_of_experience}
                expectedSalary={talentData.expected_salary}
                jobTypePreference={talentData.job_type_preference}
                onSave={(updatedData) => setTalentData((prev) => ({ ...prev, ...updatedData }))}
            />

            {/* Skills */}
            <SkillsSection
                talentId={talentData.id}
                skills={talentData.skills || []} // ✅ Ensure it's always an array
                onSave={(updatedSkills) => setTalentData((prev) => ({ ...prev, skills: updatedSkills }))}
            />

            {/* Job Applications Limit */}
            <div className="mt-6 bg-white shadow-md p-4 rounded">
                <h2 className="text-xl font-semibold">Job Applications</h2>
                <p className="text-gray-600">
                    {user?.is_featured
                        ? "You have unlimited applications!"
                        : "Limited job applications per month."}
                </p>
                {!user?.is_featured && (
                    <Link href="/admin/upgrade">
                        <button className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded">Upgrade Plan</button>
                    </Link>
                )}
            </div>
        </div>
    );
}
