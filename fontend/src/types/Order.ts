// src/types/Order.ts

export interface OrderItemRequestDTO {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderRequestDTO {
  userId: string;
  shippingAddress: string;
  shippingMethod: string;
  paymentMethod: string; // "COD" | "MOMO"
  recipientName: string;     // 👈 thêm
  recipientPhone: string;    // 👈 thêm
  items: OrderItemRequestDTO[];
}

// --- Response DTOs ---
export interface OrderItemResponseDTO {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  // 👇 optional (tùy backend có trả về không)
  name?: string;
  image?: string;
}

export interface OrderResponseDTO {
  id: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  shippingAddress: string;
  shippingMethod: string;
  transactionId: string | null;
  createdAt: string;
  recipientName: string;    // 👈 thêm
  recipientPhone: string;   // 👈 thêm
  items: OrderItemResponseDTO[];
}


// --- Item chi tiết hơn (dùng trong trang chi tiết đơn hàng) ---
export interface OrderItemDetailDTO {
  id: string;
  productId: string;
  productName: string;
  productImage: string | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

// --- Chi tiết đơn hàng (OrderDetailResponseDTO) ---
export interface OrderDetailResponseDTO {
  id: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  shippingMethod: string;
  items: OrderItemDetailDTO[];
  transactionId: string | null;
  createdAt: string;
}