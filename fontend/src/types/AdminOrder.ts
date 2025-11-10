export interface OrderAdmin {
  orderId: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  shippingAddress: string;
  shippingMethod: string;
  transactionId: string;
  createdAt: string;
  recipientName: string;   // 👈 thêm
  recipientPhone: string;  // 👈 thêm
}
