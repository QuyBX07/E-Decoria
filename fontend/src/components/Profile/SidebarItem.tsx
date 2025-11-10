import React from "react";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  active,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-left rounded-xl transition-colors ${
      active
        ? "bg-primary text-white"
        : "text-gray-700 hover:bg-gray-100 hover:text-primary"
    }`}
  >
    <span className="mr-3">{icon}</span>
    {label}
  </button>
);

export default SidebarItem;
