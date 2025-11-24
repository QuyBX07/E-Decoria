import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderDetailById, cancelOrder } from "@/services/OrderService";
import { OrderDetailResponseDTO } from "@/types/Order";
import { Package, Clock, Truck, XCircle } from "lucide-react";
import Swal from "sweetalert2";
import HeaderSection from "@/components/HeaderSection";

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetailResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!id) return;
        const data = await getOrderDetailById(id);
        setOrder(data);
      } catch (err) {
        console.error("Không thể tải chi tiết đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading)
    return <p className="p-6 text-center">Đang tải chi tiết đơn hàng...</p>;
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

  const handleCancelOrder = async () => {
    Swal.fire({
      title: "Xác nhận hủy đơn hàng?",
      text: "Sau khi hủy, bạn sẽ không thể khôi phục lại đơn này.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Hủy đơn hàng",
      cancelButtonText: "Thoát",
    }).then(async (result) => {
      if (result.isConfirmed && id) {
        try {
          await cancelOrder(id);
          Swal.fire({
            icon: "success",
            title: "Đã hủy đơn hàng!",
            showConfirmButton: false,
            timer: 2000,
          });
          navigate("/profile");
        } catch (err) {
          console.error(err);
          Swal.fire({
            icon: "error",
            title: "Lỗi!",
            text: "Không thể hủy đơn hàng. Vui lòng thử lại.",
          });
        }
      }
    });
  };

  return (
    <>
      <HeaderSection />
      <div className="max-w-5xl p-6 mx-auto mt-6 bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">
            Chi tiết đơn hàng #{order.id}
          </h2>
          <div>{renderStatus(order.status)}</div>
        </div>

        {/* Thông tin giao hàng và thanh toán */}
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
                  alt={item.productName || "Sản phẩm"}
                  className="object-cover w-16 h-16 rounded-md"
                />
                <div>
                  <p className="font-medium">
                    {item.productName || item.productId}
                  </p>
                  <p className="text-sm text-gray-500">
                    SL: {item.quantity} × {item.unitPrice.toLocaleString()}₫
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <p className="font-semibold text-gray-800">
                  {item.subtotal.toLocaleString()}₫
                </p>

                {/* Nút đánh giá từng sản phẩm nếu đã giao */}
                {order.status === "CONFIRMED" && (
                  <button
                    onClick={() =>
                      navigate(`/reviews/${item.productId}`, {
                        state: { orderId: order.id, orderStatus: order.status },
                      })
                    }
                    className="px-4 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                  >
                    Đánh giá
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-6 text-lg font-semibold">
          <span>Tổng cộng:</span>
          <span className="text-primary">
            {order.totalAmount.toLocaleString()}₫
          </span>
        </div>

        {/* Nút hành động chung */}
        <div className="flex justify-end gap-2 mt-8">
          {order.status === "PENDING" && (
            <button
              onClick={handleCancelOrder}
              className="px-5 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              Hủy đơn hàng
            </button>
          )}

          {["SHIPPED", "DELIVERED"].includes(order.status) && (
            <button
              onClick={() =>
                Swal.fire(
                  "Không thể hủy!",
                  "Đơn hàng đã được giao/đang giao nên không thể hủy.",
                  "warning"
                )
              }
              className="px-5 py-2 text-white bg-gray-400 rounded-lg cursor-not-allowed"
            >
              Không thể hủy
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderDetailPage;
