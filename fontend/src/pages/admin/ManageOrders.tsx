import React, { useEffect, useState } from "react";
import {
  getOrders,
  deleteOrder,
  updateOrderStatus,
} from "@/services/OrderAdminService";
import { OrderAdmin } from "@/types/AdminOrder";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";

const ManagerOrders: React.FC = () => {
  const [orders, setOrders] = useState<OrderAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [search, setSearch] = useState("");

  // 🔹 pagination (frontend)
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    fetchOrders();
  }, [filterStatus, sortOrder]);

  // reset page khi filter / sort thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, sortOrder]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getOrders(filterStatus, sortOrder);
      setOrders(data);
    } catch (error) {
      console.error(error);
      Swal.fire("Lỗi", "Không thể tải danh sách đơn hàng", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Xác nhận xóa?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });
    if (!confirm.isConfirmed) return;

    try {
      await deleteOrder(id);
      Swal.fire("Thành công", "Đơn hàng đã bị xóa", "success");
      fetchOrders();
    } catch (error) {
      console.error(error);
      Swal.fire("Lỗi", "Không thể xóa đơn hàng", "error");
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateOrderStatus(id, newStatus);
      Swal.fire(
        "Cập nhật thành công",
        `Trạng thái đổi thành ${newStatus}`,
        "success",
      );
      fetchOrders();
    } catch (error) {
      console.error(error);
      Swal.fire("Lỗi", "Không thể cập nhật trạng thái", "error");
    }
  };

  // 🔹 search + filter (frontend)
  const filteredOrders = orders.filter(
    (o) =>
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      o.recipientPhone.toLowerCase().includes(search.toLowerCase()),
  );

  // 🔹 pagination (frontend)
  const totalPages = Math.ceil(filteredOrders.length / pageSize);

  const pagedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4 mb-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold">📦 Quản lý đơn hàng</h2>

        <div className="flex flex-wrap gap-3">
          {/* 🔍 Search */}
          <div className="relative w-72">
            <span className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2">
              🔍
            </span>
            <input
              type="text"
              placeholder="Tìm theo tên, email, SĐT"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 pl-10 border rounded-xl focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Filter status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border rounded-xl"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="PENDING">Chờ Xác Nhận</option>
            <option value="DELIVERED">Giao Hàng</option>
            <option value="CONFIRMED">Hoàn Thành</option>
            <option value="CANCELLED">Hủy Bỏ</option>
          </select>

          {/* Sort */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            className="px-3 py-2 border rounded-xl"
          >
            <option value="desc">Mới nhất</option>
            <option value="asc">Cũ nhất</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : orders.length === 0 ? (
        <p>Không có đơn hàng nào.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Khách hàng</th>
                  {/* <th className="p-2 border">Email</th> */}
                  <th className="p-2 border">Người nhận</th>
                  {/* <th className="p-2 border">SĐT nhận</th>
                  <th className="p-2 border">Địa chỉ giao hàng</th> */}
                  <th className="p-2 border">Tổng tiền</th>
                  <th className="p-2 border">Trạng thái</th>
                  <th className="p-2 border">Thanh toán</th>
                  <th className="p-2 border">Phương thức</th>
                  <th className="p-2 border">Ngày tạo</th>
                  <th className="p-2 border">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {pagedOrders.map((order) => (
                  <tr
                    key={order.orderId}
                    className="text-center hover:bg-gray-50"
                  >
                    {/* <td className="p-2 border">
                      {order.orderId.slice(0, 8)}...
                    </td> */}
                    <td className="p-2 border">{order.customerName}</td>
                    {/* <td className="p-2 border">{order.customerEmail}</td> */}
                    <td className="p-2 border">
                      {order.recipientName || "(Trống)"}
                    </td>
                    {/* <td className="p-2 border">
                      {order.recipientPhone || "(Trống)"}
                    </td> */}
                    {/* <td
                      className="p-2 border max-w-[200px] truncate"
                      title={order.shippingAddress}
                    >
                      {order.shippingAddress}
                    </td> */}
                    <td className="p-2 border">
                      {order.totalAmount.toLocaleString()}₫
                    </td>
                    <td className="p-2 border">
                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          handleStatusChange(order.orderId, e.target.value)
                        }
                        className="p-1 border rounded"
                      >
                        <option value="PENDING">Chờ Xác nhận</option>
                        <option value="DELIVERED">Giao hàng</option>
                        <option value="CONFIRMED">Hoàn thành</option>
                        <option value="CANCELLED">Hủy Bỏ</option>
                      </select>
                    </td>
                    <td className="p-2 border">{order.paymentStatus}</td>
                    <td className="p-2 border">{order.paymentMethod}</td>
                    <td className="p-2 border">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="flex justify-center gap-2 p-2 border">
                      <Button
                        variant="outline"
                        onClick={() =>
                          Swal.fire({
                            title: "Chi tiết đơn hàng",
                            html: `
                              <div class='text-left'>
                                <p><b>Mã đơn:</b> ${order.orderId}</p>
                                <p><b>Khách hàng:</b> ${order.customerName}</p>
                                <p><b>Email:</b> ${order.customerEmail}</p>
                                <p><b>Người nhận:</b> ${
                                  order.recipientName || "(Trống)"
                                }</p>
                                <p><b>SĐT nhận:</b> ${
                                  order.recipientPhone || "(Trống)"
                                }</p>
                                <p><b>Địa chỉ:</b> ${order.shippingAddress}</p>
                                <p><b>Phương thức giao:</b> ${
                                  order.shippingMethod
                                }</p>
                                <p><b>Thanh toán:</b> ${order.paymentMethod} (${
                                  order.paymentStatus
                                })</p>
                                <p><b>Tổng tiền:</b> ${order.totalAmount.toLocaleString()}₫</p>
                                <p><b>Trạng thái:</b> ${order.orderStatus}</p>
                                <p><b>Ngày tạo:</b> ${new Date(
                                  order.createdAt,
                                ).toLocaleString()}</p>
                              </div>
                            `,
                            width: 500,
                          })
                        }
                      >
                        Xem
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(order.orderId)}
                      >
                        Xóa
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 🔹 pagination UI */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Trước
            </Button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? "default" : "outline"}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}

            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Sau
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ManagerOrders;
