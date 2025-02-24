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
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const { user } = useAuth();

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!token || !user?.id) return;

            try {
                // Fetch both profile views & profile completion
                const [viewsResponse, completionResponse] = await Promise.all([
                    fetch(`http://localhost:5000/api/profile-views/${user.id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`http://localhost:5000/api/talents/completion/${user.id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                if (!viewsResponse.ok) throw new Error("Failed to fetch profile views");
                if (!completionResponse.ok) throw new Error("Failed to fetch profile completion");

                const viewsData = await viewsResponse.json();
                const completionData = await completionResponse.json();

                console.log(completionData)

                setProfileViews(viewsData.profileViews || 0);
                setViewers(viewsData.viewers || []);
                setCompletionPercentage(completionData.completionPercentage || 0);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };

        fetchDashboardData();
    }, [token, user?.id]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-[#244c56]">Talent Dashboard</h1>
            <p className="text-gray-600 mt-2">
                Bienvenido al panel de control, aquí puedes ver tu actividad.
            </p>

            {/* Grid Layout for Dashboard Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                <JobApplications />
                <ProfileCompletion completionPercentage={completionPercentage} />
                <ProfileViews profileViews={profileViews} viewers={viewers} />
                <ProposalsReceived />
                <RelatedJobs />
            </div>
        </div>
    );
}
