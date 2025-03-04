"use client";

import { useEffect } from "react";
import { FaTimes } from "react-icons/fa";

interface Notification {
  id: number | string;
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
  }, [isOpen, markAllAsRead]);

  if (!isOpen) return null; // Don't render if modal is closed

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] md:w-[600px] max-h-[500px] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-semibold text-[#244c56]">Notificaciones</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-10">No hay notificaciones</p>
        ) : (
          <div className="flex-1 overflow-y-auto max-h-[400px] space-y-3">
            {notifications.map((notif, index) => (
              <div key={notif.id ?? `notif-${index}`} className="p-4 bg-gray-100 rounded-lg shadow-sm border border-gray-200">
                <p
                  className={`text-base ${notif.is_read ? "text-gray-500" : "text-black font-bold"}`}
                  dangerouslySetInnerHTML={{ __html: notif.message }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
