import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// Khi cổng thanh toán redirect về frontend, bạn có thể dùng page này để đọc query params

// và gọi backend kiểm tra trạng thái đơn hàng rồi redirect sang OrderSuccessPage

const PaymentCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(search);
    const orderId = params.get("orderId");
    // const status = params.get("status");
    // TODO: gọi backend xác thực orderId
    if (orderId) {
      navigate(`/order-success/${orderId}`);
    } else {
      navigate("/");
    }
  }, [navigate, search]);
  return <div className="p-6">Đang xử lý thanh toán...</div>;
};
export default PaymentCallbackPage;
