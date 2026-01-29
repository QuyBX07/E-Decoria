import React, { useState, useEffect } from "react";
import { ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { getProfile } from "@/services/ProfileService";
import NotificationBell from "@/components/notifications/NotificationBell";

const navLinks = [
  { label: "Trang chủ", path: "/" },
  { label: "Sản phẩm", path: "/products" },
  { label: "Về chúng tôi", path: "/about" },
  { label: "Liên hệ", path: "/contact" },
  { label: "Voucher", path: "/vouchers" },
];

const HeaderSection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [avatar, setAvatar] = useState<string>("/images/avatar.jpg");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const decoded: { exp: number } = jwtDecode(token);

      if (decoded.exp * 1000 < Date.now()) {
        localStorage.clear();
        setIsLoggedIn(false);
        return;
      }

      setIsLoggedIn(true);

      // ⬅️ Gọi API để lấy avatar thật của user
      getProfile()
        .then((user) => {
          if (user.avatar) {
            // Nếu avatar backend trả về đã có link đầy đủ
            setAvatar(user.avatar);
          } else {
            setAvatar("/images/avatar.jpg");
          }
        })
        .catch(() => {
          setAvatar("/images/avatar.jpg");
        });
    } catch {
      localStorage.clear();
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "Bạn có chắc muốn đăng xuất?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Đăng xuất",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        Swal.fire({
          icon: "success",
          title: "Đã đăng xuất",
          showConfirmButton: false,
          timer: 1500,
        });
        setIsLoggedIn(false);
        setAvatar("/images/avatar.jpg");
        navigate("/login");
      }
    });
  };

  return (
    <header className="sticky top-0 z-50 shadow-sm border-b border-primary/10 bg-[#FFF8F0]/80 backdrop-blur-xl">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link
            to="/"
            className="font-serif text-2xl font-bold tracking-tight transition-colors text-primary-dark hover:text-primary"
          >
            Décoria<span className="text-primary-light">.</span>
          </Link>

          <nav className="items-center hidden gap-8 md:flex">
            {navLinks.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                className="relative font-medium text-gray-700 hover:text-primary-dark transition-colors duration-200 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-primary after:transition-all hover:after:w-full"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {/* 🔔 Notification Bell */}
            {isLoggedIn && <NotificationBell />}

            {/* 🛒 Cart */}
            <Button
              variant="ghost"
              className="relative p-2 transition rounded-full hover:bg-primary/10"
              onClick={() => {
                if (!isLoggedIn) {
                  Swal.fire({
                    icon: "warning",
                    title: "Bạn cần đăng nhập",
                    text: "Vui lòng đăng nhập để sử dụng giỏ hàng.",
                    confirmButtonText: "Đăng nhập",
                  }).then((result) => {
                    if (result.isConfirmed) navigate("/login");
                  });
                } else {
                  navigate("/cart");
                }
              }}
            >
              <ShoppingCart className="w-5 h-5 text-primary-dark" />
            </Button>

            {/* 👤 Avatar / Login */}
            {isLoggedIn ? (
              <button
                onClick={() => navigate("/profile")}
                className="transition rounded-full hover:ring-2 hover:ring-primary/40 focus:outline-none"
              >
                <img
                  src={avatar}
                  alt="Avatar"
                  className="object-cover rounded-full w-9 h-9 ring-2 ring-primary/30"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "/images/avatar.jpg";
                  }}
                />
              </button>
            ) : (
              <Button
                variant="outline"
                onClick={() => navigate("/login")}
                className="px-4 py-2 font-medium text-primary border-primary hover:bg-primary hover:text-white rounded-xl"
              >
                Đăng nhập
              </Button>
            )}

            {/* ☰ Mobile menu */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 transition rounded-lg md:hidden hover:bg-primary/10"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-primary-dark" />
              ) : (
                <Menu className="w-6 h-6 text-primary-dark" />
              )}
            </button>
          </div>
        </div>

        {isOpen && (
          <nav className="pb-4 mt-2 space-y-2 md:hidden animate-fadeIn">
            {navLinks.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsOpen(false)}
                className="block py-2 font-medium text-gray-700 transition-colors hover:text-primary-dark"
              >
                {label}
              </Link>
            ))}

            {isLoggedIn ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="block py-2 font-medium text-gray-700 hover:text-primary-dark"
                >
                  Hồ sơ cá nhân
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="block w-full py-2 font-medium text-left text-gray-700 hover:text-primary-dark"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate("/login");
                }}
                className="block w-full py-2 font-medium text-left text-gray-700 hover:text-primary-dark"
              >
                Đăng nhập
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default HeaderSection;
