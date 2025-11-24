export interface ImportItem {
  productId: string;
  quantity: number;
  importPrice: number;
}

export interface ImportOrder {
  id: string; // UUID
  supplierName: string;
  totalAmount: number;
  importDate: string;
  items?: ImportItem[];
}

export interface ImportOrderRequest {
  supplierName: string;
  items: ImportItem[];
}
