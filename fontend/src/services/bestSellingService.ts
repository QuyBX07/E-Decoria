// src/services/bestSellingService.ts
import axios from "axios";
import { BestSellingProduct } from "../types/BestSelling";

const API_BASE_URL = "http://localhost:8081/api/reports/products";

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

interface BestSellingParams {
  year: number;
  month?: number;
  quarter?: number;
}

const bestSellingService = {
  getBestSelling: async (params: BestSellingParams): Promise<BestSellingProduct[]> => {
    const res = await axios.get(`${API_BASE_URL}/best-selling`, {
      ...getAuthHeader(),
      params,
    });
    return res.data;
  },
};

export default bestSellingService;
