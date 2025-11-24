import React, { useEffect, useState } from "react";
import { ImportOrder, ImportOrderRequest, ImportItem } from "@/types/Imports";
import {
  getImports,
  createImport,
  deleteImport,
} from "@/services/ImportService";
import { getProducts } from "@/services/ProductService";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
}

const ImportsPage: React.FC = () => {
  const [imports, setImports] = useState<ImportOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [supplierName, setSupplierName] = useState("");
  const [items, setItems] = useState<ImportItem[]>([
    { productId: "", quantity: 0, importPrice: 0 },
  ]);

  useEffect(() => {
    fetchImports();
    fetchProducts();
  }, []);

  const fetchImports = async () => {
    try {
      const data = await getImports();
      setImports(data);
    } catch {
      Swal.fire("Lỗi", "Không thể tải danh sách đơn nhập", "error");
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch {
      Swal.fire("Lỗi", "Không thể tải danh sách sản phẩm", "error");
    }
  };

  const addItem = () => {
    setItems([...items, { productId: "", quantity: 0, importPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (
    index: number,
    field: keyof ImportItem,
    value: string | number
  ) => {
    const updatedItems = [...items];

    if (field === "quantity" || field === "importPrice") {
      updatedItems[index][field] = Number(value);
    } else {
      updatedItems[index][field] = value as string;
    }

    setItems(updatedItems);
  };

  const handleSubmit = async () => {
    if (!supplierName.trim()) {
      Swal.fire(
        "Thiếu thông tin",
        "Tên nhà cung cấp không được để trống",
        "warning"
      );
      return;
    }

    try {
      const payload: ImportOrderRequest = {
        supplierName,
        items: items.filter((i) => i.productId),
      };
      await createImport(payload);
      Swal.fire("Thành công", "Đã tạo đơn nhập mới", "success");
      setSupplierName("");
      setItems([{ productId: "", quantity: 0, importPrice: 0 }]);
      fetchImports();
    } catch {
      Swal.fire("Lỗi", "Không thể tạo đơn nhập", "error");
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Xác nhận xóa?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteImport(id);
        Swal.fire("Đã xóa!", "", "success");
        fetchImports();
      } catch {
        Swal.fire("Lỗi", "Không thể xóa đơn nhập", "error");
      }
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">
        📦 Quản lý đơn nhập
      </h1>

      {/* Form thêm đơn nhập */}
      <div className="p-6 mb-8 bg-white shadow-md rounded-xl">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Nhà cung cấp
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-200"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
            />
          </div>
        </div>

        {/* Bảng sản phẩm */}
        <div className="mt-4 space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-1 gap-4 p-4 border rounded-lg md:grid-cols-4 bg-gray-50"
            >
              {/* Sản phẩm */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-600">
                  Sản phẩm
                </label>
                <select
                  value={item.productId}
                  onChange={(e) =>
                    handleItemChange(index, "productId", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="">Chọn sản phẩm</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Số lượng */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-600">
                  Số lượng
                </label>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(index, "quantity", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                  min={1}
                />
              </div>

              {/* Giá nhập */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-600">
                  Giá nhập
                </label>
                <input
                  type="number"
                  value={item.importPrice}
                  onChange={(e) =>
                    handleItemChange(index, "importPrice", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                  min={0}
                />
              </div>

              {/* Xoá */}
              <div className="flex items-end">
                {items.length > 1 && (
                  <Button
                    variant="destructive"
                    onClick={() => removeItem(index)}
                    className="w-full"
                  >
                    Xóa
                  </Button>
                )}
              </div>
            </div>
          ))}

          <Button variant="outline" onClick={addItem}>
            ➕ Thêm sản phẩm
          </Button>
        </div>

        <Button
          onClick={handleSubmit}
          className="mt-4 bg-green-500 hover:bg-green-600"
        >
          Tạo đơn nhập
        </Button>
      </div>

      {/* Danh sách đơn nhập */}
      <div className="overflow-x-auto bg-white shadow-md rounded-xl">
        <table className="w-full border-collapse">
          <thead className="bg-blue-100">
            <tr>
              <th className="p-3 text-left">Nhà cung cấp</th>
              <th className="p-3 text-left">Tổng tiền</th>
              <th className="p-3 text-left">Ngày tạo</th>
              <th className="p-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {imports.map((imp) => (
              <tr key={imp.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{imp.supplierName}</td>
                <td className="p-3">{imp.totalAmount}</td>
                <td className="p-3">
                  {new Date(imp.importDate)
                    .toLocaleString("vi-VN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                    .replace(",", " ·")}
                </td>
                <td className="p-3 space-x-2 text-center">
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(imp.id)}
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

export default ImportsPage;
