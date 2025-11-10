import { CartItemRequestDTO, CartItemResponseDTO } from "../types/Cart";

const BASE_URL = "http://localhost:8081/api/cart";

// 🔐 Hàm tiện ích: Lấy token từ localStorage (nếu có)
function getAuthHeader(): HeadersInit {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// 🛒 Lấy danh sách sản phẩm trong giỏ
export async function getCartItems(): Promise<CartItemResponseDTO[]> {
  const res = await fetch(BASE_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });

  if (!res.ok) {
    throw new Error("Không thể tải giỏ hàng");
  }

  return res.json();
}

// ➕ Thêm sản phẩm vào giỏ
export async function addToCart(
  dto: CartItemRequestDTO
): Promise<CartItemResponseDTO> {
  const res = await fetch(`${BASE_URL}/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    throw new Error("Không thể thêm sản phẩm vào giỏ");
  }

  return res.json();
}

// ❌ Xóa sản phẩm khỏi giỏ
export async function removeFromCart(productId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/remove/${productId}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });

  if (!res.ok) {
    throw new Error("Không thể xóa sản phẩm khỏi giỏ");
  }
}

// 🧹 Xóa toàn bộ giỏ hàng
export async function clearCart(): Promise<void> {
  const res = await fetch(`${BASE_URL}/clear`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });

  if (!res.ok) {
    throw new Error("Không thể xóa toàn bộ giỏ hàng");
  }
}

// 🔁 Cập nhật số lượng sản phẩm trong giỏ
export async function updateCartItem(
  productId: string,
  quantity: number
): Promise<void> {
  const res = await fetch(`${BASE_URL}/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({ productId, quantity }),
  });

  if (!res.ok) throw new Error("Không thể cập nhật số lượng sản phẩm");
}
