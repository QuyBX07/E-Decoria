import { useState, useEffect } from "react";
import { createVoucher, updateVoucher } from "@/services/VoucherService";
import { CreateVoucherDTO, IVoucher, DiscountType } from "@/types/Voucher";

interface Props {
  voucher: IVoucher | null;
  onClose: () => void;
  onDone: () => void;
}

type VoucherValue = CreateVoucherDTO[keyof CreateVoucherDTO];

export default function VoucherForm({ voucher, onClose, onDone }: Props) {
  const [form, setForm] = useState<CreateVoucherDTO>({
    code: "",
    description: "",
    discountType: "PERCENT",
    discountValue: 0,
    minOrderValue: null,
    usageLimit: null,
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (voucher) {
      setForm({
        code: voucher.code,
        description: voucher.description || "",
        discountType: voucher.discountType,
        discountValue: voucher.discountValue,
        minOrderValue: voucher.minOrderValue,
        usageLimit: voucher.usageLimit,
        startDate: voucher.startDate,
        endDate: voucher.endDate,
      });
    }
  }, [voucher]);

  const handleChange = (key: keyof CreateVoucherDTO, value: VoucherValue) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!form.code.trim()) return alert("Mã voucher không được để trống!");
    if (form.discountValue <= 0) return alert("Giá trị giảm phải > 0");

    if (voucher) await updateVoucher(voucher.id, form);
    else await createVoucher(form);

    onDone();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="w-full max-w-2xl p-6 bg-white shadow-xl rounded-xl animate-fade-in">
        <h2 className="mb-6 text-xl font-semibold text-center text-gray-800">
          {voucher ? "Sửa Voucher" : "Tạo Voucher"}
        </h2>

        {/* FORM */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Mã voucher */}
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-sm font-medium">Mã voucher</label>
            <input
              className="p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập mã voucher"
              value={form.code}
              onChange={(e) => handleChange("code", e.target.value)}
            />
          </div>

          {/* Mô tả */}
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-sm font-medium">Mô tả</label>
            <textarea
              rows={3}
              className="p-2 border rounded-md outline-none resize-none focus:ring-2 focus:ring-blue-500"
              placeholder="Mô tả chức năng voucher"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          {/* Loại giảm */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Loại giảm</label>
            <select
              className="p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              value={form.discountType}
              onChange={(e) =>
                handleChange("discountType", e.target.value as DiscountType)
              }
            >
              <option value="PERCENT">Giảm phần trăm</option>
              <option value="FIXED">Giảm tiền</option>
            </select>
          </div>

          {/* Giá trị giảm */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Giá trị giảm</label>
            <input
              type="number"
              className="p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="VD: 10 hoặc 50000"
              value={form.discountValue}
              onChange={(e) =>
                handleChange("discountValue", Number(e.target.value))
              }
            />
          </div>

          {/* Đơn tối thiểu */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">
              Đơn tối thiểu (tuỳ chọn)
            </label>
            <input
              type="number"
              className="p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="VD: 100000"
              value={form.minOrderValue ?? ""}
              onChange={(e) =>
                handleChange(
                  "minOrderValue",
                  e.target.value === "" ? null : Number(e.target.value),
                )
              }
            />
          </div>

          {/* Giới hạn sử dụng */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">
              Giới hạn sử dụng (tuỳ chọn)
            </label>
            <input
              type="number"
              className="p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="VD: 50"
              value={form.usageLimit ?? ""}
              onChange={(e) =>
                handleChange(
                  "usageLimit",
                  e.target.value === "" ? null : Number(e.target.value),
                )
              }
            />
          </div>

          {/* Ngày bắt đầu */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Ngày bắt đầu</label>
            <input
              type="datetime-local"
              className="p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              value={form.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
            />
          </div>

          {/* Ngày kết thúc */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Ngày kết thúc</label>
            <input
              type="datetime-local"
              className="p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              value={form.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 text-sm transition bg-gray-200 rounded-md hover:bg-gray-300"
            onClick={onClose}
          >
            Hủy
          </button>

          <button
            className="px-5 py-2 text-sm text-white transition bg-blue-600 rounded-md hover:bg-blue-700"
            onClick={handleSubmit}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
