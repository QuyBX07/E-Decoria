import axios from "axios";
import {
  CreateNotificationRequest,
  NotificationResponse,
  SendNotificationToUsersRequest,
  AdminNotificationResponse,
} from "@/types/Notification";

const API_BASE_URL = "http://localhost:8081/api/admin/notifications";

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
}

/**
 * 1️⃣ Admin tạo notification (chưa gửi cho ai)
 */
export const createNotification = async (
  data: CreateNotificationRequest
): Promise<NotificationResponse> => {
  const res = await axios.post(API_BASE_URL, data, authHeaders());
  return res.data;
};

/**
 * 2️⃣ Gửi notification cho danh sách user
 */
export const sendNotificationToUsers = async (
  notificationId: string,
  data: SendNotificationToUsersRequest
): Promise<void> => {
  await axios.post(
    `${API_BASE_URL}/${notificationId}/send`,
    data,
    authHeaders()
  );
};

/**
 * 3️⃣ Gửi notification cho toàn bộ user
 */
export const sendNotificationToAllUsers = async (
  notificationId: string
): Promise<void> => {
  await axios.post(
    `${API_BASE_URL}/${notificationId}/send-all`,
    {},
    authHeaders()
  );
};

export const getAllNotifications = async (): Promise<AdminNotificationResponse[]> => {
  const res = await axios.get(API_BASE_URL, authHeaders());
  return res.data;
};
