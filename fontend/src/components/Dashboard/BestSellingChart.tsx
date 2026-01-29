import React, { useEffect, useState } from "react";
import bestSellingService from "@/services/bestSellingService";
import { BestSellingProduct } from "@/types/BestSelling";

type FilterType = "year" | "month" | "quarter";

export default function BestSellingList() {
  const [type, setType] = useState<FilterType>("year");
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [quarter, setQuarter] = useState<number>(
    Math.floor(new Date().getMonth() / 3) + 1,
  );

  const [data, setData] = useState<BestSellingProduct[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);

      try {
        const params: { year: number; month?: number; quarter?: number } = {
          year,
        };

        if (type === "month") params.month = month;
        if (type === "quarter") params.quarter = quarter;

        const res = await bestSellingService.getBestSelling(params);

        if (!mounted) return;
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, [type, year, month, quarter]);

  const maxSold = data.length ? Math.max(...data.map((i) => i.totalSold)) : 1;

  return (
    <div className="p-5 bg-white shadow-md rounded-xl">
      {/* HEADER + FILTER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Best Selling Products
        </h2>

        <div className="flex items-center gap-3">
          {/* Type select */}
          <select
            value={type}
            onChange={(e) => setType(e.target.value as FilterType)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="year">Year</option>
            <option value="month">Month</option>
            <option value="quarter">Quarter</option>
          </select>

          {/* Month */}
          {type === "month" && (
            <input
              type="number"
              min={1}
              max={12}
              value={month}
              onChange={(e) =>
                setMonth(Math.max(1, Math.min(12, Number(e.target.value))))
              }
              className="w-20 px-3 py-2 border rounded-lg"
            />
          )}

          {/* Quarter */}
          {type === "quarter" && (
            <input
              type="number"
              min={1}
              max={4}
              value={quarter}
              onChange={(e) =>
                setQuarter(Math.max(1, Math.min(4, Number(e.target.value))))
              }
              className="w-20 px-3 py-2 border rounded-lg"
            />
          )}

          {/* Year */}
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-24 px-3 py-2 border rounded-lg"
          />
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="py-4 text-center text-gray-500">Loading...</div>
      )}

      {/* NO DATA */}
      {!loading && !data.length && (
        <div className="py-4 text-center text-gray-400">No data available</div>
      )}

      {/* DATA LIST */}
      {!loading && data.length > 0 && (
        <ul className="space-y-4">
          {data.slice(0, 5).map((item, idx) => (
            <li key={item.productId} className="flex flex-col">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">
                  #{idx + 1} — {item.productName}
                </span>
                <span className="font-bold text-orange-500">
                  {item.totalSold}
                </span>
              </div>

              <div className="w-full h-3 mt-2 overflow-hidden bg-gray-200 rounded-full">
                <div
                  className="h-3 transition-all duration-300 bg-orange-400 rounded-full"
                  style={{
                    width: `${(item.totalSold / maxSold) * 100}%`,
                  }}
                ></div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
