import { IUserVoucher } from "@/types/Voucher";

interface VoucherModalProps {
  open: boolean;
  onClose: () => void;
  vouchers: IUserVoucher[];
  onSelect: (voucherCode: string) => void;
}

export default function VoucherModal({
  open,
  onClose,
  vouchers,
  onSelect,
}: VoucherModalProps) {
  if (!open) return null;

  // ✅ CHỈ HIỂN THỊ VOUCHER CÒN HIỆU LỰC
  const availableVouchers = vouchers.filter((v) => v.status === "SAVED");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-[480px] rounded-2xl shadow-2xl p-6 animate-fadeIn scale-95">
        {/* Title */}
        <h2 className="mb-5 text-2xl font-bold tracking-wide text-gray-900">
          🎟️ Chọn Voucher
        </h2>

        {/* List */}
        <div className="max-h-[420px] overflow-y-auto space-y-4 pr-1">
          {availableVouchers.length === 0 && (
            <p className="py-6 text-center text-gray-500">
              Bạn chưa có voucher khả dụng.
            </p>
          )}

          {availableVouchers.map((v) => (
            <div
              key={v.id}
              onClick={() => onSelect(v.code)}
              className="group relative border rounded-xl p-4 shadow-sm transition cursor-pointer 
                bg-gradient-to-br from-white to-gray-50
                hover:shadow-lg hover:scale-[1.02]"
            >
              {/* Ribbon */}
              <div className="absolute top-0 left-0 px-3 py-1 text-xs font-semibold text-white bg-green-600 rounded-br-xl">
                Còn hiệu lực
              </div>

              {/* Main */}
              <div className="pl-2">
                <h3 className="mb-1 text-lg font-bold text-gray-900">
                  {v.code}
                </h3>

                <p className="text-sm text-gray-700">
                  {v.discountType === "PERCENT"
                    ? `Giảm ${v.discountValue}%`
                    : `Giảm ${v.discountValue.toLocaleString("vi-VN")}đ`}
                </p>

                {v.minOrderValue && (
                  <p className="mt-1 text-xs text-gray-500">
                    Đơn tối thiểu: {v.minOrderValue.toLocaleString("vi-VN")}đ
                  </p>
                )}

                {v.description && (
                  <p className="mt-3 text-xs leading-relaxed text-gray-600">
                    {v.description}
                  </p>
                )}
              </div>

              {/* Active effect */}
              <div className="absolute inset-0 transition border-2 border-transparent rounded-xl group-hover:border-blue-500"></div>
            </div>
          ))}
        </div>

        {/* Close btn */}
        <button
          onClick={onClose}
          className="w-full py-3 mt-6 font-semibold text-gray-800 transition bg-gray-200 rounded-xl hover:bg-gray-300 active:scale-95"
        >
          Đóng
        </button>
      </div>
    </div>
  );
}
