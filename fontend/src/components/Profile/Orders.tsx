import React, { useEffect, useState } from "react";
import { getOrdersByUser } from "@/services/OrderService";
import { getProfile } from "@/services/ProfileService";
import { OrderResponseDTO } from "@/types/Order";
import { useNavigate } from "react-router-dom";
import { Clock, CheckCircle, Truck, XCircle } from "lucide-react";

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<OrderResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // 🔹 Lấy userId bằng getProfile (vì token có sẵn, không lưu trong localStorage)
        const profile = await getProfile();
        const data = await getOrdersByUser(profile.id);
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <p className="p-6 text-center">Đang tải đơn hàng...</p>;

  if (orders.length === 0)
    return (
      <div className="p-6 text-center">
        <p>Bạn chưa có đơn hàng nào.</p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 mt-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Mua sắm ngay
        </button>
      </div>
    );

  // Hàm lấy icon + màu cho status
  const renderStatus = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="flex items-center gap-1 text-yellow-600">
            <Clock className="w-4 h-4" /> Chờ xác nhận
          </span>
        );
      case "CONFIRMED":
        return (
          <span className="flex items-center gap-1 text-blue-600">
            <CheckCircle className="w-4 h-4" /> Hoàn thành
          </span>
        );
      case "DELIVERED":
        return (
          <span className="flex items-center gap-1 text-green-600">
            <Truck className="w-4 h-4" /> Đang giao
          </span>
        );
      case "CANCELLED":
        return (
          <span className="flex items-center gap-1 text-red-600">
            <XCircle className="w-4 h-4" /> Đã hủy
          </span>
        );
      default:
        return status;
    }
  };

  return (
    <div className="max-w-5xl p-6 mx-auto bg-gray-50 min-h-[80vh]">
      <h2 className="mb-6 text-2xl font-bold">📦 Đơn hàng của tôi</h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="p-5 transition bg-white rounded-lg shadow cursor-pointer hover:shadow-lg"
            onClick={() => navigate(`/order/${order.id}`, { state: { order } })}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">
                  Mã đơn:{" "}
                  <span className="font-mono text-sm text-gray-600">
                    {order.id}
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  Ngày đặt: {new Date(order.createdAt).toLocaleString("vi-VN")}
                </p>
              </div>
              <div>{renderStatus(order.status)}</div>
            </div>

            <div className="flex justify-between mt-3 text-gray-700">
              <p>Phương thức: {order.paymentMethod}</p>
              <p className="font-semibold text-primary">
                {order.totalAmount.toLocaleString()}₫
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
