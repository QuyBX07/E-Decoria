import { IVoucher } from "@/types/Voucher";
import VoucherActions from "./VoucherActions";

interface Props {
  vouchers: IVoucher[];
  loading: boolean;
  onEdit: (v: IVoucher) => void;
  onDelete: (id: string) => void;
  onActivate: (id: string) => void;
  onDeactivate: (id: string) => void;
}

export default function VoucherTable({
  vouchers,
  loading,
  onEdit,
  onDelete,
  onActivate,
  onDeactivate,
}: Props) {
  if (loading) return <p>Đang tải...</p>;

  return (
    <table className="w-full text-sm border">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 border">Mã</th>
          <th className="p-2 border">Loại</th>
          <th className="p-2 border">Giá trị</th>
          <th className="p-2 border">Đơn tối thiểu</th>
          <th className="p-2 border">Giới hạn</th>
          <th className="p-2 border">Đã dùng</th>
          <th className="p-2 border">Trạng thái</th>
          <th className="p-2 border">Bắt đầu</th>
          <th className="p-2 border">Kết thúc</th>
          <th className="p-2 border">Tạo lúc</th>
          <th className="p-2 border w-[120px]">Hành động</th>
        </tr>
      </thead>

      <tbody>
        {vouchers.map((v) => (
          <tr key={v.id} className="border">
            <td className="p-2 font-medium border">{v.code}</td>

            <td className="p-2 border">{v.discountType}</td>

            <td className="p-2 border">
              {v.discountType === "PERCENT"
                ? `${v.discountValue}%`
                : `${v.discountValue.toLocaleString("vi-VN")}đ`}
            </td>

            <td className="p-2 border">
              {v.minOrderValue
                ? v.minOrderValue.toLocaleString("vi-VN") + "đ"
                : "-"}
            </td>

            <td className="p-2 border">{v.usageLimit ?? "-"}</td>

            <td className="p-2 border">{v.usedCount}</td>

            <td className="p-2 border">
              <span
                className={`px-2 py-1 rounded text-xs ${
                  v.status === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {v.status}
              </span>
            </td>

            <td className="p-2 border">
              {new Date(v.startDate).toLocaleString("vi-VN")}
            </td>

            <td className="p-2 border">
              {new Date(v.endDate).toLocaleString("vi-VN")}
            </td>

            <td className="p-2 border">
              {new Date(v.createdAt).toLocaleString("vi-VN")}
            </td>

            <td className="p-2 border">
              <VoucherActions
                voucher={v}
                onEdit={onEdit}
                onDelete={onDelete}
                onActivate={onActivate}
                onDeactivate={onDeactivate}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
