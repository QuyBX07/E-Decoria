import { Category } from "../types/Categories";

const API_URL = "http://localhost:8081/api/categories";

// Lấy toàn bộ thể loại
export const getCategories = async (): Promise<Category[]> => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Không thể tải danh sách thể loại");
  return res.json();
};

// Thêm thể loại mới
export const createCategory = async (
  category: Omit<Category, "id">
): Promise<Category> => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(category),
  });
  if (!res.ok) throw new Error("Không thể tạo thể loại");
  return res.json();
};

// Cập nhật thể loại
export const updateCategory = async (
  id: string,
  category: Partial<Category>
): Promise<Category> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(category),
  });
  if (!res.ok) throw new Error("Không thể cập nhật thể loại");
  return res.json();
};

// Xóa thể loại
export const deleteCategory = async (id: string): Promise<void> => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Không thể xóa thể loại");
};
