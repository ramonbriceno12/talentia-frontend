"use client";

import { useEffect, useState } from "react";
import JobApplications from "../../components/talents/dashboard/JobApplications";
import ProfileCompletion from "../../components/talents/dashboard/ProfileCompletion";
import ProfileViews from "../../components/talents/dashboard/ProfileViews";
import ProposalsReceived from "../../components/talents/dashboard/ProposalsReceived";
import RelatedJobs from "../../components/talents/dashboard/RelatedJobs";
import Followers from "../../components/talents/dashboard/Followers";
import { useAuth } from "../../utils/authContext";
import Connections from "../../components/talents/dashboard/Connections";

export default function TalentDashboard() {
    const [profileViews, setProfileViews] = useState<number>(0);
    const [viewers, setViewers] = useState<Array>([]);
    const [completionPercentage, setCompletionPercentage] = useState<number>(0);
    const [missingFields, setMissingFields] = useState<string[]>([]);
    const [relatedJobs, setRelatedJobs] = useState<Array>([]);
    const [applicationsDashboard, setApplicationsDashboard] = useState<Array>([]);
    const [applicationsCount, setApplicationsCount] = useState<number>(0);
    const [proposals, setProposals] = useState<Array>([]);
    const [proposalsCount, setProposalsCount] = useState<number>(0);
    const [followersCount, setFollowersCount] = useState<number>(0);
    const [connectionsCount, setConnectionsCount] = useState<number>(0);
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

        const fetchRelatedJobs = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/jobs/talent/related/${user?.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) throw new Error("Failed to fetch related jobs");

                const data = await response.json();
                setRelatedJobs(data.jobs || []);
            } catch (error) {
                console.error("Error fetching related jobs:", error);
            }
        };

        const fetchApplicationsDashboard = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/applications/talent/dashboard/${user?.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) throw new Error("Failed to fetch job applications");

                const data = await response.json();
                setApplicationsDashboard(data.applications || []);
                setApplicationsCount(data.totalApplications || 0);
            } catch (error) {
                console.error("Error fetching job applications:", error);
            }
        };

        const fetchProposals = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/proposals/talent/${user?.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) throw new Error("Failed to fetch proposals");

                const data = await response.json();
                setProposals(data.proposals || []);
                setProposalsCount(data.proposalsCount || 0)

            } catch (error) {
                console.error("Error fetching proposals:", error);
            }
        };

        const fetchFollowersCount = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/follows/count/${user?.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) throw new Error("Failed to fetch followers count");

                const data = await response.json();
                setFollowersCount(data.totalFollowers || 0); // ✅ Set followers count
            } catch (error) {
                console.error("Error fetching followers count:", error);
            }
        };

        const fetchConnectionsCount = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/connections/count/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) throw new Error("Failed to fetch connections count");

                const data = await response.json();
                setConnectionsCount(data.totalConnections || 0);
            } catch (error) {
                console.error("Error fetching connections count:", error);
            }
        };

        fetchProfileViews();
        fetchProfileCompletion();
        fetchRelatedJobs();
        fetchApplicationsDashboard();
        fetchProposals();
        fetchFollowersCount();
        fetchConnectionsCount();

    }, [token]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-[#244c56]">Talent Dashboard</h1>
            <p className="text-gray-600 mt-2">
                Bienvenido al panel de control, aquí puedes ver tu actividad.
            </p>

            {/* Grid Layout for Dashboard Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                <JobApplications totalApplications={applicationsCount} />
                <ProfileCompletion completionPercentage={completionPercentage} missingFields={missingFields} />
                <ProfileViews profileViews={profileViews} viewers={viewers} />
                <ProposalsReceived totalProposals={proposalsCount} />
                <Followers totalFollowers={followersCount} />
                <Connections totalConnections={connectionsCount} />
            </div>
            <div className="mt-10">
                <RelatedJobs jobs={relatedJobs} />
            </div>
        </div>
    );
}
