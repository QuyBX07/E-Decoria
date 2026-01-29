import axios from "axios";

const API_BASE_URL = "http://localhost:8081/api/payment";

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
}

// 🔗 1️⃣ Tạo link thanh toán VNPay
export type VNPayResponse = {
  payment_url: string;
};

export const createVNPayPayment = async (
  orderId: string,
  amount: number
): Promise<VNPayResponse> => {
  const res = await axios.get<VNPayResponse>(`${API_BASE_URL}/vnpay`, {
    params: { orderId, amount },
    ...authHeaders(),
  });

  return res.data;
};

