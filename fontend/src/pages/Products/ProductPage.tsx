import React, { useEffect, useState } from "react";
import HeaderSection from "@components/HeaderSection";
import ProductFilter from "@components/Product/ProductFilter";
import ProductGrid from "@components/Product/ProductGrid";
import FooterSection from "@components/FooterSection";
import { getFilteredProducts, getCategories } from "@services/ProductService";
import { Product, Category } from "@/types/Products";

const ProductPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1500000]);
  const [sortBy, setSortBy] = useState("featured");
  const [loading, setLoading] = useState(false);

  // Load categories từ backend
  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data))
      .catch((err) => console.error(err));
  }, []);

  // Load sản phẩm khi filter thay đổi
  useEffect(() => {
    setLoading(true);
    getFilteredProducts(selectedCategory, priceRange, sortBy)
      .then((data) => setProducts(data))
      .finally(() => setLoading(false));
  }, [selectedCategory, priceRange, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf8f3] via-[#fffaf6] to-[#f7efe7]">
      <HeaderSection />
      <main className="px-4 py-12 mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">
            Bộ sưu tập của chúng tôi
          </h1>
          <p className="text-gray-500">
            Khám phá các sản phẩm trang trí cao cấp của Décor Studio.
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <ProductFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
          <div className="flex-1">
            {loading ? (
              <p>Đang tải sản phẩm...</p>
            ) : (
              <ProductGrid products={products} />
            )}
          </div>
        </div>
      </main>
      <FooterSection />
    </div>
  );
};

export default ProductPage;
