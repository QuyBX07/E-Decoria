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
  const [searchTerm, setSearchTerm] = useState(""); // State cho ô tìm kiếm

  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  // Load categories
  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data))
      .catch((err) => console.error(err));
  }, []);

  // Load sản phẩm
  useEffect(() => {
    setLoading(true);
    getFilteredProducts(selectedCategory, priceRange, sortBy)
      .then((data) => setProducts(data))
      .finally(() => setLoading(false));
  }, [selectedCategory, priceRange, sortBy]);

  // Lọc sản phẩm theo ô tìm kiếm
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

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
            {/* Ô tìm kiếm */}
            <div className="mb-4">
              <div className="relative max-w-sm">
                <span className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2">
                  🔍
                </span>

                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  className="w-full py-2 pl-10 pr-3 transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                />
              </div>
            </div>

            {loading ? (
              <p>Đang tải sản phẩm...</p>
            ) : (
              <>
                <ProductGrid products={currentProducts} />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (p) => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`px-3 py-1 border rounded ${
                            p === page ? "bg-amber-500 text-white" : "bg-white"
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <FooterSection />
    </div>
  );
};

export default ProductPage;
