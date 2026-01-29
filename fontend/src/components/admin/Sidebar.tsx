import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  Package,
  Users,
  ShoppingCart,
  Box,
  Layers,
  Truck,
  TicketPercent,
  Bell,
  LogOut,
} from "lucide-react";

const Sidebar: React.FC = () => {
  const { pathname } = useLocation();

  const menu = [
    { name: "Thống kê", path: "/admin", icon: <BarChart3 size={20} /> },
    {
      name: "Thể loại",
      path: "/admin/categories",
      icon: <Layers size={20} />,
    },
    {
      name: "Sản phẩm",
      path: "/admin/products",
      icon: <Package size={20} />,
    },
    {
      name: "Đơn hàng",
      path: "/admin/orders",
      icon: <ShoppingCart size={20} />,
    },
    {
      name: "Model 3D",
      path: "/admin/model",
      icon: <Box size={20} />,
    },
    {
      name: "Người dùng",
      path: "/admin/users",
      icon: <Users size={20} />,
    },
    {
      name: "Nhập hàng",
      path: "/admin/imports",
      icon: <Truck size={20} />,
    },
    {
      name: "Voucher",
      path: "/admin/vouchers",
      icon: <TicketPercent size={20} />,
    },
    {
      name: "Thông báo",
      path: "/admin/notifications",
      icon: <Bell size={20} />,
    },
    {
      name: "Đăng xuất",
      onClick: () => {
        localStorage.removeItem("token"); // hoặc clear auth
        window.location.href = "/login";
      },
      icon: <LogOut size={20} />,
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-white border-r shadow-md">
      <div className="p-6 text-xl font-bold border-b text-primary">
        Admin Panel
      </div>
      <nav className="p-4 space-y-2">
        {menu.map((item, index) => {
          const isActive = item.path && pathname === item.path;

          // 🔴 Trường hợp Đăng xuất (không có path)
          if (item.onClick) {
            return (
              <button
                key={index}
                onClick={item.onClick}
                className="flex items-center w-full gap-3 px-4 py-2 text-gray-700 transition rounded-lg hover:bg-red-50 hover:text-red-600"
              >
                {item.icon}
                {item.name}
              </button>
            );
          }

          // 🟢 Trường hợp menu bình thường
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                isActive
                  ? "bg-primary text-white"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
