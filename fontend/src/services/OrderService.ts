import axios from "axios";
import {
  OrderRequestDTO,
  OrderResponseDTO,
  OrderDetailResponseDTO, // 👈 thêm dòng này
} from "@/types/Order";

const API_BASE_URL = "http://localhost:8081/api/orders";

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
}

// 🧾 1️⃣ Tạo đơn hàng
export const createOrder = async (
  orderData: OrderRequestDTO
): Promise<OrderResponseDTO> => {
  const res = await axios.post(API_BASE_URL, orderData, authHeaders());
  return res.data;
};

// 📦 2️⃣ Lấy danh sách đơn hàng của người dùng hiện tại
export const getOrdersByUser = async (
  userId: string
): Promise<OrderDetailResponseDTO[]> => {
  const res = await axios.get(`${API_BASE_URL}/user/${userId}`, authHeaders());
  return res.data;
};

// 🔍 3️⃣ Lấy chi tiết 1 đơn hàng (bản đơn giản)
export const getOrderById = async (
  orderId: string
): Promise<OrderResponseDTO> => {
  const res = await axios.get(`${API_BASE_URL}/${orderId}`, authHeaders());
  return res.data;
};

// ❌ Hủy đơn hàng
export const cancelOrder = async (
  orderId: string
): Promise<OrderResponseDTO> => {
  const res = await axios.put(
    `${API_BASE_URL}/${orderId}/cancel`,
    {},
    authHeaders()
  );
  return res.data;
};

// 🆕 4️⃣ Lấy chi tiết đơn hàng (bản nâng cấp có name, image)
export const getOrderDetailById = async (
  orderId: string
): Promise<OrderDetailResponseDTO> => {
  const res = await axios.get(
    `${API_BASE_URL}/detail/${orderId}`,
    authHeaders()
  );
  return res.data;
};

// 💳 Thanh toán lại đơn hàng
export const retryPayment = async (orderId: string) => {
  const res = await axios.get(
    `http://localhost:8081/api/payment/retry?orderId=${orderId}`,
    authHeaders()
  );
  return res.data; // { payment_url }
};
