"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../utils/authContext";
import { useRouter } from "next/navigation";
import ProfileCard from "../../components/talents/profile/ProfileCard";
import BioSection from "../../components/talents/profile/BioCard";
import ResumeUpload from "../../components/talents/profile/ResumesCard";
import ExperienceSalarySection from "../../components/talents/profile/ExperienceCard";
import SkillsSection from "../../components/talents/profile/SkillsCard";
import LinksSection from "../../components/talents/profile/LinksCard";

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

            {/* Links Section */}
            <LinksSection links={talentData.links || []} talentId={talentData.id} onSave={(updatedLinks) => setTalentData((prev) => ({ ...prev, links: updatedLinks }))} />

        </div>
    );
}
