
interface UserBadgeProps {
    imageUrl: string;
    statusBadge: "open_to_work" | "recruiting" | null;
}

const UserBadge: React.FC<UserBadgeProps> = ({ imageUrl, statusBadge }) => {
    const badgeText = statusBadge === "open_to_work" ? "Open to Work" 
                    : statusBadge === "recruiting" ? "Recruiting" 
                    : "";

    const badgeColor = statusBadge === "open_to_work" ? "bg-green-500" 
                     : statusBadge === "recruiting" ? "bg-blue-500" 
                     : "hidden";

    return (
        <div className="relative w-24 h-24">
            {/* User Profile Image */}
            <img 
                src={imageUrl || "img/default-user.png"} 
                alt="User Avatar" 
                className="w-24 h-24 rounded-full border-2 border-gray-300 object-cover"
            />

            {/* Status Badge - Small and at the bottom right */}
            {statusBadge && (
                <span className={`absolute bottom-0 right-0 px-2 py-1 text-[10px] font-semibold text-white rounded-full ${badgeColor}`}>
                    {badgeText}
                </span>
            )}
        </div>
    );
};

export default UserBadge;
