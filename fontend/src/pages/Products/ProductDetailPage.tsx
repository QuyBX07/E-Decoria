import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HeaderSection from "@components/HeaderSection";
import ProductDetail from "@components/Product/ProductDetail";
import { Product } from "@/types/Products";
import { getProductById } from "@services/ProductService"; // bạn đã có sẵn hàm này
import { getRelatedProducts } from "@services/ProductService"; // thêm file này bên dưới

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const productData = await getProductById(id);
        setProduct(productData);

        if (productData) {
          const relatedData = await getRelatedProducts(productData.id);
          setRelated(relatedData);
        }
      } catch (err) {
        console.error("Error loading product detail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-amber-800">
        Đang tải dữ liệu sản phẩm...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        Không tìm thấy sản phẩm
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf8f3] via-[#fffaf6] to-[#f7efe7]">
      <HeaderSection />
      <ProductDetail product={product} relatedProducts={related} />
    </div>
  );
};

export default ProductDetailPage;
