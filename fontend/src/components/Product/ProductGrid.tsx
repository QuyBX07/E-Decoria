import React from "react";
import { Product, ProductGridProps } from "@/types/Products";
import ProductCard from "./ProductCard";

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  // Nếu chưa có dữ liệu hoặc mảng rỗng → hiển thị thông báo
  if (!products || products.length === 0) {
    return (
      <section className="py-16 bg-amber-50">
        <h2 className="mb-10 text-3xl font-semibold text-center text-amber-900">
          Sản phẩm nổi bật
        </h2>
        <p className="text-center text-amber-800">Đang tải sản phẩm...</p>
      </section>
    );
  }

  // Nếu có dữ liệu → hiển thị danh sách
  return (
    <section className="py-16 bg-amber-50">
      <h2 className="mb-10 text-3xl font-semibold text-center text-amber-900">
        Sản phẩm nổi bật
      </h2>
      <div className="grid grid-cols-1 gap-8 px-6 sm:grid-cols-2 md:grid-cols-3">
        {products.map((p: Product) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
