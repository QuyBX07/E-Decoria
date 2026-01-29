import { useEffect, useState } from "react";
import {
  getAllVouchers,
  deleteVoucher,
  activateVoucher,
  deactivateVoucher,
} from "@/services/VoucherService";
import { IVoucher } from "@/types/Voucher";
import VoucherTable from "@components/Voucher/VoucherTable";
import VoucherForm from "@/components/Voucher/VoucherForm";

export default function ManageVoucherPage() {
  const [vouchers, setVouchers] = useState<IVoucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVoucher, setSelectedVoucher] = useState<IVoucher | null>(null);
  const [openForm, setOpenForm] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const data = await getAllVouchers();
    setVouchers(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa voucher này?")) return;
    await deleteVoucher(id);
    loadData();
  };

  const handleActivate = async (id: string) => {
    await activateVoucher(id);
    loadData();
  };

  const handleDeactivate = async (id: string) => {
    await deactivateVoucher(id);
    loadData();
  };

  const handleEdit = (voucher: IVoucher) => {
    setSelectedVoucher(voucher);
    setOpenForm(true);
  };

  const handleCreate = () => {
    setSelectedVoucher(null);
    setOpenForm(true);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Quản lý Voucher</h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 text-white bg-blue-600 rounded"
        >
          + Tạo voucher
        </button>
      </div>

      <VoucherTable
        vouchers={vouchers}
        loading={loading}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onActivate={handleActivate}
        onDeactivate={handleDeactivate}
      />

      {openForm && (
        <VoucherForm
          voucher={selectedVoucher}
          onClose={() => setOpenForm(false)}
          onDone={() => {
            loadData();
            setOpenForm(false);
          }}
        />
      )}
    </div>
  );
}
