"use client";

import Link from "next/link";
import { useAuth } from "../utils/authContext";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
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

    /** ✅ Fetch past notifications from the backend */
    useEffect(() => {
        if (!user) return;

        const fetchNotifications = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/notifications/${user.id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    setNotifications(data.notifications); // ✅ Set past notifications
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchNotifications();
    }, [user]);

    /** ✅ Listen for WebSocket notifications and persist them */
    useEffect(() => {
        if (!user || !user.id) return;

        console.log(`🟢 Registering user ${user.id} for WebSocket notifications...`);
        socket.emit("register", String(user.id));

        const handleNotification = (data: any) => {
            console.log(`📩 New notification received:`, data);

            setNotifications((prev) => {
                if (prev.some((notif) => notif.id === data.id)) return prev; // Prevent duplicates
                return [data, ...prev]; // Add new notification to the top
            });
        };

        socket.on("receiveNotification", handleNotification);
        socket.on("connect", () => {
            console.log(`🔄 Reconnected! Re-registering user ${user.id}`);
            socket.emit("register", String(user.id));
        });

        return () => {
            socket.off("receiveNotification", handleNotification);
            socket.off("connect");
        };
    }, [user]);

    /** ✅ Mark notifications as read only when the modal is opened */
    const markAllAsRead = useCallback(() => {
        setNotifications((prev) => {
            if (prev.every((notif) => notif.is_read)) return prev;
            return prev.map((notif) => ({ ...notif, is_read: true }));
        });

        fetch(`http://localhost:5000/api/notifications/mark-all`, {
            method: "POST",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }).catch((err) => console.error("Failed to mark notifications as read", err));
    }, []);

    const openNotifications = () => {
        setModalOpen(true);
        markAllAsRead(); // ✅ Mark as read when opening the modal
    };

    const closeNotifications = () => setModalOpen(false);

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

    if (!user) return null; // No sidebar if user is not logged in

    return (
        <>
            <aside className={`fixed inset-y-0 left-0 w-64 bg-[#244c56] text-white p-4 z-50 transform 
                ${isOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}>

                <div className="md:hidden flex justify-end">
                    <button onClick={closeSidebar} className="text-gray-400 hover:text-white">
                        <FaTimes size={20} />
                    </button>
                </div>

                <div className="flex justify-center mb-6">
                    <Image src="/img/LOGO-01.png" alt="Logo" width={120} height={40} />
                </div>

                <div className="flex flex-col items-center mb-6 relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden">
                        <Image
                            src={user.profile_picture || "/img/default-user.png"}
                            alt="User Profile"
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <p className="mt-2 font-semibold">{user.full_name}</p>
                    <span className="text-sm text-gray-400">{user.role}</span>

                    {/* 🔔 Notification Bell */}
                    <div className="relative mt-3 cursor-pointer" onClick={openNotifications}>
                        <FaBell className="text-white text-xl" />
                        {notifications.some((n) => !n.is_read) && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-[10px] text-white px-1.5 py-0.5 rounded-full flex items-center justify-center min-w-[16px] h-[16px]">
                                {notifications.filter((n) => !n.is_read).length}
                            </span>
                        )}
                    </div>

                    {/* Navigation Menu */}
                    <nav className="mt-4 mb-6">
                        {userMenu.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className="flex items-center gap-3 py-3 px-4 rounded transition hover:bg-gray-700"
                                onClick={closeSidebar}>
                                {item.icon}
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                    {/* Plan Section */}
                    <div className="p-4 bg-[#2a5a65] rounded-lg">
                        <div className="flex items-center gap-2 mb-4">
                            <FaCrown className="text-yellow-400" />
                            Plan Actual: <span className="font-semibold">{user.plan.name}</span>
                        </div>
                        <Link className="mt-3 w-full py-2 px-4 bg-[#60cf85] text-white rounded transition block text-center" href={`/admin/talents/plans`}>
                            Upgrade Plan
                        </Link>
                    </div>

                    {/* 🔹 Logout Button (Fixed at Bottom) */}
                    <div className="mt-auto p-4">
                        <button
                            onClick={logout}
                            className="flex items-center gap-3 w-full px-4 py-3 bg-[#ff4612] text-white rounded transition hover:bg-red-700">
                            <FaSignOutAlt />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* ✅ Notifications Modal */}
            <NotificationsModal isOpen={isModalOpen} notifications={notifications} onClose={closeNotifications} markAllAsRead={markAllAsRead} />
        </>
    );
}
