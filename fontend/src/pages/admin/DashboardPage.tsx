import React from "react";
import RevenueChart from "../../components/Dashboard/RevenueChart";
import ProfitSummaryChart from "../../components/Dashboard/ProfitSummaryChart";
import ProfitChart from "../../components/Dashboard/ProfitChart";
import BestSellingList from "@/components/Dashboard/BestSellingChart";

const DashboardPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-gray-600">
          Chào mừng bạn quay lại! Đây là tổng quan hệ thống quản trị.
        </p>
      </header>

      {/* Top row: ProfitSummary + BestSelling */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <section className="flex flex-col p-4 bg-white shadow rounded-xl">
          <h2 className="mb-4 text-xl font-semibold">Biểu đồ lợi nhuận</h2>
          <div className="flex-1 min-h-[300px]">
            <ProfitSummaryChart />
          </div>
        </section>

        <section className="flex flex-col p-4 bg-white shadow rounded-xl">
          <h2 className="mb-4 text-xl font-semibold">Sản phẩm bán chạy</h2>
          <div className="flex-1 min-h-[300px]">
            <BestSellingList />
          </div>
        </section>
      </div>

      {/* Full width: Revenue */}
      <section className="flex flex-col p-4 bg-white shadow rounded-xl">
        <h2 className="mb-4 text-xl font-semibold">Doanh thu tổng quan</h2>
        <div className="flex-1 min-h-[300px]">
          <RevenueChart />
        </div>
      </section>

      {/* Full width: Profit per month */}
      <section className="flex flex-col p-4 bg-white shadow rounded-xl">
        <h2 className="mb-4 text-xl font-semibold">Lợi nhuận theo tháng</h2>
        <div className="flex-1 min-h-[300px]">
          <ProfitChart />
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
