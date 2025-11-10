import axios, { AxiosResponse } from "axios";
import { OrderAdmin } from "@/types/AdminOrder";

const API_URL = "http://localhost:8081/api/admin/orders";

// Định nghĩa type cho query params
interface OrderQueryParams {
  status?: string;
  sort?: "asc" | "desc";
}

// Lấy danh sách đơn hàng (có thể filter theo status & sort)
export const getOrders = async (
  status?: string,
  sort: "asc" | "desc" = "desc"
): Promise<OrderAdmin[]> => {
  const params: OrderQueryParams = {};
  if (status) params.status = status;
  if (sort) params.sort = sort;

  const response: AxiosResponse<OrderAdmin[]> = await axios.get(API_URL, {
    params,
  });
  return response.data;
};

// Lấy chi tiết đơn hàng
export const getOrderById = async (id: string): Promise<OrderAdmin> => {
  const response: AxiosResponse<OrderAdmin> = await axios.get(
    `${API_URL}/${id}`
  );
  return response.data;
};

// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (
  id: string,
  status: string
): Promise<string> => {
  const response: AxiosResponse<string> = await axios.put(
    `${API_URL}/${id}/status`,
    null,
    { params: { status } }
  );
  return response.data;
};

// Xóa đơn hàng
export const deleteOrder = async (id: string): Promise<string> => {
  const response: AxiosResponse<string> = await axios.delete(
    `${API_URL}/${id}`
  );
  return response.data;
};
