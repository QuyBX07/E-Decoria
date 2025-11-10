import React, { useState, useEffect } from "react";
import { CartItemResponseDTO } from "@/types/Cart";
import { removeFromCart, updateCartItem } from "@/services/CartService";
import Swal from "sweetalert2";
import { Minus, Plus, Trash2 } from "lucide-react";

interface CartItemCardProps {
  item: CartItemResponseDTO;
  onRemove: (productId: string) => void;
  onUpdateQuantity?: (productId: string, newQty: number) => void;
  selected: boolean;
  onSelectChange: (productId: string, checked: boolean) => void;
}

const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  onRemove,
  onUpdateQuantity,
  selected,
  onSelectChange,
}) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [pendingQty, setPendingQty] = useState(item.quantity); // lưu tạm để debounce

  // 🧠 debounce: chỉ gửi API sau 1 giây nếu không bấm nữa
  useEffect(() => {
    const timer = setTimeout(() => {
      updateCartItem(item.productId, pendingQty)
        .then(() => console.log("Đã cập nhật số lượng:", pendingQty))
        .catch((err) => console.error("Lỗi cập nhật số lượng:", err));
    }, 1000);

    return () => clearTimeout(timer);
  }, [pendingQty]);

  const handleRemove = async () => {
    try {
      await removeFromCart(item.productId);
      Swal.fire({
        icon: "success",
        title: "Đã xóa sản phẩm!",
        timer: 1200,
        showConfirmButton: false,
      });
      onRemove(item.productId);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Xóa thất bại!",
        text: "Không thể xóa sản phẩm khỏi giỏ.",
      });
    }
  };

  const handleQuantityChange = (newQty: number) => {
    if (newQty < 1) return;
    setQuantity(newQty);
    setPendingQty(newQty);
    onUpdateQuantity?.(item.productId, newQty);
  };

  const total = item.price * quantity;

  return (
    <div className="flex items-center justify-between p-4 mb-3 bg-white border shadow-sm rounded-xl">
      {/* Checkbox chọn */}
      <input
        type="checkbox"
        checked={selected}
        onChange={(e) => onSelectChange(item.productId, e.target.checked)}
        className="w-5 h-5 cursor-pointer accent-primary"
      />

      {/* Thông tin sản phẩm */}
      <div className="flex items-center flex-1 gap-4 ml-4">
        <img
          src={item.productImage}
          alt={item.productName}
          className="object-cover w-20 h-20 rounded-lg"
        />
        <div>
          <h3 className="text-lg font-semibold">{item.productName}</h3>
          <p className="font-medium text-primary">
            {item.price.toLocaleString()}₫
          </p>

          {/* Điều chỉnh số lượng */}
          <div className="flex items-center mt-2">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="p-1 text-gray-600 transition border rounded hover:bg-gray-100"
            >
              <Minus className="w-4 h-4" />
            </button>

            <span className="w-8 text-center">{quantity}</span>

            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="p-1 text-gray-600 transition border rounded hover:bg-gray-100"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tổng + xóa */}
      <div className="text-right">
        <p className="mb-2 font-semibold text-primary">
          {(total || 0).toLocaleString()}₫
        </p>
        <button
          onClick={handleRemove}
          className="flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4" /> Xóa
        </button>
      </div>
    </div>
  );
};

export default CartItemCard;
