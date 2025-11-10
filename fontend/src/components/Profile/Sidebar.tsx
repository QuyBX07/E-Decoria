import React from "react";
import { User as UserIcon, Package, History, Lock, LogOut } from "lucide-react";
import SidebarItem from "./SidebarItem";
import { User } from "@/types/User";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User | null;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, user }) => (
  <aside className="p-6 bg-white shadow-md w-72">
    <div className="pb-4 text-center border-b">
      <img
        src={user?.avatar || "https://i.pravatar.cc/100"}
        alt="Avatar"
        className="w-24 h-24 mx-auto border-4 rounded-full border-primary/30"
      />
      <h2 className="mt-3 text-xl font-semibold">
        {user?.fullName || "Người dùng"}
      </h2>
      <p className="text-sm text-gray-500">{user?.email}</p>
    </div>

    <nav className="mt-6 space-y-2">
      <SidebarItem
        icon={<UserIcon size={18} />}
        label="Thông tin cá nhân"
        active={activeTab === "info"}
        onClick={() => setActiveTab("info")}
      />
      <SidebarItem
        icon={<Package size={18} />}
        label="Đơn hàng của tôi"
        active={activeTab === "orders"}
        onClick={() => setActiveTab("orders")}
      />
      <SidebarItem
        icon={<History size={18} />}
        label="Lịch sử mua hàng"
        active={activeTab === "history"}
        onClick={() => setActiveTab("history")}
      />
      <SidebarItem
        icon={<Lock size={18} />}
        label="Đổi mật khẩu"
        active={activeTab === "password"}
        onClick={() => setActiveTab("password")}
      />
      <SidebarItem
        icon={<LogOut size={18} />}
        label="Đăng xuất"
        onClick={() => {
          localStorage.clear();
          window.location.href = "/login";
        }}
      />
    </nav>
  </aside>
);

export default Sidebar;
