// Để dành khi tích hợp MOMO / VNPAY
// Ví dụ: gọi backend tạo thanh toán (backend trả url redirect hoặc token)

import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8080/api";

export const createMomoPayment = async (orderId: string) => {
  // backend endpoint example: POST /payments/momo?orderId=xxx
  const token = localStorage.getItem("token");
  const res = await axios.post(
    `${API_BASE}/payments/momo`,
    { orderId },
    { headers: { Authorization: token ? `Bearer ${token}` : "" } }
  );
  return res.data; // backend nên trả { payUrl: string } hoặc { redirectParams }
};
