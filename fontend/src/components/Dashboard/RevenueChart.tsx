import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { RevenuePoint } from "../../types/RevenuePoint";
import {
  getRevenueByMonths,
  getRevenueByWeeks,
  getLast7DaysRevenue,
} from "@services/revenueService";

type FilterType = "MONTHS" | "WEEKS" | "LAST_7_DAYS";

// format tiền VND: 1.234.567
const formatVND = (value: number) => value.toLocaleString("vi-VN");

export default function RevenueChart() {
  const [filter, setFilter] = useState<FilterType>("MONTHS");
  const [data, setData] = useState<RevenuePoint[]>([]);

  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;

  const loadData = async () => {
    try {
      if (filter === "MONTHS") {
        setData(await getRevenueByMonths(year));
      } else if (filter === "WEEKS") {
        setData(await getRevenueByWeeks(month, year));
      } else {
        setData(await getLast7DaysRevenue());
      }
    } catch (e) {
      console.error("Revenue chart error: ", e);
    }
  };

  useEffect(() => {
    loadData();
  }, [filter]);

  return (
    <div className="w-full p-6 bg-white shadow rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Revenue Chart</h2>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterType)}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="MONTHS">By Months</option>
          <option value="WEEKS">By Weeks</option>
          <option value="LAST_7_DAYS">Last 7 Days</option>
        </select>
      </div>

      <div className="w-full h-80">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="label" />

            {/* TRỤC Y: có chấm, đủ rộng */}
            <YAxis
              domain={[0, "dataMax"]}
              tickFormatter={formatVND}
              allowDecimals={false}
              width={100}
            />

            {/* TOOLTIP: hiển thị đầy đủ tiền */}
            <Tooltip
              formatter={(value: number) => [
                `${formatVND(value)} ₫`,
                "Doanh thu",
              ]}
            />

            <Line
              type="monotone"
              dataKey="value"
              stroke="#4f46e5"
              strokeWidth={3}
              dot
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
