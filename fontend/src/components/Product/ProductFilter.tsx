import React from "react";
import { ProductFilterProps } from "@/types/Products";

const ProductFilter: React.FC<ProductFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceChange,
  sortBy,
  onSortChange,
}) => {
  return (
    <aside
      className="
        w-full lg:w-64 
        p-5 
        bg-gradient-to-b from-white to-[#fff7e6] 
        border border-[#f5d48f]/50 
        rounded-xl 
        shadow-md 
        transition-all duration-300
        max-h-[100vh]         /* ✅ Giới hạn chiều cao */
        overflow-y-auto      /* ✅ Cuộn khi vượt quá */
        scrollbar-thin 
        scrollbar-thumb-[#e4c475] 
        scrollbar-track-transparent
      "
    >
      <h3 className="mb-4 text-xl font-semibold text-[#8b5e2e]">
        Bộ lọc sản phẩm
      </h3>

      {/* Danh mục */}
      <div className="mb-6">
        <p className="mb-2 font-medium text-gray-700">Danh mục</p>
        <div className="flex flex-col gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() =>
                onCategoryChange(selectedCategory === cat.id ? null : cat.id)
              }
              className={`text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                selectedCategory === cat.id
                  ? "bg-[#f4c76c] text-white shadow-sm"
                  : "bg-gray-100 hover:bg-[#f9e3b1]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Giá */}
      <div className="mb-6">
        <p className="mb-2 font-medium text-gray-700">Khoảng giá</p>
        <input
          type="range"
          min="0"
          max="15000000"
          step="50000"
          value={priceRange[1]}
          onChange={(e) => onPriceChange([0, Number(e.target.value)])}
          className="w-full accent-[#f4c76c]"
        />
        <p className="text-sm text-gray-600">
          Tối đa: {priceRange[1].toLocaleString()}₫
        </p>
      </div>

      {/* Sắp xếp */}
      <div>
        <p className="mb-2 font-medium text-gray-700">Sắp xếp theo</p>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full p-2 border rounded-lg bg-white focus:ring-2 focus:ring-[#f4c76c] focus:outline-none"
        >
          <option value="featured">Nổi bật</option>
          <option value="price-low">Giá thấp đến cao</option>
          <option value="price-high">Giá cao đến thấp</option>
          <option value="rating">Đánh giá cao</option>
        </select>
      </div>
    </aside>
  );
};

export default ProductFilter;
