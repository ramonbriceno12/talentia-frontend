'use client'

import { useAuth } from "../../utils/authContext";
import RelatedTalents from "../../components/talents/related/RelatedTalents";
import TalentConnections from "../../components/talents/connections/TalentConnections";
import TalentFollowers from "../../components/talents/followers/TalentFollowers";
import TalentFollowing from "../../components/talents/followers/TalentFollowing";

export default function MyNetworkPage() {
    const { user } = useAuth();

    return (
        <div className="p-6 space-y-6"> {/* ✅ Removes single big container */}

            {/* Talent Connections */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                {/* Header with "Mi Red" and "All Talents" button */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[#244c56]">Mi Red</h2>
                    <button
                        onClick={() => {
                            // Add navigation logic to the "All Talents" page
                            console.log("Navigate to All Talents");
                        }}
                        className="px-4 py-2 bg-[#244c56] text-white rounded-lg hover:bg-[#1a3a42] transition-colors"
                    >
                        Explorar Usuarios
                    </button>
                </div>
                <TalentConnections userId={user?.id} />
            </div>

            {/* Follows */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-[#244c56]">Seguidores</h2>
                <TalentFollowers userId={user?.id} />
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-[#244c56]">Siguiendo</h2>
                <TalentFollowing userId={user?.id} />
            </div>

            {/* Related Talents */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <RelatedTalents userId={user?.id} />
            </div>

        </div>
    );
}
