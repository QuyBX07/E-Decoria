export type DiscountType = "PERCENT" | "FIXED";
export type VoucherStatus = "ACTIVE" | "INACTIVE";
export type UserVoucherStatus = "SAVED" | "USED"  | "EXPIRED";

export interface IVoucher {
  id: string;
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderValue: number | null;
  usageLimit: number | null;
  usedCount: number;
  startDate: string;
  endDate: string;
  status: VoucherStatus;
  createdAt: string;
}

export interface CreateVoucherDTO {
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderValue?: number | null;
  usageLimit?: number | null;
  startDate: string;
  endDate: string;
  // status: VoucherStatus;
}

export interface IUserVoucher {
  id: string;
  voucherId: string;
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderValue: number | null;
  savedAt: string;
  status: UserVoucherStatus;
}


export type UpdateVoucherDTO = Partial<CreateVoucherDTO>;

export interface ApplyVoucherRequest {
  userId: string;
  orderTotal: number;
  voucherCode: string;
}

export interface ApplyVoucherResponse {
  discount: number;
  finalPrice: number;
  message: string;
  voucherCode: string;
  voucherId: string;
  discountType: DiscountType
  discountValue: number;
}

