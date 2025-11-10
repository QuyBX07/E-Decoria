import React, { useEffect, useState } from "react";
import HeroSection from "@components/HeroSection";
import ProductGrid from "@components/Product/ProductGrid";
import CategorySection from "@components/CategorySection";
import Newsletter from "@components/Newsletter";
import HeaderSection from "@components/HeaderSection";
import FooterSection from "@components/FooterSection";
import { getProducts } from "@services/ProductService";
import { Product } from "@/types/Products";

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getProducts()
      .then((data) => setFeaturedProducts(data.slice(0, 3)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf8f3] via-[#fffaf6] to-[#f7efe7]">
      <HeaderSection />
      <HeroSection />
      <CategorySection />
      {loading ? (
        <p className="py-10 text-center">Đang tải sản phẩm nổi bật...</p>
      ) : (
        <ProductGrid products={featuredProducts} />
      )}
      <Newsletter />
      <FooterSection />
    </div>
  );
};

export default HomePage;
