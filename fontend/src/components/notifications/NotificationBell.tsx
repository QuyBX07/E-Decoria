import React, { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import {
  getMyNotifications,
  countUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/services/NotificationService";
import { UserNotification } from "@/types/Notification";

const MAX_DISPLAY = 8;

const NotificationBell: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  // Load dữ liệu
  const loadData = async () => {
    const [listRes, unread] = await Promise.all([
      getMyNotifications(0, 50), // lấy nhiều, xử lý ở FE
      countUnreadNotifications(),
    ]);

    setNotifications(listRes.content);
    setUnreadCount(unread);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Click outside để đóng dropdown
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ===== XỬ LÝ FRONTEND =====
  const unreadList = notifications.filter((n) => !n.read);
  const readList = notifications.filter((n) => n.read);

  const displayList = [...unreadList, ...readList].slice(0, MAX_DISPLAY);

  const handleRead = async (n: UserNotification) => {
    if (!n.read) {
      await markNotificationAsRead(n.id);
      loadData();
    }
  };

  const handleReadAll = async () => {
    await markAllNotificationsAsRead();
    loadData();
  };

  return (
    <div ref={ref} className="relative">
      {/* 🔔 Bell */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-primary/10"
      >
        <Bell className="w-5 h-5 text-primary-dark" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 text-xs text-white bg-red-500 rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 z-50 mt-2 bg-white border shadow-lg w-80 rounded-xl">
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <span className="font-medium">Thông báo</span>
            {unreadCount > 0 && (
              <button
                onClick={handleReadAll}
                className="text-sm text-primary hover:underline"
              >
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>

          <div className="overflow-y-auto max-h-96">
            {displayList.length === 0 ? (
              <p className="p-4 text-sm text-center text-gray-500">
                Không có thông báo
              </p>
            ) : (
              displayList.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleRead(n)}
                  className={`px-4 py-3 text-sm cursor-pointer border-b transition
                    ${!n.read ? "bg-primary/5 font-medium" : "text-gray-600"}
                    hover:bg-gray-50`}
                >
                  <p>{n.title}</p>
                  <p className="text-xs line-clamp-2">{n.message}</p>
                  <p className="mt-1 text-[10px] text-gray-400">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="text-center border-t">
            <a
              href="/notifications"
              className="block px-4 py-2 text-sm text-primary hover:underline"
              onClick={() => setOpen(false)}
            >
              Xem tất cả thông báo
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
