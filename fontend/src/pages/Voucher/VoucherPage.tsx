import { useEffect, useState } from "react";
import {
  getMergedActiveVouchers,
  claimVoucher,
} from "@/services/VoucherService";
import { toast } from "react-hot-toast";
import HeaderSection from "@components/HeaderSection";
import FooterSection from "@components/FooterSection";

type VoucherUI = {
  id: string;
  code: string;
  description?: string;
  discountType: "PERCENT" | "FIXED";
  discountValue: number;
  claimed: boolean;
};

const PAGE_SIZE = 6; // ✅ 6 voucher / trang

export default function VoucherPage() {
  const [vouchers, setVouchers] = useState<VoucherUI[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user.id ?? "";

  useEffect(() => {
    loadVouchers();
  }, []);

  const loadVouchers = async () => {
    try {
      const data: VoucherUI[] = await getMergedActiveVouchers(userId);
      setVouchers(data);
      setCurrentPage(1); // reset về trang 1 khi reload
    } catch (error) {
      toast.error(error as string);
    }
  };

  const handleClaim = async (voucherId: string) => {
    try {
      const msg = await claimVoucher(userId, voucherId);
      toast.success(msg);

      setVouchers((prev) =>
        prev.map((v) => (v.id === voucherId ? { ...v, claimed: true } : v)),
      );
    } catch (error) {
      const err = error as unknown as {
        response?: { data?: { error: string } };
      };
      const msg = err.response?.data?.error;

      if (msg === "User already claimed this voucher") {
        toast("Bạn đã lưu voucher này rồi!");

        setVouchers((prev) =>
          prev.map((v) => (v.id === voucherId ? { ...v, claimed: true } : v)),
        );
      } else {
        toast.error("Không thể lưu voucher.");
      }
    }
  };

  // ================== PAGINATION ==================
  const totalPages = Math.ceil(vouchers.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pagedVouchers = vouchers.slice(startIndex, startIndex + PAGE_SIZE);
  // =================================================

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff8f0] to-[#ffeeda]">
      <HeaderSection />

      <main className="px-4 py-12 mx-auto max-w-7xl">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">Săn Voucher</h1>
        <p className="mb-10 text-gray-500">
          Nhận ngay ưu đãi giá trị cho đơn hàng của bạn.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pagedVouchers.map((v) => (
            <div
              key={v.id}
              className="p-6 transition-all duration-200 bg-white border border-orange-200 shadow-md rounded-2xl hover:shadow-lg"
            >
              {/* Mã voucher */}
              <div className="text-lg font-bold text-orange-600">{v.code}</div>

              {/* Giá trị giảm */}
              <div className="mt-3 text-3xl font-extrabold text-gray-800">
                {v.discountValue}
                {v.discountType === "PERCENT" ? "%" : "đ"}
              </div>

              {/* Mô tả */}
              <div className="mt-3 text-sm leading-relaxed text-gray-700">
                {v.description || "Không có mô tả cho voucher này."}
              </div>

              <button
                disabled={v.claimed}
                onClick={() => handleClaim(v.id)}
                className={`mt-6 w-full py-2.5 rounded-xl text-center font-semibold transition ${
                  v.claimed
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600 text-white"
                }`}
              >
                {v.claimed ? "Đã lưu" : "Lưu voucher"}
              </button>
            </div>
          ))}
        </div>

        {/* ===== PAGINATION UI ===== */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    page === currentPage
                      ? "bg-orange-500 text-white"
                      : "bg-white border hover:bg-orange-100"
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>
        )}
        {/* ========================= */}
      </main>

      <FooterSection />
    </div>
  );
}
