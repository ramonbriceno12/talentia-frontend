import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";
const socket = io(SOCKET_URL, {
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
});

export default function NotificationComponent({ userId }) {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (!userId) return;

        console.log(`🟢 Registering user ${userId} on WebSocket...`);
        socket.emit("register", String(userId));

        socket.on("registered", (data) => {
            console.log(`✅ Successfully registered user ${data.userId} on WebSocket.`);
        });

        socket.on("receiveNotification", (data) => {
            console.log(`📩 New notification received:`, data);
            setNotifications((prev) => [...prev, data]);
        });

        socket.on("connect", () => {
            console.log(`🔄 Reconnected! Registering user ${userId} again.`);
            socket.emit("register", String(userId));
        });

        return () => {
            console.log(`🔴 Unregistering user ${userId} from WebSocket.`);
            socket.off("receiveNotification");
            socket.off("connect");
            socket.off("registered");
        };
    }, [userId]);

    return (
        <div>
            <h3>Notifications</h3>
            {notifications.map((notif, index) => (
                <div key={index} className="p-2 bg-gray-100 rounded my-2">
                    {notif.message}
                </div>
            ))}
        </div>
    );
}
