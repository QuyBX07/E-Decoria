// services/VoucherService.ts
import axios from "axios";
import {
  IUserVoucher,
  IVoucher,
  CreateVoucherDTO,
  UpdateVoucherDTO,
  ApplyVoucherRequest,
  ApplyVoucherResponse,
} from "@/types/Voucher";

const BASE_VOUCHER_URL = "http://localhost:8081/api/vouchers";
const BASE_USER_VOUCHER_URL = "http://localhost:8081/api/user-vouchers";
const API_APPLY_URL = "http://localhost:8081/api/orders";

// Lấy token từ localStorage
function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/* ================================
   📌 ADMIN VOUCHER API
================================ */

// Lấy tất cả voucher (admin)
export const getAllVouchers = async (): Promise<IVoucher[]> => {
  const res = await axios.get<IVoucher[]>(BASE_VOUCHER_URL, {
    headers: { ...getAuthHeader() },
  });
  return res.data;
};

// Lấy 1 voucher theo ID (admin)
export const getVoucherById = async (id: string): Promise<IVoucher> => {
  const res = await axios.get<IVoucher>(`${BASE_VOUCHER_URL}/${id}`, {
    headers: { ...getAuthHeader() },
  });
  return res.data;
};

// Tạo voucher (admin)
export const createVoucher = async (
  data: CreateVoucherDTO
): Promise<IVoucher> => {
  const res = await axios.post<IVoucher>(BASE_VOUCHER_URL, data, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });
  return res.data;
};

// Sửa voucher (admin)
export const updateVoucher = async (
  id: string,
  data: UpdateVoucherDTO
): Promise<IVoucher> => {
  const res = await axios.put<IVoucher>(`${BASE_VOUCHER_URL}/${id}`, data, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });
  return res.data;
};

// Xóa voucher (admin)
export const deleteVoucher = async (id: string): Promise<void> => {
  await axios.delete(`${BASE_VOUCHER_URL}/${id}`, {
    headers: { ...getAuthHeader() },
  });
};

// Kích hoạt voucher
export const activateVoucher = async (id: string): Promise<IVoucher> => {
  const res = await axios.patch<IVoucher>(
    `${BASE_VOUCHER_URL}/${id}/activate`,
    {},
    { headers: { ...getAuthHeader() } }
  );
  return res.data;
};

// Vô hiệu hóa voucher
export const deactivateVoucher = async (id: string): Promise<IVoucher> => {
  const res = await axios.patch<IVoucher>(
    `${BASE_VOUCHER_URL}/${id}/deactivate`,
    {},
    { headers: { ...getAuthHeader() } }
  );
  return res.data;
};

// Lấy tất cả voucher đang hoạt động (dùng để hiển thị cho user săn)
export const getActiveVouchers = async (): Promise<IVoucher[]> => {
  const res = await axios.get<IVoucher[]>(`${BASE_VOUCHER_URL}/active`);
  return res.data;
};

/* ================================
   📌 USER – CLAIM VOUCHER & LẤY VOUCHER
================================ */

// User săn voucher (claim)
export const claimVoucher = async (
  userId: string,
  voucherId: string
): Promise<string> => {
  const res = await axios.post<string>(
    `${BASE_USER_VOUCHER_URL}/claim?userId=${userId}&voucherId=${voucherId}`,
    {},
    { headers: { ...getAuthHeader() } }
  );
  return res.data;
};

// User lấy danh sách voucher của mình
export const getUserVouchers = async (
  userId: string
): Promise<IUserVoucher[]> => {
  const res = await axios.get<IUserVoucher[]>(
    `${BASE_USER_VOUCHER_URL}/${userId}`,
    { headers: { ...getAuthHeader() } }
  );

  return res.data;
};

export async function getMergedActiveVouchers(userId: string | null) {
  // 1. lấy active vouchers
  const active = await getActiveVouchers();

  if (!userId) {
    // chưa login -> trả active vouchers bình thường
    return active.map((v) => ({ ...v, claimed: false }));
  }

  // 2. lấy danh sách voucher user đã claim
  const claimed = await getUserVouchers(userId);
  const claimedIds = claimed.map((c) => c.voucherId);

  // 3. merge: thêm field claimed
  return active.map((v) => ({
    ...v,
    claimed: claimedIds.includes(v.id),
  }));
}

export const applyVoucher = async (
  data: ApplyVoucherRequest
): Promise<ApplyVoucherResponse> => {
  const res = await axios.post<ApplyVoucherResponse>(
    `${API_APPLY_URL}/apply-voucher`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    }
  );
  return res.data;
};
