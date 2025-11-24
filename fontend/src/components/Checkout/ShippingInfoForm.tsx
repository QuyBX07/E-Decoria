import React, { useState, useEffect } from "react";
import MapPickerModal from "@components/MapPickerModal"; // import modal bản đồ

export type ShippingInfo = {
  recipientName: string;
  recipientPhone: string;
  address: string;
  shippingMethod: string;
};

interface Props {
  value: ShippingInfo;
  onChange: (v: ShippingInfo) => void;
}

const ShippingInfoForm: React.FC<Props> = ({ value, onChange }) => {
  const [form, setForm] = useState<ShippingInfo>(value);
  const [openMap, setOpenMap] = useState(false);

  useEffect(() => setForm(value), [value]);

  const handle = (k: keyof ShippingInfo, v: string) => {
    const next = { ...form, [k]: v };
    setForm(next);
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {/* 👤 Tên người nhận */}
      <div>
        <label className="block mb-1 font-medium">Tên người nhận</label>
        <input
          type="text"
          value={form.recipientName}
          onChange={(e) => handle("recipientName", e.target.value)}
          placeholder="Nhập tên người nhận hàng"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* 📞 Số điện thoại */}
      <div>
        <label className="block mb-1 font-medium">Số điện thoại</label>
        <input
          type="tel"
          value={form.recipientPhone}
          onChange={(e) => handle("recipientPhone", e.target.value)}
          placeholder="Nhập số điện thoại người nhận"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* 🏠 Địa chỉ giao hàng */}
      <div>
        <label className="block text-sm font-medium">Địa chỉ giao hàng</label>
        <input
          value={form.address}
          onClick={() => setOpenMap(true)}
          readOnly
          className="w-full p-2 border rounded cursor-pointer"
          placeholder="Nhấn để chọn trên bản đồ"
        />
      </div>

      {/* Phương thức giao */}
      <div>
        <label className="block text-sm font-medium">Phương thức giao</label>
        <select
          value={form.shippingMethod}
          onChange={(e) => handle("shippingMethod", e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="Giao hàng nhanh">Giao hàng nhanh</option>
          <option value="Giao tiêu chuẩn">Giao tiêu chuẩn</option>
        </select>
      </div>

      {/* Modal bản đồ */}
      <MapPickerModal
        open={openMap}
        onClose={() => setOpenMap(false)}
        onSelect={(address) => handle("address", address)}
      />
    </div>
  );
};

export default ShippingInfoForm;
