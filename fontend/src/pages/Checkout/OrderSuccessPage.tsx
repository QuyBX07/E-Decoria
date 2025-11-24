import React from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { OrderResponseDTO } from "@/types/Order";
import { CheckCircle } from "lucide-react";

const OrderSuccessPage: React.FC = () => {
  const { id } = useParams();
  const loc = useLocation();
  const state = loc.state as { order?: OrderResponseDTO } | undefined;
  const order = state?.order;

  return (
    <div className="flex flex-col items-center min-h-screen py-12 bg-gray-50">
      {/* Header */}
      <div className="flex flex-col items-center text-center">
        <CheckCircle className="w-16 h-16 text-green-500" />
        <h1 className="mt-4 text-3xl font-bold text-gray-800">
          Đặt hàng thành công!
        </h1>
        <p className="mt-2 text-gray-600">
          Cảm ơn bạn đã tin tưởng và mua sắm tại{" "}
          <span className="font-semibold text-primary">Decoria</span>.
        </p>
      </div>

      {/* Thông tin đơn hàng */}
      <div className="w-full max-w-3xl p-6 mt-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-3 text-xl font-semibold text-gray-800">
          Thông tin đơn hàng
        </h2>

        {order ? (
          <>
            <div className="grid grid-cols-1 gap-2 text-gray-700 sm:grid-cols-2">
              <p>
                <span className="font-medium">Mã đơn hàng:</span>{" "}
                <span className="font-mono text-sm text-gray-800">
                  {order.id}
                </span>
              </p>
              <p>
                <span className="font-medium">Ngày tạo:</span>{" "}
                {new Date(order.createdAt).toLocaleString("vi-VN")}
              </p>
              <p>
                <span className="font-medium">Trạng thái:</span>{" "}
                <span
                  className={`font-semibold ${
                    order.status === "PENDING"
                      ? "text-yellow-500"
                      : order.status === "CONFIRMED"
                      ? "text-blue-600"
                      : order.status === "DELIVERED"
                      ? "text-green-600"
                      : "text-gray-600"
                  }`}
                >
                  {order.status}
                </span>
              </p>
              <p>
                <span className="font-medium">Phương thức:</span>{" "}
                {order.paymentMethod}
              </p>
              <p className="sm:col-span-2">
                <span className="font-medium">Địa chỉ giao hàng:</span>{" "}
                {order.shippingAddress}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t">
              <h3 className="mb-2 text-lg font-semibold text-gray-800">
                Sản phẩm trong đơn
              </h3>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="object-cover w-16 h-16 rounded-md"
                      />
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          SL: {item.quantity} ×{" "}
                          {item.unitPrice.toLocaleString()}₫
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-800">
                      {item.subtotal.toLocaleString()}₫
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-6 text-lg font-semibold">
                <p>Tổng thanh toán:</p>
                <p className="text-primary">
                  {order.totalAmount.toLocaleString()}₫
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="mt-4 text-gray-600">
            <p>
              Mã đơn hàng:{" "}
              <span className="font-mono font-semibold text-gray-800">
                {id}
              </span>
            </p>
            <p className="mt-2">
              Nếu bạn cần xem chi tiết, vui lòng truy cập{" "}
              <Link to="/profile" className="underline text-primary">
                Hồ sơ → Đơn hàng
              </Link>
              .
            </p>
          </div>
        )}
      </div>

      {/* Nút điều hướng */}
      <div className="flex gap-4 mt-8">
        <Link
          to="/"
          className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Quay về trang chủ
        </Link>
        <Link
          to={`/order/${id}`}
          className="px-6 py-2 text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200"
        >
          Xem đơn hàng của tôi
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
