import axios from "axios";
import {
  PageResponse,
  UserNotification,
} from "@/types/Notification";

const API_BASE_URL = "http://localhost:8081/api/notifications";

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
}

// 🔔 Lấy thông báo của người dùng hiện tại với phân trang và lọc
export const getMyNotifications = async (
  page: number = 0,
  size: number = 10,
  type?: string,
  isRead?: boolean
): Promise<PageResponse<UserNotification>> => {

  const params: Record<string, string | number | boolean> = {
    page,
    size,
  };

  if (type !== undefined) params.type = type;
  if (isRead !== undefined) params.isRead = isRead;

  const res = await axios.get(
    API_BASE_URL,
    { params, ...authHeaders() }
  );

  return res.data;
};

// 📊 Đếm số thông báo chưa đọc
export const countUnreadNotifications = async (): Promise<number> => {
  const res = await axios.get(
    `${API_BASE_URL}/unread-count`,
    authHeaders()
  );

  return res.data.unreadCount; // ✅ đúng field backend trả
};


// ✅ Đánh dấu thông báo là đã đọc
export const markNotificationAsRead = async (
  userNotificationId: string
): Promise<void> => {
  await axios.patch(
    `${API_BASE_URL}/${userNotificationId}/read`,
    {},
    authHeaders()
  );
};

// ✅ Đánh dấu tất cả thông báo là đã đọc
export const markAllNotificationsAsRead = async (): Promise<void> => {
  await axios.patch(
    `${API_BASE_URL}/read-all`,
    {},
    authHeaders()
  );
};



