import { useEffect, useState } from "react";
import { ProfitSummary } from "../../types/Profit";
import profitService from "../../services/profitService";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

type FilterType = "YEAR" | "MONTH" | "QUARTER";

export default function ProfitSummaryChart() {
  const [filter, setFilter] = useState<FilterType>("YEAR");

  // inputs
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [quarter, setQuarter] = useState(1);

  const [data, setData] = useState<ProfitSummary | null>(null);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      let res;

      if (filter === "YEAR") {
        res = await profitService.getYearly(year);
      } else if (filter === "MONTH") {
        res = await profitService.getMonthly(year, month);
      } else {
        res = await profitService.getQuarter(year, quarter);
      }

      setData(res);
    } catch (e) {
      console.error("Profit chart error:", e);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filter, year, month, quarter]);

  const chartData = data
    ? [
        { name: "Revenue", value: data.revenue },
        { name: "Import Cost", value: data.importCost },
        { name: "Profit", value: data.profit },
      ]
    : [];

  return (
    <div className="w-full p-6 bg-white shadow rounded-xl">
      {/* HEADER + FILTER */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Profit Summary</h2>

        <div className="flex items-center gap-3">
          {/* Type filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterType)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="YEAR">Theo năm</option>
            <option value="MONTH">Theo tháng</option>
            <option value="QUARTER">Theo quý</option>
          </select>

          {/* Month input */}
          {filter === "MONTH" && (
            <input
              type="number"
              min={1}
              max={12}
              className="w-20 px-3 py-2 border rounded-lg"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            />
          )}

          {/* Quarter input */}
          {filter === "QUARTER" && (
            <input
              type="number"
              min={1}
              max={4}
              className="w-20 px-3 py-2 border rounded-lg"
              value={quarter}
              onChange={(e) => setQuarter(Number(e.target.value))}
            />
          )}

          {/* Year input */}
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-24 px-3 py-2 border rounded-lg"
          />
        </div>
      </div>

      {/* CHART */}
      <div className="w-full h-80">
        {loading ? (
          <p>Loading...</p>
        ) : data ? (
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(v: number) => v.toLocaleString("vi-VN")}
                contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb" }}
              />

              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => {
                  const colors = ["#3b82f6", "#10b981", "#f59e0b"];
                  return <Cell key={index} fill={colors[index]} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>No data</p>
        )}
      </div>
    </div>
  );
}
