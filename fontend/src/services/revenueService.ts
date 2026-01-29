import axios from "axios";
import { RevenuePoint } from "../types/RevenuePoint";

const BASE_URL = "http://localhost:8081/api/reports/revenue";

// Hàm lấy token
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export const getRevenueByMonths = async (year: number): Promise<RevenuePoint[]> => {
  const res = await axios.get(`${BASE_URL}/by-months?year=${year}`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

export const getRevenueByWeeks = async (month: number, year: number): Promise<RevenuePoint[]> => {
  const res = await axios.get(`${BASE_URL}/by-weeks?month=${month}&year=${year}`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

export const getLast7DaysRevenue = async (): Promise<RevenuePoint[]> => {
  const res = await axios.get(`${BASE_URL}/last-7-days`, {
    headers: getAuthHeader(),
  });
  return res.data;
};
