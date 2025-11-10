import React from "react";
import { Link } from "react-router-dom";
import { ProductCardProps } from "@/types/Products";
import Swal from "sweetalert2";
import { addToCart } from "@/services/CartService";

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await addToCart({ productId: product.id, quantity: 1 });
      Swal.fire({
        icon: "success",
        title: "Đã thêm vào giỏ hàng!",
        text: `${product.name} đã được thêm.`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Vui lòng đăng nhập để thêm sản phẩm.";
      Swal.fire({
        icon: "error",
        title: "Thêm thất bại!",
        text: message,
      });
    }
  };

  return (
    <Link to={`/products/${product.id}`}>
      <div className="p-4 transition border rounded-xl bg-neutral-50 shadow-soft hover:shadow-glow hover:scale-[1.02]">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="object-cover w-full h-56 rounded-lg"
        />
        <h3 className="mt-3 text-lg font-semibold text-neutral-900">
          {product.name}
        </h3>
        <p className="mt-1 font-bold text-primary">
          {product.price.toLocaleString()}₫
        </p>
        <button
          onClick={handleAdd}
          className="w-full py-2 mt-3 text-white transition rounded-md bg-primary hover:bg-primary-light"
        >
          Thêm vào giỏ
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
