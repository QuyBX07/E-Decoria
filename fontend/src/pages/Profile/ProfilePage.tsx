import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Profile/Sidebar";
import PersonalInfo from "@/components/Profile/PersonalInfo";
import Orders from "@/components/Profile/Orders";
import PurchaseHistory from "@/components/Profile/PurchaseHistory";
import ChangePassword from "@/components/Profile/ChangePassword";
import { getProfile } from "@/services/ProfileService";
import { User } from "@/types/User";
import HeaderSection from "@/components/HeaderSection"; // ✅ import header có sẵn

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("info");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getProfile();
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  const renderContent = () => {
    if (!user) return <p>Đang tải...</p>;
    switch (activeTab) {
      case "info":
        return <PersonalInfo user={user} setUser={setUser} />;
      case "orders":
        return <Orders />;
      case "history":
        return <PurchaseHistory />;
      case "password":
        return <ChangePassword />;
      default:
        return <PersonalInfo user={user} setUser={setUser} />;
    }
  };

  return (
    <>
      {/* ✅ Header nằm trên cùng */}
      <HeaderSection />

      {/* Nội dung trang hồ sơ */}
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar
          user={user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <main className="flex-1 p-10">{renderContent()}</main>
      </div>
    </>
  );
};

export default ProfilePage;
