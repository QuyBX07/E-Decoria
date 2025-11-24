import axios from "axios";
import { RevenueDTO, OrderStatusDTO, BestSellingProductDTO, ProfitDTO } from "@/types/Reports";

const API_BASE = "http://localhost:8081/api/reports";

export const getDailyRevenue = async (date: string): Promise<RevenueDTO> => {
  const res = await axios.get(`${API_BASE}/revenue/daily`, { params: { date } });
  return res.data;
};

export const getMonthlyRevenue = async (month: number, year: number): Promise<RevenueDTO> => {
  const res = await axios.get(`${API_BASE}/revenue/monthly`, { params: { month, year } });
  return res.data;
};

export const getYearlyRevenue = async (year: number): Promise<RevenueDTO> => {
  const res = await axios.get(`${API_BASE}/revenue/yearly`, { params: { year } });
  return res.data;
};

export const getTotalRevenue = async (): Promise<RevenueDTO> => {
  const res = await axios.get(`${API_BASE}/revenue/total`);
  return res.data;
};

export const getOrderStatusReport = async (): Promise<OrderStatusDTO[]> => {
  const res = await axios.get(`${API_BASE}/orders/status`);
  return res.data;
};

export const getBestSellingProducts = async (): Promise<BestSellingProductDTO[]> => {
  const res = await axios.get(`${API_BASE}/products/best-selling`);
  return res.data;
};

export const getTotalImportCost = async (): Promise<RevenueDTO> => {
  const res = await axios.get(`${API_BASE}/imports/total-cost`);
  return res.data;
};

export const getProfit = async (): Promise<ProfitDTO> => {
  const res = await axios.get(`${API_BASE}/profit`);
  return res.data;
};
