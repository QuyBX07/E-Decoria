export interface RevenueDTO {
  amount: number;
}

export interface OrderStatusDTO {
  status: string;
  count: number;
}

export interface BestSellingProductDTO {
  productId: string;
  productName: string;
  totalSold: number;
}

export interface ProfitDTO {
  totalRevenue: number;
  totalImportCost: number;
  profit: number;
}
