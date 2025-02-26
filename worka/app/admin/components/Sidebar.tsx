"use client";

import Link from "next/link";
import { useAuth } from "../utils/authContext";
import Image from "next/image";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
    FaTimes,
    FaSignOutAlt,
    FaUser,
    FaHome,
    FaBriefcase,
    FaUsers,
    FaFileAlt,
    FaSuitcase,
    FaCrown,
    FaFileInvoiceDollar,
    FaUserFriends,
    FaBell
} from "react-icons/fa";
import NotificationsModal from "./NotificationsModal";

const SOCKET_URL = "http://localhost:5000";
const socket = io(SOCKET_URL, {
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
});

export default function Sidebar({ isOpen, closeSidebar }: { isOpen: boolean; closeSidebar: () => void }) {
    const { user, logout } = useAuth();
    const [notifications, setNotifications] = useState<{ id: number; message: string; type: string; sender_id: number; is_read: boolean }[]>([]);
    const [isModalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        if (!user) return;

        console.log(`🟢 Registering user ${user.id} for WebSocket notifications...`);
        socket.emit("register", String(user.id));

        // ✅ Listen for new notifications
        socket.on("receiveNotification", (data) => {
            console.log(`📩 New notification received:`, data);
            setNotifications((prev) => [data, ...prev]); // Add new notifications at the top
        });

        // ✅ Auto re-register if connection is lost
        socket.on("connect", () => {
            console.log(`🔄 Reconnected! Re-registering user ${user.id}`);
            socket.emit("register", String(user.id));
        });

        return () => {
            console.log(`🔴 Unregistering user ${user.id} from WebSocket.`);
            socket.off("receiveNotification");
            socket.off("connect");
        };
    }, [user]);

    if (!user) return null; // No sidebar if user is not logged in

    // Define menu options based on user role with icons
    const menuOptions = {
        talent: [
            { path: "/admin/talents/dashboard", label: "Dashboard", icon: <FaHome /> },
            { path: "/admin/talents/profile", label: "Perfil", icon: <FaUser /> },
            { path: "/admin/talents/connections", label: "Mi Red", icon: <FaUserFriends /> },
            { path: "/admin/talents/jobs", label: "Empleos", icon: <FaSuitcase /> },
            { path: "/admin/talents/applications", label: "Mis Aplicaciones", icon: <FaBriefcase /> },
            { path: "/admin/talents/proposals", label: "Propuestas", icon: <FaFileAlt /> },
            { path: "/admin/talents/billing", label: "Pagos", icon: <FaFileInvoiceDollar /> }
        ],
        recruiter: [
            { path: "/admin", label: "Dashboard", icon: <FaHome /> },
            { path: "/admin/jobs", label: "Manage Jobs", icon: <FaBriefcase /> },
            { path: "/admin/candidates", label: "Candidates", icon: <FaUsers /> },
        ],
        company: [
            { path: "/admin", label: "Dashboard", icon: <FaHome /> },
            { path: "/admin/jobs", label: "Company Jobs", icon: <FaBriefcase /> },
            { path: "/admin/employees", label: "Employees", icon: <FaUsers /> },
        ],
    };

    const userMenu = menuOptions[user.role] || [];

    const openNotifications = () => setModalOpen(true);
    const closeNotifications = () => setModalOpen(false);
    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((notif) => ({ ...notif, is_read: true })));
    };

    return (
        <>
            <aside
                className={`fixed inset-y-0 left-0 w-64 bg-[#244c56] text-white p-4 z-50 
      transform ${isOpen ? "translate-x-0" : "-translate-x-full"} 
      md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}
            >
                {/* Mobile Close Button */}
                <div className="md:hidden flex justify-end">
                    <button onClick={closeSidebar} className="text-gray-400 hover:text-white">
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <Image src="/img/LOGO-01.png" alt="Logo" width={120} height={40} />
                </div>

                {/* User Profile & Notifications */}
                <div className="flex flex-col items-center mb-6 relative">
                    {user.profile_picture ? (
                        <div className="w-16 h-16 rounded-full overflow-hidden">
                            <Image
                                src={user.profile_picture}
                                alt="User Profile"
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-16 h-16 rounded-full overflow-hidden">
                            <Image
                                src="/img/default-user.png" // ✅ Default image when no profile picture
                                alt="Default User"
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                    <p className="mt-2 font-semibold">{user.full_name}</p>
                    <span className="text-sm text-gray-400">{user.role}</span>

                    {/* Notification Bell */}
                    <div className="relative mt-3 cursor-pointer" onClick={openNotifications}>
                        <FaBell className="text-white text-xl" />
                        {notifications.some((n) => !n.is_read) && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-xs text-white px-2 py-1 rounded-full">
                                {notifications.filter((n) => !n.is_read).length}
                            </span>
                        )}
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="mt-4 mb-6">
                    {userMenu.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className="flex items-center gap-3 py-3 px-4 rounded transition hover:bg-gray-700"
                            onClick={closeSidebar}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Current Plan */}
                <div className="p-4 bg-[#2a5a65] rounded-lg">
                    <div className="flex items-center gap-2 mb-4">
                        <FaCrown className="text-yellow-400" />
                        Plan Actual: <span className="font-semibold">{user.plan.name}</span>
                    </div>
                    <Link className="mt-3 w-full py-2 px-4 bg-[#60cf85] text-white rounded transition" href={`/admin/talents/plans`}>
                        Upgrade Plan
                    </Link>
                </div>

                {/* Logout Button */}
                <div className="absolute bottom-6 left-4 w-full">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 w-[90%] px-4 py-3 bg-[#ff4612] text-white rounded transition hover:bg-red-700"
                    >
                        <FaSignOutAlt />
                        Logout
                    </button>
                </div>
            </aside>

            {/* ✅ Notifications Modal */}
            <NotificationsModal
                isOpen={isModalOpen}
                notifications={notifications}
                onClose={closeNotifications}
                markAllAsRead={markAllAsRead}
            />
        </>
    );
}
