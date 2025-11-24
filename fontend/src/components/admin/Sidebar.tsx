import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart3, Package, Users, ShoppingCart, Box } from "lucide-react";


const Sidebar: React.FC = () => {
  const { pathname } = useLocation();

  const menu = [
    { name: "Thống kê", path: "/admin", icon: <BarChart3 size={20} /> },
    {
      name: "Thể loại",
      path: "/admin/categories",
      icon: <BarChart3 size={20} />,
    },
    { name: "Sản phẩm", path: "/admin/products", icon: <Package size={20} /> },
    {
      name: "Đơn hàng",
      path: "/admin/orders",
      icon: <ShoppingCart size={20} />,
    },
    { name: "Model3D", path: "/admin/model", icon: <Box size={20} /> },
    { name: "Người dùng", path: "/admin/users", icon: <Users size={20} /> },
    { name: "Nhập Hàng", path: "/admin/imports", icon: <Users size={20} /> },
  ];

  return (
    <aside className="w-64 min-h-screen bg-white border-r shadow-md">
      <div className="p-6 text-xl font-bold border-b text-primary">
        Admin Panel
      </div>
      <nav className="p-4 space-y-2">
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
              pathname === item.path
                ? "bg-primary text-white"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
