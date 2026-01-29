import axios from "axios";
import {
  RevenueDTO,
  OrderStatusDTO,
  BestSellingProductDTO,
  ProfitDTO,
} from "@/types/Reports";

const API_BASE = "http://localhost:8081/api/reports";

// Hàm lấy token
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export const getDailyRevenue = async (date: string): Promise<RevenueDTO> => {
  const res = await axios.get(`${API_BASE}/revenue/daily`, {
    params: { date },
    headers: getAuthHeader(),
  });
  return res.data;
};

export const getMonthlyRevenue = async (
  month: number,
  year: number
): Promise<RevenueDTO> => {
  const res = await axios.get(`${API_BASE}/revenue/monthly`, {
    params: { month, year },
    headers: getAuthHeader(),
  });
  return res.data;
};

export const getYearlyRevenue = async (
  year: number
): Promise<RevenueDTO> => {
  const res = await axios.get(`${API_BASE}/revenue/yearly`, {
    params: { year },
    headers: getAuthHeader(),
  });
  return res.data;
};

export const getTotalRevenue = async (): Promise<RevenueDTO> => {
  const res = await axios.get(`${API_BASE}/revenue/total`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

export const getOrderStatusReport = async (): Promise<OrderStatusDTO[]> => {
  const res = await axios.get(`${API_BASE}/orders/status`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

export const getBestSellingProducts =
  async (): Promise<BestSellingProductDTO[]> => {
    const res = await axios.get(`${API_BASE}/products/best-selling`, {
      headers: getAuthHeader(),
    });
    return res.data;
  };

export const getTotalImportCost = async (): Promise<RevenueDTO> => {
  const res = await axios.get(`${API_BASE}/imports/total-cost`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

export const getProfit = async (): Promise<ProfitDTO> => {
  const res = await axios.get(`${API_BASE}/profit`, {
    headers: getAuthHeader(),
  });
  return res.data;
};
