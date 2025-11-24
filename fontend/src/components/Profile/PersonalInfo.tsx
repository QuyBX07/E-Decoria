import React, { useState } from "react";
import { updateProfile } from "@/services/ProfileService";
import { User } from "@/types/User";
import Swal from "sweetalert2";
import MapPickerModal from "@components/MapPickerModal"; // ➕ thêm modal bản đồ

interface PersonalInfoProps {
  user: User;
  setUser: (u: User) => void;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ user, setUser }) => {
  const [form, setForm] = useState({
    fullName: user.fullName,
    email: user.email,
    address: user.address || "",
    phone: user.phone || "",
  });

  const [loading, setLoading] = useState(false);
  const [openMap, setOpenMap] = useState(false); // ➕ trạng thái mở modal bản đồ

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    Swal.fire({
      title: "Đang cập nhật...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const updated = await updateProfile(form);
      setUser(updated);

      Swal.fire({
        icon: "success",
        title: "Thành công!",
        text: "Cập nhật thông tin cá nhân thành công!",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Không thể cập nhật thông tin. Vui lòng thử lại.",
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">Thông tin cá nhân</h2>

      <form
        onSubmit={handleSubmit}
        className="grid max-w-2xl grid-cols-2 gap-6"
      >
        {/* Full name */}
        <div>
          <label className="block mb-1 text-gray-700">Họ và tên</label>
          <input
            name="fullName"
            type="text"
            value={form.fullName}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:ring-primary focus:outline-none"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 text-gray-700">Email</label>
          <input
            name="email"
            type="email"
            disabled
            value={form.email}
            className="w-full px-4 py-3 bg-gray-100 border rounded-lg"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-1 text-gray-700">Số điện thoại</label>
          <input
            name="phone"
            type="text"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:ring-primary focus:outline-none"
          />
        </div>

        {/* Address with map (giống shipping form) */}
        <div>
          <label className="block mb-1 text-gray-700">Địa chỉ</label>

          <input
            name="address"
            type="text"
            readOnly
            value={form.address}
            onClick={() => setOpenMap(true)}
            className="w-full px-4 py-3 bg-white border rounded-lg cursor-pointer focus:ring-primary focus:outline-none"
            placeholder="Nhấn để chọn trên bản đồ"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`col-span-2 px-6 py-3 text-white rounded-lg ${
            loading ? "bg-gray-400" : "bg-primary hover:bg-primary/90"
          }`}
        >
          {loading ? "Đang cập nhật..." : "Cập nhật"}
        </button>
      </form>

      {/* Modal bản đồ */}
      <MapPickerModal
        open={openMap}
        onClose={() => setOpenMap(false)}
        onSelect={(address) => setForm((prev) => ({ ...prev, address }))}
      />
    </div>
  );
};

export default PersonalInfo;
