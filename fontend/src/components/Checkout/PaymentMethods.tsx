import React from "react";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

const PaymentMethods: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">
        Phương thức thanh toán
      </label>

      <label className="flex items-center gap-2">
        <input
          type="radio"
          name="payment"
          value="COD"
          checked={value === "COD"}
          onChange={(e) => onChange(e.target.value)}
        />
        <span>Thanh toán khi nhận hàng (COD)</span>
      </label>

      <label className="flex items-center gap-2">
        <input
          type="radio"
          name="payment"
          value="MOMO"
          checked={value === "MOMO"}
          onChange={(e) => onChange(e.target.value)}
        />
        <span>MoMo (chuyển hướng thanh toán) — chưa tích hợp</span>
      </label>

      <label className="flex items-center gap-2">
        <input
          type="radio"
          name="payment"
          value="VNPAY"
          checked={value === "VNPAY"}
          onChange={(e) => onChange(e.target.value)}
        />
        <span>VNPay (chuyển hướng thanh toán) — chưa tích hợp</span>
      </label>
    </div>
  );
};

export default PaymentMethods;
