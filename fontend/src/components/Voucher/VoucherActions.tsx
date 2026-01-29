import { IVoucher } from "@/types/Voucher";

interface Props {
  voucher: IVoucher;
  onEdit: (v: IVoucher) => void;
  onDelete: (id: string) => void;
  onActivate: (id: string) => void;
  onDeactivate: (id: string) => void;
}

export default function VoucherActions({
  voucher,
  onEdit,
  onDelete,
  onActivate,
  onDeactivate,
}: Props) {
  return (
    <div className="flex gap-2">
      <button
        className="px-2 py-1 text-white bg-yellow-500 rounded"
        onClick={() => onEdit(voucher)}
      >
        Sửa
      </button>

      {voucher.status === "ACTIVE" ? (
        <button
          className="px-2 py-1 text-white bg-gray-600 rounded"
          onClick={() => onDeactivate(voucher.id)}
        >
          Tắt
        </button>
      ) : (
        <button
          className="px-2 py-1 text-white bg-green-600 rounded"
          onClick={() => onActivate(voucher.id)}
        >
          Bật
        </button>
      )}

      <button
        className="px-2 py-1 text-white bg-red-600 rounded"
        onClick={() => onDelete(voucher.id)}
      >
        Xóa
      </button>
    </div>
  );
}
