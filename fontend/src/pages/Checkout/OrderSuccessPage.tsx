import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderDetailById } from "@/services/OrderService";
import { OrderDetailResponseDTO } from "@/types/Order";
import HeaderSection from "@/components/HeaderSection";
import { CheckCircle } from "lucide-react";
import { Package, Clock, Truck, XCircle } from "lucide-react";

const OrderSuccessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetailResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!id) return;
        const data = await getOrderDetailById(id);
        console.log("Fetched order data:", data);
        setOrder(data);
      } catch (err) {
        console.error("Không thể tải đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <p className="p-6 text-center">Đang tải...</p>;
  if (!order)
    return <p className="p-6 text-center">Không tìm thấy đơn hàng.</p>;

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
            <Package className="w-4 h-4" /> Đã xác nhận
          </span>
        );
      case "DELIVERED":
        return (
          <span className="flex items-center gap-1 text-purple-600">
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
    <>
      <HeaderSection />

      <div className="max-w-5xl p-6 mx-auto mt-6 bg-white rounded-lg shadow-sm">
        {/* Thành công */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <CheckCircle className="text-green-600 w-14 h-14" />
          <h1 className="text-2xl font-bold text-green-600">
            Đặt hàng thành công!
          </h1>
          <p>
            Mã đơn hàng: <span className="font-semibold">#{order.id}</span>
          </p>
        </div>

        {/* Thông tin trạng thái */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Trạng thái đơn hàng</h2>
          <div>{renderStatus(order.status)}</div>
        </div>

        {/* Thông tin giao hàng & thanh toán */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-2 font-medium text-gray-700">
              📍 Thông tin giao hàng
            </h3>
            <p>{order.shippingAddress}</p>
            <p className="text-sm text-gray-500">
              Phương thức: {order.shippingMethod}
            </p>
          </div>

          <div>
            <h3 className="mb-2 font-medium text-gray-700">💳 Thanh toán</h3>
            <p>Phương thức: {order.paymentMethod}</p>
            <p className="text-sm">
              Trạng thái thanh toán:
              <span
                className={
                  order.paymentStatus === "COMPLETED"
                    ? "text-green-600 font-medium"
                    : order.paymentStatus === "FAILED"
                    ? "text-red-600 font-medium"
                    : "text-gray-600"
                }
              >
                {order.paymentStatus}
              </span>
            </p>
            <p className="text-sm text-gray-500">
              Mã giao dịch: {order.transactionId}
            </p>
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <h3 className="mt-6 mb-3 text-lg font-semibold">🛒 Sản phẩm</h3>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 border rounded-md"
            >
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => navigate(`/products/${item.productId}`)}
              >
                <img
                  src={item.productImage || "/placeholder.svg"}
                  alt={item.productName}
                  className="object-cover w-16 h-16 rounded-md"
                />
                <div>
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-sm text-gray-500">
                    SL: {item.quantity} × {item.unitPrice.toLocaleString()}₫
                  </p>
                </div>
              </div>

              <p className="font-semibold">{item.subtotal.toLocaleString()}₫</p>
            </div>
          ))}
        </div>

        {/* Tổng tiền */}
        <div className="flex justify-between mt-6 text-lg font-semibold">
          <span>Tổng cộng:</span>
          <span className="text-primary">
            {order.totalAmount.toLocaleString()}₫
          </span>
        </div>

        {/* Nút hành động */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Về trang chủ
          </button>

          <button
            onClick={() => navigate(`/order/${order.id}`)}
            className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Xem chi tiết đơn hàng
          </button>
        </div>
      </div>
    </>
  );
};

export default OrderSuccessPage;
