import React, { useEffect, useState } from "react";
import {
  getAllNotifications,
  createNotification,
  sendNotificationToAllUsers,
  sendNotificationToUsers,
} from "@/services/AdminNotificationService";
import { getAllUsers } from "@/services/UserService";
import {
  AdminNotificationResponse,
  CreateNotificationRequest,
  SendNotificationToUsersRequest,
} from "@/types/Notification";
import { User } from "@/types/User";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";

const ManageNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<
    AdminNotificationResponse[]
  >([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedNotificationId, setSelectedNotificationId] = useState<
    string | null
  >(null);

  const [form, setForm] = useState<CreateNotificationRequest>({
    title: "",
    message: "",
    type: "SYSTEM",
  });

  const [loading, setLoading] = useState(false);

  // 🔍 search notification
  const [search, setSearch] = useState("");

  // 🔍 search user trong modal
  const [userSearch, setUserSearch] = useState("");

  const [openUserModal, setOpenUserModal] = useState(false);

  useEffect(() => {
    fetchNotifications();
    fetchUsers();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getAllNotifications();
      setNotifications(data);
    } catch {
      Swal.fire("Lỗi", "Không thể tải danh sách thông báo", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch {
      Swal.fire("Lỗi", "Không thể tải danh sách người dùng", "error");
    }
  };

  // ✅ Tạo notification
  const handleCreate = async () => {
    if (!form.title || !form.message) {
      Swal.fire("Thiếu dữ liệu", "Vui lòng nhập đầy đủ thông tin", "warning");
      return;
    }

    try {
      await createNotification(form);
      Swal.fire("Thành công", "Đã tạo thông báo", "success");
      setForm({ title: "", message: "", type: "SYSTEM" });
      fetchNotifications();
    } catch {
      Swal.fire("Lỗi", "Không thể tạo thông báo", "error");
    }
  };

  // ✅ Gửi toàn bộ
  const handleSendAll = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Gửi thông báo?",
      text: "Thông báo sẽ được gửi cho toàn bộ người dùng",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Gửi",
      cancelButtonText: "Hủy",
    });

    if (!confirm.isConfirmed) return;

    try {
      await sendNotificationToAllUsers(id);
      Swal.fire("Thành công", "Đã gửi thông báo", "success");
      fetchNotifications();
    } catch {
      Swal.fire("Lỗi", "Gửi thông báo thất bại", "error");
    }
  };

  // ✅ Gửi user được chọn
  const handleSendSelectedUsers = async () => {
    if (!selectedNotificationId || selectedUsers.length === 0) {
      Swal.fire("Thiếu dữ liệu", "Chưa chọn người dùng", "warning");
      return;
    }

    const payload: SendNotificationToUsersRequest = {
      userIds: selectedUsers,
    };

    try {
      await sendNotificationToUsers(selectedNotificationId, payload);
      Swal.fire("Thành công", "Đã gửi thông báo", "success");
      setOpenUserModal(false);
      setSelectedUsers([]);
      setSelectedNotificationId(null);
      setUserSearch("");
      fetchNotifications();
    } catch {
      Swal.fire("Lỗi", "Gửi thông báo thất bại", "error");
    }
  };

  // 🔍 filter notification
  const filteredNotifications = notifications.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase())
  );

  // 🔍 filter user trong modal
  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-gray-50 to-gray-100">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">
        🔔 Quản lý thông báo
      </h1>

      {/* Form tạo */}
      <div className="p-6 mb-10 bg-white shadow-xl rounded-2xl">
        <h2 className="mb-4 text-lg font-semibold">➕ Tạo thông báo mới</h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <input
            placeholder="Tiêu đề"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="input"
          />

          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="input"
          >
            <option value="SYSTEM">SYSTEM</option>
            <option value="ORDER">ORDER</option>
            <option value="PAYMENT">PAYMENT</option>
            <option value="VOUCHER">VOUCHER</option>
          </select>

          <textarea
            rows={3}
            placeholder="Nội dung"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="input md:col-span-2"
          />
        </div>

        <Button onClick={handleCreate} className="mt-4">
          Tạo thông báo
        </Button>
      </div>

      {/* 🔍 Search notification */}
      <div className="mb-4 w-72">
        <input
          placeholder="Tìm theo tiêu đề..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Danh sách */}
      <div className="overflow-x-auto bg-white shadow-xl rounded-2xl">
        <table className="w-full">
          <thead className="bg-blue-100">
            <tr>
              <th className="p-3 text-left">Tiêu đề</th>
              <th className="p-3">Loại</th>
              <th className="p-3">Ngày tạo</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredNotifications.map((n) => (
              <tr key={n.id} className="border-t">
                <td className="p-3 font-medium">{n.title}</td>
                <td className="p-3">{n.type}</td>
                <td className="p-3">
                  {new Date(n.createdAt).toLocaleString()}
                </td>
                <td className="p-3 text-center">
                  {n.sent ? "Đã gửi" : "Chưa gửi"}
                </td>
                <td className="p-3 space-x-2 text-center">
                  {!n.sent && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => handleSendAll(n.id)}
                      >
                        Gửi toàn bộ
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedNotificationId(n.id);
                          setOpenUserModal(true);
                        }}
                      >
                        Gửi người dùng
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}

            {!loading && filteredNotifications.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  Không có thông báo
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal chọn user */}
      {openUserModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="w-[600px] bg-white p-6 rounded-xl shadow-xl">
            <h3 className="mb-4 text-lg font-semibold">👤 Chọn người dùng</h3>

            <input
              placeholder="Tìm user..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="w-full px-3 py-2 mb-3 border rounded-lg"
            />

            <div className="h-64 overflow-y-auto border rounded-lg">
              {filteredUsers.map((u) => (
                <label
                  key={u.id}
                  className="flex items-center gap-3 p-3 border-b cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(u.id)}
                    onChange={(e) => {
                      setSelectedUsers((prev) =>
                        e.target.checked
                          ? [...prev, u.id]
                          : prev.filter((id) => id !== u.id)
                      );
                    }}
                  />
                  <span>
                    {u.fullName} ({u.email})
                  </span>
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => setOpenUserModal(false)}>
                Hủy
              </Button>
              <Button onClick={handleSendSelectedUsers}>Gửi đã chọn</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageNotifications;
