import { ImportOrder, ImportOrderRequest } from "@/types/Imports";

const API_URL = "http://localhost:8081/api/imports";

// Lấy danh sách tất cả đơn nhập
export const getImports = async (): Promise<ImportOrder[]> => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Không thể tải danh sách đơn nhập");
  return res.json();
};

// Lấy chi tiết 1 đơn nhập
export const getImportById = async (id: string): Promise<ImportOrder> => {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Không thể tải chi tiết đơn nhập");
  return res.json();
};

// Tạo đơn nhập mới
export const createImport = async (
  payload: ImportOrderRequest
): Promise<ImportOrder> => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Không thể tạo đơn nhập");
  return res.json();
};

// Xóa đơn nhập
export const deleteImport = async (id: string): Promise<void> => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Không thể xóa đơn nhập");
};
