import React, { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const RegisterPage: React.FC = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8081/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        Swal.fire({
          title: "🎉 Đăng ký thành công!",
          text: "Bạn có thể đăng nhập ngay bây giờ.",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#3085d6",
        });
        setForm({
          fullName: "",
          email: "",
          password: "",
          phone: "",
          address: "",
        });
      } else {
        const err = await res.text();
        Swal.fire({
          title: "❌ Lỗi đăng ký",
          text: err || "Có lỗi xảy ra khi đăng ký!",
          icon: "error",
          confirmButtonText: "Thử lại",
        });
      }
    } catch (error) {
      console.error("Register error:", error);
      Swal.fire({
        title: "⚠️ Lỗi kết nối",
        text: "Không thể kết nối đến máy chủ.",
        icon: "warning",
        confirmButtonText: "Đóng",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-primary/10 via-white to-secondary/10">
      <div className="grid w-full max-w-6xl mx-auto overflow-hidden bg-white shadow-xl rounded-3xl md:grid-cols-2">
        {/* Left Side Image */}
        <div className="relative hidden md:block">
          <img
            src="https://noithatvantin.vn/wp-content/uploads/2023/07/1-6.png"
            alt="Modern furniture"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center text-white">
            <h2 className="text-4xl font-semibold">Tạo tài khoản mới</h2>
            <p className="mt-2 text-lg opacity-90">
              Tham gia cộng đồng nội thất và nhận ưu đãi hấp dẫn mỗi tuần.
            </p>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="flex flex-col justify-center p-10 md:p-16">
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Đăng ký
          </h2>
          <p className="mt-2 text-center text-gray-500">
            Đã có tài khoản?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:underline"
            >
              Đăng nhập ngay
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="block mb-1 text-gray-700">Họ và tên</label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:outline-none"
                placeholder="Nguyễn Văn A"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:outline-none"
                placeholder="abc@gmail.com"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-700">Mật khẩu</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-700">Số điện thoại</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:outline-none"
                placeholder="0988888888"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-700">Địa chỉ</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:outline-none"
                placeholder="Hà Nội"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-4 font-semibold text-white transition-all duration-200 rounded-xl bg-primary hover:bg-primary/90"
            >
              Đăng ký
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
