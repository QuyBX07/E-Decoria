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

  // 🧭 Kiểm tra đăng nhập
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // 🛒 Load giỏ hàng + thông tin người dùng
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🧩 Load giỏ hàng
        if (passedItems.length > 0) {
          setCartItems(passedItems);
        } else {
          const data = await getCartItems();
          const mapped = data.map((it) => ({
            productId: it.productId,
            name: it.productName,
            image: it.productImage,
            quantity: it.quantity,
            unitPrice: it.price,
          }));
          setCartItems(mapped);
        }

        // 🧩 Load thông tin người dùng (đã đăng nhập)
        const profile = await getProfile();
        setUserId(profile.id);
        // ✅ Tự động điền vào form nhưng vẫn cho sửa được
        setShippingInfo({
          recipientName: profile.fullName || "",
          recipientPhone: profile.phone || "",
          address: profile.address || "",
          shippingMethod: "Giao hàng nhanh",
        });
      } catch (err) {
        console.error("Không thể tải dữ liệu:", err);
        // fallback demo nếu không lấy được
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

  // 🚀 Đặt hàng
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

    try {
      setIsLoading(true);
      const res: OrderResponseDTO = await createOrder(orderReq);

      if (paymentMethod === "COD") {
        // Gắn thêm ảnh & tên sản phẩm
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
        // 🏦 Thanh toán online (MOMO/VNPAY)
        // const pay = await createMomoPayment(res.id);
        // window.location.href = pay.payUrl;
      }
    } catch (err: unknown) {
      console.error("Đặt hàng thất bại:", err);
      const msg =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Đặt hàng thất bại, vui lòng thử lại.";
      alert(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const shippingFee = 30000;

  return (
    <>
      <HeaderSection />
      <div className="container grid grid-cols-1 gap-8 p-4 mx-auto md:grid-cols-3">
        {/* Cột trái: form giao hàng & thanh toán */}
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
        </div>

        {/* Cột phải: tóm tắt đơn hàng */}
        <div className="md:col-span-1">
          <div className="sticky p-6 bg-white rounded-lg shadow-md top-24">
            <CheckoutSummary items={cartItems} shippingFee={shippingFee} />
            <button
              onClick={handlePlaceOrder}
              disabled={isLoading}
              className="w-full py-3 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
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
    </>
  );
};

export default CheckoutPage;
