import React, { useEffect, useState } from "react";
import {
  ImportOrder,
  ImportOrderRequest,
  ImportItem,
  ImportOrderDetail,
} from "@/types/Imports";
import {
  getImportDetail,
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

  // 🔍 search
  const [searchSupplier, setSearchSupplier] = useState("");

  // 📄 pagination
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // 🔍 xem chi tiết đơn nhập
  const [openDetail, setOpenDetail] = useState(false);
  const [detailData, setDetailData] = useState<ImportOrderDetail | null>(null);

  useEffect(() => {
    fetchImports();
    fetchProducts();
  }, []);

  const handleViewDetail = async (id: string) => {
    try {
      const data = await getImportDetail(id);
      setDetailData(data);
      setOpenDetail(true);
    } catch {
      Swal.fire("Lỗi", "Không thể tải chi tiết đơn nhập", "error");
    }
  };

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
    value: string | number,
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
        "warning",
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

  // 🔍 filter theo nhà cung cấp
  const filteredImports = imports.filter((imp) =>
    imp.supplierName.toLowerCase().includes(searchSupplier.toLowerCase()),
  );

  // 📄 pagination
  const totalPages = Math.ceil(filteredImports.length / pageSize);

  const pagedImports = filteredImports.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

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

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Danh sách đơn nhập</h2>

        <div className="relative w-72">
          <span className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2">
            🏭
          </span>
          <input
            type="text"
            placeholder="Tìm theo nhà cung cấp..."
            value={searchSupplier}
            onChange={(e) => {
              setSearchSupplier(e.target.value);
              setPage(1);
            }}
            className="w-full px-4 py-2 pl-10 border rounded-xl focus:ring-2 focus:ring-blue-400"
          />
        </div>
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
            {pagedImports.map((imp) => (
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
                    variant="outline"
                    onClick={() => handleViewDetail(imp.id)}
                  >
                    Xem
                  </Button>

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
      <div className="flex items-center justify-center gap-3 mt-4">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          ⬅ Trước
        </Button>

        <div className="px-4 py-2 text-sm font-medium bg-gray-100 border rounded-xl">
          Trang {page} / {totalPages || 1}
        </div>

        <Button
          variant="outline"
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage(page + 1)}
        >
          Sau ➡
        </Button>
      </div>
      {openDetail && detailData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-3xl p-6 bg-white shadow-xl rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">📄 Chi tiết đơn nhập</h3>
              <button
                onClick={() => setOpenDetail(false)}
                className="text-xl text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Thông tin chung */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <b>Nhà cung cấp:</b> {detailData.supplierName}
              </div>
              <div>
                <b>Ngày tạo:</b>{" "}
                {new Date(detailData.importDate).toLocaleString("vi-VN")}
              </div>
            </div>

            {/* Danh sách sản phẩm */}
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Sản phẩm</th>
                    <th className="p-2 text-right">SL</th>
                    <th className="p-2 text-right">Giá nhập</th>
                    <th className="p-2 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {detailData.items.map((item, i: number) => (
                    <tr key={i} className="border-t">
                      <td className="p-2">{item.productName}</td>
                      <td className="p-2 text-right">{item.quantity}</td>
                      <td className="p-2 text-right">
                        {item.importPrice.toLocaleString("vi-VN")} ₫
                      </td>
                      <td className="p-2 font-medium text-right">
                        {item.subtotal.toLocaleString("vi-VN")} ₫
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-4 text-lg font-semibold">
              Tổng tiền:
              <span className="ml-2 text-blue-600">
                {detailData.totalAmount.toLocaleString("vi-VN")} ₫
              </span>
            </div>

            <div className="flex justify-end mt-6">
              <Button variant="outline" onClick={() => setOpenDetail(false)}>
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportsPage;
