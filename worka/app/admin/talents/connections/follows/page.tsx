// 'use client'

// import { useAuth } from "../../../utils/authContext";
// import TalentFollowers from "@/app/admin/components/talents/followers/TalentFollowers";

// export default function MyNetworkPage() {
//     const { user } = useAuth();

//     return (
//         <div className="p-6 space-y-6"> {/* ✅ Removes single big container */}
            
//             {/* Talent Connections */}
//             <div className="bg-white p-6 rounded-xl shadow-lg">
//                 <h2 className="text-2xl font-bold text-[#244c56]">Mi Red</h2>
//                 <TalentConnections userId={user?.id}/>
//             </div>

//             {/* Related Talents */}
//             <div className="bg-white p-6 rounded-xl shadow-lg">
//                 <RelatedTalents userId={user?.id} />
//             </div>

//         </div>
//     );
// }
