import axios from "axios";
import { User } from "@/types/User";

const API_BASE_URL = "http://localhost:8081/api/users";

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
 * Lấy danh sách toàn bộ user
 */
export const getAllUsers = async (): Promise<User[]> => {
  const res = await axios.get(API_BASE_URL, authHeaders());
  return res.data;
};

/**
 * Tạo user mới (ADMIN)
 */
export const createUser = async (payload: {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  role: string;
}): Promise<User> => {
  const res = await axios.post(API_BASE_URL, payload, authHeaders());
  return res.data;
};

export const updateUser = async (
  id: string,
  payload: {
    fullName: string;
    email: string;
    phone?: string;
    address?: string;
    role: string;
  }
) => {
  const res = await axios.put(`${API_BASE_URL}/${id}`, payload, authHeaders());
  return res.data;
};


/**
 * Xóa user (ADMIN)
 */
export const deleteUser = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/${id}`, authHeaders());
};
