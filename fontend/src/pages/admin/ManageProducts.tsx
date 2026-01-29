import React, { useEffect, useState } from "react";
import { Product, Category } from "@/types/Products";
import { getProducts, getCategories } from "@/services/ProductService";
import { uploadImage } from "@/services/ImageService";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";

const BASE_URL = "http://localhost:8081/api";

const ManageProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<Omit<Product, "id">>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    categoryId: "",
    imageUrl: "",
    color: "",
    material: "",
    style: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 7;

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch {
      Swal.fire("Lỗi", "Không thể tải danh sách sản phẩm", "error");
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch {
      Swal.fire("Lỗi", "Không thể tải danh mục", "error");
    }
  };

  // ✅ Upload ảnh
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    try {
      const imageUrl = await uploadImage(file);
      setForm({ ...form, imageUrl });
    } catch {
      Swal.fire("Lỗi", "Không thể tải ảnh lên", "error");
    }
  };

  // ✅ Thêm / Cập nhật
  const handleSubmit = async () => {
    try {
      const url = editingId
        ? `${BASE_URL}/products/${editingId}`
        : `${BASE_URL}/products`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to save product");

      Swal.fire(
        "Thành công",
        editingId ? "Đã cập nhật sản phẩm" : "Đã thêm sản phẩm mới",
        "success",
      );

      resetForm();
      fetchProducts();
    } catch {
      Swal.fire("Lỗi", "Không thể lưu sản phẩm", "error");
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: 0,
      stock: 0,
      categoryId: "",
      imageUrl: "",
      color: "",
      material: "",
      style: "",
    });
    setEditingId(null);
    setPreview("");
  };

  const handleEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description ?? "",
      price: p.price,
      stock: p.stock ?? 0, // ✅ thêm dòng này
      categoryId: p.categoryId,
      imageUrl: p.imageUrl,
      color: p.color ?? "",
      material: p.material ?? "",
      style: p.style ?? "",
    });
    setPreview(p.imageUrl);
  };


  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Xác nhận xóa?",
      text: "Bạn có chắc chắn muốn xóa sản phẩm này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });
    if (confirm.isConfirmed) {
      try {
        await fetch(`${BASE_URL}/products/${id}`, { method: "DELETE" });
        fetchProducts();
        Swal.fire("Đã xóa!", "", "success");
      } catch {
        Swal.fire("Lỗi", "Không thể xóa sản phẩm", "error");
      }
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredProducts.length / pageSize);

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-gray-50 to-gray-100">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">
        🛍️ Quản lý sản phẩm
      </h1>

      {/* Form thêm / sửa */}
      <div className="p-6 mb-10 bg-white border border-gray-100 shadow-xl rounded-2xl">
        <h2 className="mb-4 text-lg font-semibold text-gray-700">
          {editingId ? "✏️ Chỉnh sửa sản phẩm" : "➕ Thêm sản phẩm mới"}
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="label">Tên sản phẩm</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input"
            />
          </div>

          <div>
            <label className="label">Giá (₫)</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: +e.target.value })}
              className="input"
            />
          </div>

          <div>
            <label className="label">Danh mục</label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="input"
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Số lượng</label>
            <input
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: +e.target.value })}
              className="input"
            />
          </div>

          <div>
            <label className="label">Màu sắc</label>
            <input
              type="text"
              value={form.color}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
              className="input"
            />
          </div>

          <div>
            <label className="label">Chất liệu</label>
            <input
              type="text"
              value={form.material}
              onChange={(e) => setForm({ ...form, material: e.target.value })}
              className="input"
            />
          </div>

          <div>
            <label className="label">Phong cách</label>
            <input
              type="text"
              value={form.style}
              onChange={(e) => setForm({ ...form, style: e.target.value })}
              className="input"
            />
          </div>

          <div className="md:col-span-2">
            <label className="label">Mô tả</label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="input"
              rows={2}
            />
          </div>

          <div className="md:col-span-2">
            <label className="label">Ảnh sản phẩm</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="object-cover w-40 h-40 mt-3 border shadow rounded-xl"
              />
            )}
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          className="px-6 mt-6 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          {editingId ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
        </Button>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="flex items-center justify-between mb-4">
        {/* Ô tìm kiếm */}
        <div className="relative w-72">
          <span className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2">
            🔍
          </span>
          <input
            type="text"
            placeholder="Tìm theo tên sản phẩm..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full px-4 py-2 pl-10 transition-all border rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          />
        </div>

        {/* Phân trang */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="rounded-xl"
          >
            ⬅ Trước
          </Button>

          <div className="px-4 py-2 text-sm font-medium bg-gray-100 border shadow-sm rounded-xl">
            Trang {page} / {totalPages || 1}
          </div>

          <Button
            variant="outline"
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(page + 1)}
            className="rounded-xl"
          >
            Sau ➡
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto bg-white border border-gray-100 shadow-xl rounded-2xl">
        <table className="w-full border-collapse">
          <thead className="text-gray-700 bg-blue-100">
            <tr>
              <th className="p-3 text-left">Ảnh</th>
              <th className="p-3 text-left">Tên</th>
              <th className="p-3 text-left">Giá</th>
              <th className="p-3 text-left">Số lượng</th>
              <th className="p-3 text-left">Màu sắc</th>
              <th className="p-3 text-left">Chất liệu</th>
              <th className="p-3 text-left">Phong cách</th>
              <th className="p-3 text-left">Danh mục</th>
              <th className="p-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((p) => (
              <tr
                key={p.id}
                className="transition-all border-t hover:bg-gray-50"
              >
                <td className="p-3">
                  <img
                    src={p.imageUrl || "/placeholder.svg"}
                    alt={p.name}
                    className="object-cover w-16 h-16 border rounded-lg"
                  />
                </td>
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3">{p.price.toLocaleString()} ₫</td>
                <td className="p-3">{p.stock ?? 0}</td>
                <td className="p-3">{p.color}</td>
                <td className="p-3">{p.material}</td>
                <td className="p-3">{p.style}</td>
                <td className="p-3">
                  {categories.find((c) => c.id === p.categoryId)?.name || "—"}
                </td>
                <td className="p-3 space-x-2 text-center">
                  <Button variant="outline" onClick={() => handleEdit(p)}>
                    Sửa
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(p.id)}
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

export default ManageProducts;
