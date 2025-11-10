import React from "react";

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm">
      <h1 className="text-lg font-semibold text-gray-700">Bảng điều khiển</h1>
      <div className="flex items-center gap-3">
        <img
          src="/images/admin-avatar.png"
          alt="avatar"
          className="border rounded-full w-9 h-9"
        />
        <span className="text-sm text-gray-600">Admin</span>
      </div>
    </header>
  );
};

export default Header;
