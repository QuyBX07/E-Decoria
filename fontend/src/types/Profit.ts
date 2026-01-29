// src/types/Profit.ts
export interface ProfitPoint {
  month: string;        // JAN, FEB, ...
  revenue: number;
  importCost: number;
  profit: number;
}

export interface ProfitSummary {
  revenue: number;
  importCost: number;
  profit: number;
}
