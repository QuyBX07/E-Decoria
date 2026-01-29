import React, { useEffect, useState } from "react";
import { getOrdersByUser } from "@/services/OrderService";
import { getProfile } from "@/services/ProfileService";
import { OrderDetailResponseDTO } from "@/types/Order";
import {
  Package,
  CheckCircle,
  Clock,
  XCircle,
  CheckCircle2,
} from "lucide-react";

const PurchaseHistory: React.FC = () => {
  const [orders, setOrders] = useState<OrderDetailResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const profile = await getProfile();
        const data = await getOrdersByUser(profile.id);
        setOrders(data);
      } catch (err) {
        console.error("Không thể tải lịch sử mua hàng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading)
    return <p className="p-6 text-center">Đang tải lịch sử mua hàng...</p>;

  if (orders.length === 0)
    return (
      <div className="p-6 text-center">
        <p>Bạn chưa có lịch sử mua hàng nào.</p>
      </div>
    );

  // 🧩 Hàm hiển thị trạng thái đơn hàng
  const renderStatus = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return (
          <span className="flex items-center gap-1 text-green-600">
            <CheckCircle className="w-4 h-4" /> Giao Hàng
          </span>
        );
      case "PENDING":
        return (
          <span className="flex items-center gap-1 text-yellow-600">
            <Clock className="w-4 h-4" /> Chờ xác nhận
          </span>
        );
      case "CANCELLED":
        return (
          <span className="flex items-center gap-1 text-red-600">
            <XCircle className="w-4 h-4" /> Đã hủy
          </span>
        );
      case "CONFIRMED":
        return (
          <span className="flex items-center gap-1 text-blue-600">
            <CheckCircle2 className="w-4 h-4" /> Thành công
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-blue-600">
            <Package className="w-4 h-4" /> {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl p-6 mx-auto rounded-lg shadow-sm bg-gray-50">
      <h2 className="mb-6 text-2xl font-semibold">🛍️ Lịch sử mua hàng</h2>

      <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-3">Sản phẩm</th>
              <th className="p-3">Ngày mua</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3 text-right">Tổng</th>
            </tr>
          </thead>
          <tbody>
            {orders.flatMap((order) =>
              order.items.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="flex items-center gap-3 p-3">
                    <img
                      src={item.productImage || "/placeholder.svg"}
                      alt={item.productName || "Sản phẩm"}
                      className="object-cover w-12 h-12 rounded"
                    />
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-gray-500">
                        SL: {item.quantity}
                      </p>
                    </div>
                  </td>
                  <td className="p-3">
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="p-3">{renderStatus(order.status)}</td>
                  <td className="p-3 text-right">
                    {item.subtotal.toLocaleString()}₫
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseHistory;
