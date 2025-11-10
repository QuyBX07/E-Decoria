import React, { useEffect, useState } from "react";
import { Category } from "@/types/Categories";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/services/CategoriesService";
import { uploadImage } from "@/services/ImageService";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [, setLoading] = useState(false);
  const [form, setForm] = useState<Omit<Category, "id">>({
    name: "",
    description: "",
    imageCategory: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error(error);
      Swal.fire("Lỗi", "Không thể tải danh sách thể loại", "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Upload ảnh lên backend qua ImageService
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    try {
      const imageUrl = await uploadImage(file);
      setForm({ ...form, imageCategory: imageUrl });
      Swal.fire("Thành công", "Ảnh đã được tải lên!", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Lỗi", "Không thể tải ảnh lên", "error");
    }
  };

  // ✅ Thêm / Cập nhật
  const handleSubmit = async () => {
    try {
      if (!form.name.trim()) {
        Swal.fire(
          "Thiếu thông tin",
          "Tên thể loại không được để trống",
          "warning"
        );
        return;
      }

      if (editingId) {
        await updateCategory(editingId, form);
        Swal.fire("Thành công", "Đã cập nhật thể loại", "success");
      } else {
        await createCategory(form);
        Swal.fire("Thành công", "Đã thêm thể loại mới", "success");
      }

      setForm({ name: "", description: "", imageCategory: "" });
      setEditingId(null);
      setPreview("");
      fetchCategories();
    } catch (error) {
      console.error(error);
      Swal.fire("Lỗi", "Không thể lưu thể loại", "error");
    }
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setForm({
      name: cat.name,
      description: cat.description ?? "",
      imageCategory: cat.imageCategory,
    });
    setPreview(cat.imageCategory);
  };

  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Xác nhận xóa?",
      text: "Bạn có chắc chắn muốn xóa thể loại này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteCategory(id);
        fetchCategories();
        Swal.fire("Đã xóa!", "", "success");
      } catch {
        Swal.fire("Lỗi", "Không thể xóa thể loại", "error");
      }
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">
        📂 Quản lý thể loại
      </h1>

      {/* Form thêm / sửa */}
      <div className="p-6 mb-8 bg-white shadow-md rounded-xl">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Tên thể loại
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Mô tả
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Ảnh thể loại
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="object-cover w-24 h-24 mt-2 border rounded-lg"
              />
            )}
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full mt-4 bg-blue-600 md:w-auto hover:bg-blue-700"
        >
          {editingId ? "Cập nhật thể loại" : "Thêm thể loại"}
        </Button>
      </div>

      {/* Danh sách thể loại */}
      <div className="overflow-x-auto bg-white shadow-md rounded-xl">
        <table className="w-full border-collapse">
          <thead className="bg-blue-100">
            <tr>
              <th className="p-3 text-left">Ảnh</th>
              <th className="p-3 text-left">Tên</th>
              <th className="p-3 text-left">Mô tả</th>
              <th className="p-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  <img
                    src={cat.imageCategory || "/placeholder.svg"}
                    alt={cat.name}
                    className="object-cover w-16 h-16 border rounded-lg"
                  />
                </td>
                <td className="p-3 font-medium">{cat.name}</td>
                <td className="p-3 text-gray-600">{cat.description}</td>
                <td className="p-3 space-x-2 text-center">
                  <Button variant="outline" onClick={() => handleEdit(cat)}>
                    Sửa
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(cat.id)}
                  >
                    Xóa
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoriesPage;
