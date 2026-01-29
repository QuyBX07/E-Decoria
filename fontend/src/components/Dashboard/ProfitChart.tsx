import { useEffect, useState } from "react";
import { ProfitPoint } from "../../types/Profit";
import profitService from "../../services/profitService";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

/**
 * Mock data cho năm 2025
 */
const mock2024Data: ProfitPoint[] = [
  {
    month: "01",
    revenue: 120_000_000,
    importCost: 70_000_000,
    profit: 50_000_000,
  },
  {
    month: "02",
    revenue: 135_000_000,
    importCost: 80_000_000,
    profit: 55_000_000,
  },
  {
    month: "03",
    revenue: 160_000_000,
    importCost: 95_000_000,
    profit: 65_000_000,
  },
  {
    month: "04",
    revenue: 180_000_000,
    importCost: 110_000_000,
    profit: 70_000_000,
  },
  {
    month: "05",
    revenue: 210_000_000,
    importCost: 130_000_000,
    profit: 80_000_000,
  },
  {
    month: "06",
    revenue: 230_000_000,
    importCost: 145_000_000,
    profit: 85_000_000,
  },
  {
    month: "07",
    revenue: 250_000_000,
    importCost: 160_000_000,
    profit: 90_000_000,
  },
  {
    month: "08",
    revenue: 240_000_000,
    importCost: 155_000_000,
    profit: 85_000_000,
  },
  {
    month: "09",
    revenue: 220_000_000,
    importCost: 140_000_000,
    profit: 80_000_000,
  },
  {
    month: "10",
    revenue: 260_000_000,
    importCost: 165_000_000,
    profit: 95_000_000,
  },
  {
    month: "11",
    revenue: 300_000_000,
    importCost: 190_000_000,
    profit: 110_000_000,
  },
  {
    month: "12",
    revenue: 350_000_000,
    importCost: 220_000_000,
    profit: 130_000_000,
  },
];

export default function ProfitChart() {
  const currentYear = new Date().getFullYear(); // 2026

  const [year, setYear] = useState<number>(currentYear);
  const [data, setData] = useState<ProfitPoint[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // 👉 Năm 2024: dùng mock data
      if (year === 2024) {
        setLoading(true);
        setTimeout(() => {
          setData(mock2024Data);
          setLoading(false);
        }, 400);
        return;
      }

      // 👉 Các năm khác: gọi API thật
      try {
        setLoading(true);
        const res = await profitService.getYearlyChart(year);
        setData(res);
      } catch (e) {
        console.error("Profit chart error:", e);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year]);

  return (
    <div className="w-full p-6 bg-white shadow rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Profit Chart ({year})</h2>

        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          disabled={loading}
          className="px-3 py-1 text-sm border rounded"
        >
          {Array.from({ length: 6 }).map((_, i) => {
            const y = currentYear - i;
            return (
              <option key={y} value={y}>
                {y}
              </option>
            );
          })}
        </select>
      </div>

      <div className="w-full h-96">
        {loading ? (
          <p>Loading...</p>
        ) : data.length === 0 ? (
          <p className="text-center text-gray-400">
            No data available for this year
          </p>
        ) : (
          <ResponsiveContainer>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(v: number) => v.toLocaleString("vi-VN")} />
              <Legend />

              <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" />
              <Bar dataKey="importCost" name="Import Cost" fill="#f59e0b" />
              <Bar dataKey="profit" name="Profit" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
