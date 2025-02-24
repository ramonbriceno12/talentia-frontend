"use client";

import { useEffect, useState } from "react";
import JobApplications from "../../components/talents/dashboard/JobApplications";
import ProfileCompletion from "../../components/talents/dashboard/ProfileCompletion";
import ProfileViews from "../../components/talents/dashboard/ProfileViews";
import ProposalsReceived from "../../components/talents/dashboard/ProposalsReceived";
import RelatedJobs from "../../components/talents/dashboard/RelatedJobs";
import { useAuth } from "../../utils/authContext";

export default function TalentDashboard() {
    const [profileViews, setProfileViews] = useState<number>(0);
    const [viewers, setViewers] = useState<Array>([]);
    const [completionPercentage, setCompletionPercentage] = useState<number>(0);
    const [missingFields, setMissingFields] = useState<string[]>([]);
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const { user } = useAuth();

    useEffect(() => {
        const fetchProfileViews = async () => {
            if (!token) return;

            try {
                const response = await fetch(`http://localhost:5000/api/profile-views/${user?.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) throw new Error("Failed to fetch profile views");

                const data = await response.json();
                setProfileViews(data.profileViews || 0);
                setViewers(data.viewers || []);
            } catch (error) {
                console.error("Error fetching profile views:", error);
            }
        };

        const fetchProfileCompletion = async () => {
            if (!token) return;

            try {
                const response = await fetch(`http://localhost:5000/api/talents/completion/${user?.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) throw new Error("Failed to fetch profile completion");

                const data = await response.json();
                setCompletionPercentage(data.completionPercentage || 0);
                setMissingFields(data.missingFields || []);
            } catch (error) {
                console.error("Error fetching profile completion:", error);
            }
        };

        fetchProfileViews();
        fetchProfileCompletion();
    }, [token]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-[#244c56]">Talent Dashboard</h1>
            <p className="text-gray-600 mt-2">
                Bienvenido al panel de control, aquí puedes ver tu actividad.
            </p>

            {/* Grid Layout for Dashboard Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                <JobApplications />
                <ProfileCompletion completionPercentage={completionPercentage} missingFields={missingFields} />
                <ProfileViews profileViews={profileViews} viewers={viewers} />
                <ProposalsReceived />
                <RelatedJobs />
            </div>
        </div>
    );
}
