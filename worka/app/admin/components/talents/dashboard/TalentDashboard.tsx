import { useEffect, useState } from "react";

export default function TalentDashboard({ talentId }: { talentId: number }) {
  const [profileViews, setProfileViews] = useState(0);
  const [viewers, setViewers] = useState<{ id: number; full_name: string; email: string; profile_picture?: string }[]>([]);

  useEffect(() => {
    const fetchProfileViews = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/profile-views/${talentId}`);
        if (!response.ok) throw new Error("Error fetching profile views");
        const data = await response.json();
        setProfileViews(data.profileViews);
        setViewers(data.viewers);
      } catch (error) {
        console.error("Error fetching profile views:", error);
      }
    };

    fetchProfileViews();
  }, [talentId]);

  return (
    <div className="mt-6 bg-white shadow-md p-4 rounded">
      <h2 className="text-xl font-semibold text-[#244c56]">Visitas al Perfil</h2>
      <p className="text-3xl font-bold text-[#244c56]">{profileViews}</p>

      {viewers.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-[#244c56]">Personas que vieron tu perfil</h3>
          <ul className="mt-2 space-y-2">
            {viewers.map((viewer) => (
              <li key={viewer.id} className="flex items-center gap-3 border p-2 rounded">
                <img
                  src={viewer.profile_picture || "/default-avatar.png"}
                  alt={viewer.full_name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-[#244c56] font-semibold">{viewer.full_name}</p>
                  <p className="text-gray-500 text-sm">{viewer.email}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
