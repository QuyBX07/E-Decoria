import React, { useState } from "react";
import { changePassword } from "@/services/ProfileService";
import Swal from "sweetalert2";

const ChangePassword = () => {
  const [oldPassword, setOld] = useState("");
  const [newPassword, setNew] = useState("");
  const [confirmPassword, setConfirm] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Mật khẩu xác nhận không khớp!",
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
      });
      return;
    }

    try {
      const msg = await changePassword(oldPassword, newPassword);
      Swal.fire({
        icon: "success",
        title: "Thành công!",
        text: msg || "Đổi mật khẩu thành công!",
        showConfirmButton: false,
        timer: 2000,
      });
      setOld("");
      setNew("");
      setConfirm("");
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Đổi mật khẩu thất bại!",
        text: "Vui lòng kiểm tra lại mật khẩu hiện tại hoặc thử lại sau.",
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">Đổi mật khẩu</h2>
      <form onSubmit={handleSubmit} className="max-w-md space-y-5">
        <div>
          <label className="block mb-1 text-gray-700">Mật khẩu hiện tại</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOld(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-primary focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-700">Mật khẩu mới</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNew(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-primary focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-700">
            Nhập lại mật khẩu mới
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-primary focus:outline-none"
            required
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 text-white rounded-lg bg-primary hover:bg-primary/90"
        >
          Đổi mật khẩu
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
