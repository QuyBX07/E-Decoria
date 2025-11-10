import React, { useEffect, useState } from "react";
import { getCartItems } from "@/services/CartService";
import { CartItemResponseDTO } from "@/types/Cart";
import CartItemCard from "@/components/Cart/CartItemCard";
import { Button } from "@/components/ui/button";
import HeaderSection from "@/components/HeaderSection";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItemResponseDTO[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  // 🧩 Load cart khi mở trang
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getCartItems();
        setCartItems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  // 🧮 Tính tổng tiền theo sản phẩm được chọn
  useEffect(() => {
    const total = cartItems
      .filter((item) => selectedItems.includes(item.productId))
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(total);
  }, [cartItems, selectedItems]);

  // 🧰 Xử lý xoá sản phẩm
  const handleRemove = (productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.productId !== productId));
    setSelectedItems((prev) => prev.filter((id) => id !== productId));
  };

  // 🧮 Cập nhật số lượng (frontend)
  const handleUpdateQuantity = (productId: string, newQty: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  // ✅ Checkbox chọn/bỏ chọn
  const handleSelectChange = (productId: string, checked: boolean) => {
    setSelectedItems((prev) =>
      checked ? [...prev, productId] : prev.filter((id) => id !== productId)
    );
  };

  // ✅ Chọn tất cả
  const handleSelectAll = (checked: boolean) => {
    setSelectedItems(checked ? cartItems.map((item) => item.productId) : []);
  };

  // 🛍 Thanh toán
  const navigate = useNavigate();
  const handleCheckout = () => {
    const selectedProducts = cartItems
      .filter((it) => selectedItems.includes(it.productId))
      .map((it) => ({
        productId: it.productId,
        name: it.productName,
        image: it.productImage,
        quantity: it.quantity,
        unitPrice: it.price,
      }));

    if (selectedProducts.length === 0) {
      Swal.fire(
        "Chưa chọn sản phẩm",
        "Vui lòng chọn sản phẩm để thanh toán",
        "warning"
      );
      return;
    }

    navigate("/checkout", { state: { items: selectedProducts } });
  };

  if (loading) return <p className="p-10 text-center">Đang tải giỏ hàng...</p>;

  return (
    <>
      {/* Header toàn trang */}
      <HeaderSection />

      {/* Nội dung giỏ hàng */}
      <div className="max-w-5xl p-6 mx-auto">
        <h1 className="mb-6 text-2xl font-bold">🛒 Giỏ hàng của bạn</h1>

        {cartItems.length === 0 ? (
          <p>Giỏ hàng trống.</p>
        ) : (
          <>
            {/* Chọn tất cả */}
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={selectedItems.length === cartItems.length}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="w-5 h-5 accent-primary"
              />
              <span className="ml-2 text-sm text-gray-700">Chọn tất cả</span>
            </div>

            {/* Danh sách sản phẩm */}
            {cartItems.map((item) => (
              <CartItemCard
                key={item.productId}
                item={item}
                selected={selectedItems.includes(item.productId)}
                onSelectChange={handleSelectChange}
                onRemove={handleRemove}
                onUpdateQuantity={handleUpdateQuantity}
              />
            ))}

            {/* Tổng + Thanh toán + Xóa tất cả */}
            <div className="flex items-center justify-between p-4 mt-6 bg-white border rounded-lg shadow">
              <div className="flex items-center gap-4">
                <p className="text-lg font-semibold text-primary">
                  Tổng cộng: {totalPrice.toLocaleString()}₫
                </p>

                {selectedItems.length > 0 && (
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      const confirm = await Swal.fire({
                        title: "Xóa các sản phẩm đã chọn?",
                        text: "Hành động này không thể hoàn tác!",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Xóa",
                        cancelButtonText: "Hủy",
                      });

                      if (confirm.isConfirmed) {
                        setCartItems((prev) =>
                          prev.filter(
                            (item) => !selectedItems.includes(item.productId)
                          )
                        );
                        setSelectedItems([]);

                        Swal.fire({
                          icon: "success",
                          title: "Đã xóa!",
                          text: "Các sản phẩm đã được xóa khỏi giỏ hàng.",
                          timer: 1200,
                          showConfirmButton: false,
                        });
                      }
                    }}
                    className="text-white bg-red-500 hover:bg-red-600"
                  >
                    Xóa tất cả
                  </Button>
                )}
              </div>

              <Button onClick={handleCheckout} className="px-6 py-2">
                Thanh toán
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartPage;
