import React from "react";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { Outlet } from "react-router-dom"; // dùng nếu cậu dùng React Router

const AdminLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar bên trái */}
      <Sidebar />

      {/* Nội dung bên phải */}
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet /> {/* Hiển thị trang con tương ứng */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
