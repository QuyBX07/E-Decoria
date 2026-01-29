import { User } from "../types/User";

const BASE_URL = "http://localhost:8081/api/profile";

// Hàm tiện ích: lấy token từ localStorage (nếu có)
function getAuthHeader(): HeadersInit {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// 🧩 Lấy thông tin profile hiện tại
export async function getProfile(): Promise<User> {
  const res = await fetch(BASE_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });

  if (!res.ok) {
    throw new Error("Không thể tải thông tin người dùng");
  }

  return res.json();
}

// 🧩 Cập nhật thông tin cá nhân
export async function updateProfile(dto: Partial<User>): Promise<User> {
  const res = await fetch(`${BASE_URL}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    throw new Error("Cập nhật thông tin thất bại");
  }

  return res.json();
}

// 🧩 Đổi mật khẩu
export async function changePassword(
  oldPassword: string,
  newPassword: string
): Promise<string> {
  const res = await fetch(`${BASE_URL}/change-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      ...getAuthHeader(),
    },
    body: new URLSearchParams({
      oldPassword,
      newPassword,
    }),
  });

  if (!res.ok) {
    throw new Error("Đổi mật khẩu thất bại");
  }

  return res.text(); // Backend trả string "Đổi mật khẩu thành công!"
}

export async function uploadAvatar(userId: string, file: File): Promise<User> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`http://localhost:8081/api/users/${userId}/avatar`, {
    method: "PUT",
    headers: {
      ...getAuthHeader(),
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Upload avatar thất bại");
  }

  return res.json();
}

