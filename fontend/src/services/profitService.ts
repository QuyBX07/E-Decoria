// src/services/profitService.ts
import axios from "axios";
import { ProfitPoint, ProfitSummary } from "../types/Profit";

const API_URL = "http://localhost:8081/api/reports/profit";

// Lấy token từ localStorage
const token = localStorage.getItem("token");
const authHeader = {
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
  },
};

const profitService = {
  // Chart theo tháng trong năm
  getYearlyChart: async (year: number): Promise<ProfitPoint[]> => {
    const res = await axios.get(`${API_URL}/yearly-chart?year=${year}`, authHeader);
    return res.data;
  },

  // Tổng hợp theo mốc (năm, quý, tháng)
  getYearly: async (year: number): Promise<ProfitSummary> => {
    const res = await axios.get<ProfitSummary>(`${API_URL}/yearly?year=${year}`, authHeader);
    return res.data;
  },

  getMonthly: async (year: number, month: number): Promise<ProfitSummary> => {
    const res = await axios.get<ProfitSummary>(
      `${API_URL}/monthly?year=${year}&month=${month}`,
      authHeader
    );
    return res.data;
  },

  getQuarter: async (year: number, quarter: number): Promise<ProfitSummary> => {
    const res = await axios.get<ProfitSummary>(
      `${API_URL}/quarter?year=${year}&quarter=${quarter}`,
      authHeader
    );
    return res.data;
  },
};

export default profitService;
