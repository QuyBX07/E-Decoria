import React, { useEffect, useState } from "react";
import { getProfile } from "@/services/ProfileService";
import { getUserVouchers } from "@/services/VoucherService";
import { IUserVoucher } from "@/types/Voucher";
import {
  CheckCircle,
  Clock,
  XCircle,
  Percent,
  BadgeDollarSign,
} from "lucide-react";

const MyVoucherPage: React.FC = () => {
  const [vouchers, setVouchers] = useState<IUserVoucher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const profile = await getProfile();
        const data = await getUserVouchers(profile.id);
        setVouchers(data);
      } catch (err) {
        console.error("Lỗi khi tải voucher:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, []);

  if (loading) return <p className="p-6 text-center">Đang tải voucher...</p>;

  if (vouchers.length === 0)
    return (
      <div className="p-6 text-center">
        <p>Bạn chưa lưu voucher nào.</p>
      </div>
    );

  const renderStatus = (status: IUserVoucher["status"]) => {
    switch (status) {
      case "SAVED":
        return (
          <span className="flex items-center gap-1 text-green-600">
            <CheckCircle className="w-4 h-4" /> Chưa dùng
          </span>
        );
      case "USED":
        return (
          <span className="flex items-center gap-1 text-blue-600">
            <BadgeDollarSign className="w-4 h-4" /> Đã dùng
          </span>
        );
      case "EXPIRED":
        return (
          <span className="flex items-center gap-1 text-red-600">
            <XCircle className="w-4 h-4" /> Hết hạn
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-gray-600">
            <Clock className="w-4 h-4" /> {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl p-6 mx-auto rounded-lg shadow-sm bg-gray-50">
      <h2 className="mb-6 text-2xl font-semibold">🎟️ Voucher của tôi</h2>

      <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-3">Mã</th>
              <th className="p-3">Giảm giá</th>
              <th className="p-3">Điều kiện</th>
              <th className="p-3">Ngày lưu</th>
              <th className="p-3">Trạng thái</th>
            </tr>
          </thead>

          <tbody>
            {vouchers.map((v) => (
              <tr key={v.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{v.code}</td>

                <td className="p-3">
                  {v.discountType === "PERCENT" ? (
                    <span className="flex items-center gap-1">
                      <Percent className="w-4 h-4" /> {v.discountValue}%
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <BadgeDollarSign className="w-4 h-4" />
                      {v.discountValue.toLocaleString()}₫
                    </span>
                  )}
                </td>

                <td className="p-3 text-gray-700">
                  {v.minOrderValue
                    ? `Đơn tối thiểu: ${v.minOrderValue.toLocaleString()}₫`
                    : "Không yêu cầu"}
                </td>

                <td className="p-3 text-gray-700">
                  {new Date(v.savedAt).toLocaleDateString("vi-VN")}
                </td>

                <td className="p-3">{renderStatus(v.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyVoucherPage;
