import React from "react";

export type CartItem = {
  productId: string;
  name?: string;
  image?: string;
  quantity: number;
  unitPrice: number;
};

interface Props {
  items: CartItem[];
  shippingFee?: number;
}

const CheckoutSummary: React.FC<Props> = ({ items, shippingFee = 0 }) => {
  const subtotal = items.reduce((s, it) => s + it.unitPrice * it.quantity, 0);
  const total = subtotal + shippingFee;

  return (
    <div className="p-4 space-y-4 border rounded">
      <h3 className="text-lg font-semibold">Tóm tắt đơn hàng</h3>

      <div className="space-y-2">
        {items.map((it) => (
          <div key={it.productId} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={it.image || "/placeholder.svg"}
                alt=""
                className="object-cover w-12 h-12 rounded"
              />
              <div>
                <div className="text-sm font-medium">
                  {it.name || it.productId}
                </div>
                <div className="text-xs text-muted-foreground">
                  x{it.quantity}
                </div>
              </div>
            </div>
            <div className="text-sm font-medium">
              {(it.unitPrice * it.quantity).toLocaleString()}₫
            </div>
          </div>
        ))}
      </div>

      <div className="pt-3 space-y-1 border-t">
        <div className="flex justify-between text-sm">
          {" "}
          <span>Tạm tính</span> <span>{subtotal.toLocaleString()}₫</span>{" "}
        </div>
        <div className="flex justify-between text-sm">
          {" "}
          <span>Phí vận chuyển</span>{" "}
          <span>{shippingFee.toLocaleString()}₫</span>{" "}
        </div>
        <div className="flex justify-between font-semibold">
          {" "}
          <span>Tổng</span> <span>{total.toLocaleString()}₫</span>{" "}
        </div>
      </div>
    </div>
  );
};

export default CheckoutSummary;
