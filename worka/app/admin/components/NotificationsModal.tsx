"use client";

import { useEffect } from "react";
import { FaTimes } from "react-icons/fa";

interface Notification {
  id: number;
  message: string;
  type: string;
  sender_id: number;
  is_read: boolean;
}

interface NotificationsModalProps {
  isOpen: boolean;
  notifications: Notification[];
  onClose: () => void;
  markAllAsRead: () => void;
}

export default function NotificationsModal({ isOpen, notifications, onClose, markAllAsRead }: NotificationsModalProps) {
  useEffect(() => {
    if (isOpen) {
      markAllAsRead(); // ✅ Mark notifications as read when modal opens
    }
  }, [isOpen]);

  if (!isOpen) return null; // Don't render if modal is closed

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-5 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-lg font-semibold text-[#244c56]">Notificaciones</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <FaTimes size={18} />
          </button>
        </div>

        {notifications.length === 0 ? (
          <p className="text-gray-500 text-sm text-center">No hay notificaciones</p>
        ) : (
          <div className="max-h-60 overflow-y-auto">
            {notifications.map((notif) => (
              <div key={notif.id} className="p-3 border-b last:border-0">
                <p className={`text-sm ${notif.is_read ? "text-gray-500" : "text-black font-bold"}`}>
                  {notif.message}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
