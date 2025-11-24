import React, { useEffect, useState } from "react";
import { Product } from "@/types/Products";
import { Model3D } from "@/types/Model3D";
import { uploadImage } from "@/services/ImageService";
import { uploadModelFile } from "@/services/UploadModelService";
import { createModel, getModelsByProduct } from "@/services/Model3DService";
import { getProducts } from "@/services/ProductService";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";

const BASE_URL = "http://localhost:8081/api/models";

const ManageModels: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [models, setModels] = useState<Model3D[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("");

  const [form, setForm] = useState<Model3D>({
    productId: "",
    modelUrl: "",
    previewImage: "",
    fileSize: 0,
  });

  const [previewImageLocal, setPreviewImageLocal] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // ========= LOAD INITIAL DATA ==========
  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedProduct) fetchModels(selectedProduct);
  }, [selectedProduct]);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch {
      Swal.fire("Lỗi", "Không thể tải danh sách sản phẩm", "error");
    }
  };

  const fetchModels = async (productId: string) => {
    try {
      const data = await getModelsByProduct(productId);
      setModels(data);
    } catch {
      setModels([]);
    }
  };

  // ========= UPLOAD PREVIEW IMAGE ==========
  const handlePreviewUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreviewImageLocal(URL.createObjectURL(file));

    try {
      const url = await uploadImage(file);
      setForm({ ...form, previewImage: url });
    } catch {
      Swal.fire("Lỗi", "Không thể upload ảnh preview", "error");
    }
  };

  // ========= UPLOAD MODEL FILE ==========
  const handleModelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadModelFile(file);
      setForm({ ...form, modelUrl: url, fileSize: file.size });
    } catch {
      Swal.fire("Lỗi", "Upload file GLB thất bại", "error");
    }
  };

  // ========= CREATE / UPDATE ==========
  const handleSubmit = async () => {
    if (!form.productId || !form.modelUrl) {
      Swal.fire(
        "Thiếu dữ liệu",
        "Bạn phải chọn sản phẩm và upload file 3D",
        "warning"
      );
      return;
    }

    try {
      await createModel(form);

      Swal.fire(
        "Thành công",
        editingId ? "Đã cập nhật model 3D" : "Đã thêm model mới",
        "success"
      );

      resetForm();
      fetchModels(form.productId);
    } catch (e) {
      console.error(e);
      Swal.fire("Lỗi", "Không thể lưu model 3D", "error");
    }
  };

  const resetForm = () => {
    setForm({
      productId: "",
      modelUrl: "",
      previewImage: "",
      fileSize: 0,
    });
    setPreviewImageLocal("");
    setEditingId(null);
  };

  // ========= EDIT ==========
  const handleEdit = (m: Model3D) => {
    setEditingId(m.id!);
    setForm({
      productId: m.productId,
      modelUrl: m.modelUrl,
      previewImage: m.previewImage,
      fileSize: m.fileSize,
    });
    setPreviewImageLocal(m.previewImage || "");
    setSelectedProduct(m.productId);
  };

  // ========= DELETE ==========
  const handleDelete = async (id: string) => {
    const c = await Swal.fire({
      title: "Xóa model?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });
    if (!c.isConfirmed) return;

    try {
      await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
      Swal.fire("Đã xóa!", "", "success");
      fetchModels(selectedProduct);
    } catch {
      Swal.fire("Lỗi", "Không thể xóa model", "error");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-gray-50 to-gray-100">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">
        📦 Quản lý Model 3D
      </h1>

      {/* FORM */}
      <div className="p-6 mb-10 bg-white shadow-xl rounded-2xl">
        <h2 className="mb-4 text-lg font-semibold">
          {editingId ? "✏️ Chỉnh sửa Model" : "➕ Thêm Model 3D"}
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* PRODUCT SELECT */}
          <div>
            <label className="label">Sản phẩm</label>
            <select
              className="input"
              value={form.productId}
              onChange={(e) => {
                setForm({ ...form, productId: e.target.value });
                setSelectedProduct(e.target.value);
              }}
            >
              <option value="">-- chọn sản phẩm --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* PREVIEW IMAGE */}
          <div>
            <label className="label">Ảnh preview</label>
            <input
              type="file"
              accept="image/*"
              className="file-input"
              onChange={handlePreviewUpload}
            />

            {previewImageLocal && (
              <img
                src={previewImageLocal}
                className="object-cover w-32 h-32 mt-3 border shadow rounded-xl"
              />
            )}
          </div>

          {/* UPLOAD GLB */}
          <div>
            <label className="label">Model (.glb)</label>
            <input
              type="file"
              accept=".glb,.gltf,.fbx"
              className="file-input"
              onChange={handleModelUpload}
            />
          </div>

          <div>
            <label className="label">Dung lượng file</label>
            <input
              type="text"
              value={((form.fileSize ?? 0) / 1024).toFixed(1) + " KB"}
              disabled
              className="input"
            />
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          className="px-6 mt-6 text-white bg-blue-600 rounded-lg"
        >
          {editingId ? "Cập nhật Model" : "Thêm Model"}
        </Button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white shadow-xl rounded-2xl">
        <table className="w-full border-collapse">
          <thead className="bg-blue-100">
            <tr>
              <th className="p-3 text-left">Preview</th>
              <th className="p-3 text-left">Model URL</th>
              <th className="p-3 text-left">Size</th>
              <th className="p-3 text-center">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {models.map((m) => (
              <tr key={m.id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  <img
                    src={m.previewImage}
                    className="object-cover w-20 h-20 border rounded-lg"
                  />
                </td>
                <td className="p-3">{m.modelUrl}</td>
                <td className="p-3">
                  {((form.fileSize ?? 0) / 1024).toFixed(1) + " KB"}
                </td>
                <td className="p-3 space-x-2 text-center">
                  <Button variant="outline" onClick={() => handleEdit(m)}>
                    Sửa
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(m.id!)}
                  >
                    Xóa
                  </Button>
                </td>
              </tr>
            ))}

            {models.length === 0 && (
              <tr>
                <td colSpan={4} className="p-5 text-center text-gray-500">
                  Chưa có model cho sản phẩm này.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageModels;
