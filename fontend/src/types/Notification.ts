export type NotificationType = "SYSTEM" | "ORDER" | "PROMOTION";

export interface UserNotification {
  id: string;                 // user_notification_id
  notificationId: string;     // notification gốc
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;          // ISO string
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// ADMIN
export interface CreateNotificationRequest {
  title: string;
  message: string;
  type: string; // SYSTEM | PROMOTION | ORDER ...
}

export interface NotificationResponse {
  id: string;
  title: string;
  message: string;
  type: string;
  createdAt: string;
}

export interface SendNotificationToUsersRequest {
  userIds: string[];
}

export interface AdminNotificationResponse {
  id: string;
  title: string;
  message: string;
  type: string;
  createdAt: string;
  sent: boolean; // backend trả về
}