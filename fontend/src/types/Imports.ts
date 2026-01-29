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

export interface ImportOrderDetail {
  id: string;
  supplierName: string;
  importDate: string;
  totalAmount: number;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    importPrice: number;
    subtotal: number;
  }[];
}
