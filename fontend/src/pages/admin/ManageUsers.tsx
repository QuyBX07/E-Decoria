import React, { useEffect, useState } from "react";
import { User } from "@/types/User";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "@/services/UserService";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";

const PAGE_SIZE = 7;

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "CUSTOMER",
  });

  // ================= FETCH =================

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch {
      Swal.fire("Lỗi", "Không thể tải danh sách người dùng", "error");
    }
  };

  // ================= CRUD =================

  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async () => {
    // ===== VALIDATE =====
    if (!form.fullName.trim()) {
      Swal.fire("Lỗi", "Họ tên không được để trống", "warning");
      return;
    }

    if (!isValidEmail(form.email)) {
      Swal.fire("Lỗi", "Email không đúng định dạng", "warning");
      return;
    }

    // Chỉ check mật khẩu khi TẠO user
    if (!editingId && form.password.length < 6) {
      Swal.fire("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự", "warning");
      return;
    }

    try {
      if (editingId) {
        await updateUser(editingId, {
          email: form.email,
          fullName: form.fullName,
          phone: form.phone,
          address: form.address,
          role: form.role,
        });
      } else {
        await createUser(form);
      }

      Swal.fire(
        "Thành công",
        editingId ? "Đã cập nhật người dùng" : "Đã tạo người dùng mới",
        "success"
      );

      resetForm();
      fetchUsers();
    } catch {
      Swal.fire("Lỗi", "Không thể lưu người dùng", "error");
    }
  };

  const handleEdit = (u: User) => {
    setEditingId(u.id);
    setForm({
      fullName: u.fullName,
      email: u.email,
      password: "",
      phone: u.phone,
      address: u.address,
      role: u.role,
    });
  };

  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Xóa người dùng?",
      text: "Hành động này không thể hoàn tác",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (!confirm.isConfirmed) return;

    try {
      await deleteUser(id);
      fetchUsers();
      Swal.fire("Đã xóa", "", "success");
    } catch {
      Swal.fire("Lỗi", "Không thể xóa người dùng", "error");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      fullName: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      role: "CUSTOMER",
    });
  };

  // ================= SEARCH + PAGINATION =================

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);

  const paginatedUsers = filteredUsers.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // ================= UI =================

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="mb-6 text-3xl font-bold">👤 Quản lý người dùng</h1>

      {/* FORM */}
      <div className="p-6 mb-8 bg-white shadow rounded-xl">
        <h2 className="mb-4 text-lg font-semibold">
          {editingId ? "✏️ Cập nhật người dùng" : "➕ Thêm người dùng mới"}
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            className="input"
            placeholder="Họ tên"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />

          <input
            className="input"
            placeholder="Email"
            disabled={!!editingId}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          {!editingId && (
            <input
              type="password"
              className="input"
              placeholder="Mật khẩu"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          )}

          <input
            className="input"
            placeholder="Số điện thoại"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <input
            className="input"
            placeholder="Địa chỉ"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />

          <select
            className="input"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="CUSTOMER">CUSTOMER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        <Button className="mt-4" onClick={handleSubmit}>
          {editingId ? "Cập nhật" : "Tạo người dùng"}
        </Button>
      </div>

      {/* SEARCH + PAGINATION */}
      <div className="flex items-center justify-between mb-4">
        {/* Ô tìm kiếm */}
        <div className="relative w-72">
          <span className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2">
            🔍
          </span>
          <input
            type="text"
            placeholder="Tìm theo tên hoặc email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full px-4 py-2 pl-10 transition-all border rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          />
        </div>

        {/* Phân trang */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="rounded-xl"
          >
            ⬅ Trước
          </Button>

          <div className="px-4 py-2 text-sm font-medium bg-gray-100 border shadow-sm rounded-xl">
            Trang {page} / {totalPages || 1}
          </div>

          <Button
            variant="outline"
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(page + 1)}
            className="rounded-xl"
          >
            Sau ➡
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Họ tên</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">SĐT</th>
              <th className="p-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-3">{u.fullName}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3">{u.phone}</td>
                <td className="p-3 space-x-2 text-center">
                  <Button variant="outline" onClick={() => handleEdit(u)}>
                    Sửa
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(u.id)}
                  >
                    Xóa
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
