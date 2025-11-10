import React from "react";
import { motion } from "framer-motion";
import { ProductDetailProps } from "@/types/Products";
import { ShoppingCart } from "lucide-react";
import ProductCard from "./ProductCard";
import Swal from "sweetalert2";
import { addToCart } from "@/services/CartService";
import { useNavigate } from "react-router-dom";

const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  relatedProducts,
}) => {
  const navigate = useNavigate();

  const handleAdd = async () => {
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

  const handleBuyNow = async () => {
    try {
      await addToCart({ productId: product.id, quantity: 1 });
      navigate("/cart");
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Không thể mua ngay",
        text: "Vui lòng đăng nhập để thực hiện thao tác này.",
      });
    }
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#fffaf5] via-[#fdf6ef] to-[#f9f3ea]">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Hình ảnh */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden shadow-md rounded-2xl bg-white/60 backdrop-blur-sm"
          >
            <img
              src={product.imageUrl || "/placeholder.svg"}
              alt={product.name}
              className="object-cover w-full h-[500px] rounded-2xl"
            />
          </motion.div>

          {/* Thông tin */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center"
          >
            <h1 className="mb-3 font-serif text-3xl font-bold text-gray-800 md:text-4xl">
              {product.name}
            </h1>

            <p className="mb-6 text-base leading-relaxed text-gray-600">
              {product.description ||
                "Sản phẩm trang trí cao cấp, mang phong cách hiện đại kết hợp với tinh tế truyền thống, phù hợp cho mọi không gian sống."}
            </p>

            <div className="mb-6 text-3xl font-semibold text-primary">
              {product.price.toLocaleString()}₫
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 px-6 py-3 font-medium text-white transition-all rounded-lg bg-primary hover:bg-primary/90"
              >
                <ShoppingCart className="w-5 h-5" />
                Thêm vào giỏ
              </button>

              <button
                onClick={handleBuyNow}
                className="px-6 py-3 font-medium transition-all border rounded-lg text-primary border-primary hover:bg-primary/10"
              >
                Mua ngay
              </button>
            </div>
          </motion.div>
        </div>

        {/* Mô tả */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-16 text-gray-700"
        >
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">
            Mô tả sản phẩm
          </h2>
          <p className="leading-relaxed text-gray-600">
            {product.description ||
              "Mỗi sản phẩm của Décor Studio đều được chế tác tỉ mỉ với chất liệu cao cấp, mang lại vẻ đẹp tự nhiên và tinh tế cho không gian sống."}
          </p>
        </motion.div>

        {/* Sản phẩm liên quan */}
        {relatedProducts && relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-20"
          >
            <h2 className="mb-8 text-2xl font-semibold text-gray-800">
              Sản phẩm liên quan
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ProductDetail;
