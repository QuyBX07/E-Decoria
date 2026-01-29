import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const PaymentCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Đang xử lý thanh toán...");

  useEffect(() => {
    const verifyPayment = async () => {
      const params = new URLSearchParams(search);
      const orderId = params.get("vnp_TxnRef"); // VNPay trả orderId

      if (!orderId) {
        setMessage("Không tìm thấy đơn hàng.");
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:8081/api/payment/result`,
          {
            params: { orderId },
            headers: { Authorization: token ? `Bearer ${token}` : "" },
          }
        );

        const status = res.data.status; // backend trả { status: "SUCCESS" | "FAILED" }
        if (status === "SUCCESS") {
          navigate(`/order-success/${orderId}`);
        } else {
          setMessage("Thanh toán thất bại, vui lòng thử lại.");
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        setMessage("Có lỗi khi xác thực thanh toán.");
        setLoading(false);
      }
    };

    verifyPayment();

    // fallback timeout nếu backend không phản hồi
    const timer = setTimeout(() => {
      if (loading) {
        setMessage("Hết thời gian xử lý, vui lòng thử lại.");
        setLoading(false);
      }
    }, 15000);

    return () => clearTimeout(timer);
  }, [search, navigate, loading]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      {loading ? (
        <>
          <svg
            className="w-12 h-12 text-blue-600 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <p className="mt-4 text-gray-700">{message}</p>
        </>
      ) : (
        <p className="text-red-600">{message}</p>
      )}
    </div>
  );
};

export default PaymentCallbackPage;
