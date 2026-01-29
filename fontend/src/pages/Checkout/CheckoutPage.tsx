import React, { useEffect, useState } from "react";
import ShippingInfoForm, {
  ShippingInfo,
} from "@/components/Checkout/ShippingInfoForm";
import PaymentMethods from "@/components/Checkout/PaymentMethods";
import CheckoutSummary, {
  CartItem,
} from "@/components/Checkout/CheckoutSummary";
import { createOrder } from "@/services/OrderService";
import { OrderRequestDTO, OrderResponseDTO } from "@/types/Order";
import { useNavigate, useLocation } from "react-router-dom";
import { getCartItems } from "@/services/CartService";
import { getProfile } from "@/services/ProfileService";
import HeaderSection from "@/components/HeaderSection";
import { createVNPayPayment } from "@/services/PaymentService";
import { ApplyVoucherResponse, IUserVoucher } from "@/types/Voucher";
import { applyVoucher, getUserVouchers } from "@/services/VoucherService";
import VoucherModal from "@/components/Checkout/VoucherModal";
import Swal from "sweetalert2";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const passedItems = location.state?.items || [];

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [userId, setUserId] = useState<string>("");

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    recipientName: "",
    recipientPhone: "",
    address: "",
    shippingMethod: "Giao hàng nhanh",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isLoading, setIsLoading] = useState(false);

  // VOUCHER STATE
  const [selectedVoucher, setSelectedVoucher] =
    useState<ApplyVoucherResponse | null>(null);
  const [voucherCode, setVoucherCode] = useState<string>("");

  const [userVouchers, setUserVouchers] = useState<IUserVoucher[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const originalTotal = cartItems.reduce(
    (sum, it) => sum + it.unitPrice * it.quantity,
    0
  );

  // Kiểm tra đăng nhập
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  // Load giỏ hàng + profile + user vouchers
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load giỏ hàng
        if (passedItems.length > 0) {
          setCartItems(passedItems);
        } else {
          const data = await getCartItems();
          const mapped: CartItem[] = data.map((it) => ({
            productId: it.productId,
            name: it.productName,
            image: it.productImage,
            quantity: it.quantity,
            unitPrice: it.price,
          }));
          setCartItems(mapped);
        }

        // Load profile
        const profile = await getProfile();
        setUserId(profile.id);

        setShippingInfo({
          recipientName: profile.fullName || "",
          recipientPhone: profile.phone || "",
          address: profile.address || "",
          shippingMethod: "Giao hàng nhanh",
        });

        // Load user vouchers
        const vouchers = await getUserVouchers(profile.id);
        setUserVouchers(vouchers);
      } catch (error) {
        console.error("Không thể tải dữ liệu:", error);

        // fallback demo
        setCartItems([
          {
            productId: "041c24ab-58be-432f-a98f-ea78528589d6",
            name: "Sản phẩm A",
            quantity: 2,
            unitPrice: 350000,
          },
          {
            productId: "068f4856-883c-4ee5-b772-458834bb0071",
            name: "Sản phẩm B",
            quantity: 1,
            unitPrice: 490000,
          },
        ]);
      }
    };

    fetchData();
  }, [passedItems]);

  // Đặt hàng
  const handlePlaceOrder = async () => {
    if (
      !shippingInfo.recipientName ||
      !shippingInfo.recipientPhone ||
      !shippingInfo.address
    ) {
      alert("Vui lòng điền đầy đủ thông tin người nhận hàng");
      return;
    }

    if (!userId) {
      alert("Không xác định được người dùng! Vui lòng đăng nhập lại.");
      return;
    }

    const orderReq: OrderRequestDTO = {
      userId,
      voucherId: selectedVoucher?.voucherId,
      shippingAddress: shippingInfo.address,
      shippingMethod: shippingInfo.shippingMethod,
      recipientName: shippingInfo.recipientName,
      recipientPhone: shippingInfo.recipientPhone,
      paymentMethod,
      items: cartItems.map((it) => ({
        productId: it.productId,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
      })),
    };

    console.log("Order Request:", orderReq);

    try {
      setIsLoading(true);
      const res: OrderResponseDTO = await createOrder(orderReq);

      if (paymentMethod === "COD") {
        const enrichedOrder = {
          ...res,
          items: res.items.map((it) => {
            const found = cartItems.find((c) => c.productId === it.productId);
            return {
              ...it,
              name: found?.name || "Sản phẩm",
              image: found?.image || "/placeholder.svg",
            };
          }),
        };

        navigate(`/order-success/${res.id}`, {
          state: { order: enrichedOrder },
        });
      } else {
        const payment = await createVNPayPayment(res.id, res.totalAmount);
        window.location.href = payment.payment_url;
      }
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      const msg =
        err.response?.data?.message || "Đặt hàng thất bại, vui lòng thử lại.";
      alert(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Áp dụng voucher
  const handleApplyVoucher = async () => {
    if (!voucherCode) return;

    try {
      const request = {
        userId,
        orderTotal: originalTotal,
        voucherCode,
      };

      const res: ApplyVoucherResponse = await applyVoucher(request);
      setSelectedVoucher(res);

      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Áp dụng voucher thành công!",
      });
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { error?: string; message?: string } };
      };

      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Không áp dụng được voucher";

      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: msg,
      });
    }
  };

  const handleRemoveVoucher = () => {
    setSelectedVoucher(null);
    setVoucherCode("");
  };

  const discount = selectedVoucher?.discount ?? 0;
  const shippingFee = 30000;
  const finalTotal = originalTotal - discount + shippingFee;

  return (
    <>
      <HeaderSection />

      <div className="container grid grid-cols-1 gap-8 p-4 mx-auto md:grid-cols-3">
        {/* Form giao hàng + thanh toán */}
        <div className="space-y-6 md:col-span-2">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-2xl font-semibold">
              Thông tin người nhận
            </h2>
            <ShippingInfoForm value={shippingInfo} onChange={setShippingInfo} />
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-2xl font-semibold">
              Phương thức thanh toán
            </h2>
            <PaymentMethods value={paymentMethod} onChange={setPaymentMethod} />
          </div>

          {/* Voucher */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-2xl font-semibold">Voucher</h2>

            <div className="flex items-center gap-2">
              <input
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                placeholder="Nhập mã voucher"
                className="flex-1 px-3 py-2 border rounded"
              />
              {selectedVoucher ? (
                <button
                  onClick={handleRemoveVoucher}
                  className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                >
                  Huỷ
                </button>
              ) : (
                <button
                  onClick={handleApplyVoucher}
                  className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                  Áp dụng
                </button>
              )}
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 mt-2 text-sm font-medium text-pink-500 transition border border-pink-400 rounded-lg hover:bg-pink-50"
            >
              🎟️ Chọn voucher đã lưu
            </button>

            {selectedVoucher && (
              <p className="mt-2 text-green-600">
                Giảm giá: {selectedVoucher.discount.toLocaleString()}₫
              </p>
            )}
          </div>
        </div>

        {/* Tóm tắt đơn hàng */}
        <div className="md:col-span-1">
          <div className="sticky p-6 bg-white rounded-lg shadow-md top-24">
            <CheckoutSummary
              items={cartItems}
              shippingFee={shippingFee}
              discount={discount}
              finalTotal={finalTotal}
            />

            <button
              onClick={handlePlaceOrder}
              disabled={isLoading}
              className="w-full py-3 mt-4 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isLoading
                ? "Đang xử lý..."
                : paymentMethod === "COD"
                ? "Đặt hàng (COD)"
                : "Thanh toán"}
            </button>
          </div>
        </div>
      </div>

      {/* Voucher Modal */}
      <VoucherModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        vouchers={userVouchers}
        onSelect={(code: string) => {
          setVoucherCode(code);
          setModalOpen(false);
        }}
      />
    </>
  );
};

export default CheckoutPage;
