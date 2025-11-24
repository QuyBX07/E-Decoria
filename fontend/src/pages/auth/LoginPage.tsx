import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { GooglePayload } from "../../types/GooglePayload";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8081/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "Sai email hoặc mật khẩu!",
          showConfirmButton: false,
          timer: 2000,
        });
        return;
      }

      const data = await res.json();
      const user = data.user;

      // ✅ Lưu đúng cách
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(user)); // Lưu cả object
      localStorage.setItem("role", user.role); // Dễ check phân quyền
      localStorage.setItem("avatar", user.avatar || ""); // Dễ render ảnh

      Swal.fire({
        icon: "success",
        title: "Đăng nhập thành công!",
        showConfirmButton: false,
        timer: 1500,
      });

      // ✅ Điều hướng theo role
      setTimeout(() => {
        if (user.role === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 1500);
    } catch (err) {
      console.error("Login error:", err);
      Swal.fire({
        icon: "warning",
        title: "Không thể kết nối đến máy chủ!",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-primary/10 via-white to-secondary/10">
      <div className="grid w-full max-w-6xl mx-auto overflow-hidden bg-white shadow-xl rounded-3xl md:grid-cols-2">
        <div className="relative hidden md:block">
          <img
            src="https://noithatvantin.vn/wp-content/uploads/2023/07/1-6.png"
            alt="Decor inspiration"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center text-white">
            <h2 className="text-4xl font-semibold">Chào mừng trở lại!</h2>
            <p className="mt-2 text-lg opacity-90">
              Đăng nhập để tiếp tục mua sắm và khám phá không gian nội thất yêu
              thích của bạn.
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center p-10 md:p-16">
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Đăng nhập
          </h2>
          <p className="mt-2 text-center text-gray-500">
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="font-medium text-primary hover:underline"
            >
              Đăng ký ngay
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="block mb-1 text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:outline-none"
                placeholder="Nhập email..."
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-700">Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-4 font-semibold text-white transition-all duration-200 rounded-xl bg-primary hover:bg-primary/90"
            >
              Đăng nhập
            </button>
            <div className="flex justify-center mt-6">
              <GoogleLogin
                onSuccess={(credentialResponse: CredentialResponse) => {
                  const credential = credentialResponse.credential;
                  if (!credential) return;

                  const decoded = jwtDecode<GooglePayload>(credential);
                  console.log("Google user info:", decoded);

                  fetch("http://localhost:8081/api/auth/google", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token: credential }),
                  })
                    .then((res) => {
                      if (!res.ok) throw new Error("Đăng nhập Google thất bại");
                      return res.json();
                    })
                    .then((data) => {
                      localStorage.setItem("token", data.token);
                      localStorage.setItem("user", JSON.stringify(data.user));

                      Swal.fire({
                        icon: "success",
                        title: "Đăng nhập bằng Google thành công!",
                        showConfirmButton: false,
                        timer: 1500,
                      });
                      setTimeout(() => navigate("/"), 1500);
                    })
                    .catch((err) => {
                      console.error("Google login error:", err);
                      Swal.fire({
                        icon: "error",
                        title: "Không thể đăng nhập bằng Google!",
                        showConfirmButton: false,
                        timer: 2000,
                      });
                    });
                }}
                onError={() => {
                  Swal.fire({
                    icon: "error",
                    title: "Đăng nhập Google thất bại!",
                    showConfirmButton: false,
                    timer: 2000,
                  });
                }}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
