import { Product, Category } from "@/types/Products";

const BASE_URL = "http://localhost:8081/api";

// Lấy tất cả sản phẩm
export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/products`);
  if (!res.ok) throw new Error("Failed to fetch products");

  const data: Product[] = await res.json();

  // fallback image nếu backend chưa có
  return data.map((p) => ({
    ...p,
    imageUrl: p.imageUrl || "/placeholder.svg",
  }));
}

// Lấy sản phẩm theo id
export async function getProductById(id: string): Promise<Product | null> {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  if (!res.ok) return null;

  const data: Product = await res.json();
  return {
    ...data,
    imageUrl: data.imageUrl || "/placeholder.svg",
  };
}

// Lấy tất cả danh mục
export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE_URL}/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");

  const data: Category[] = await res.json();
  return data;
}

// Lọc sản phẩm dựa trên category, price và sort
export async function getFilteredProducts(
  selectedCategory: string | null,
  priceRange: [number, number],
  sortBy: string
): Promise<Product[]> {
  let result = await getProducts(); // lấy tất cả sản phẩm từ backend

  if (selectedCategory) {
    result = result.filter((p) => p.categoryId === selectedCategory);
  }

  result = result.filter(
    (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
  );

  switch (sortBy) {
    case "price-low":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      result.sort((a, b) => b.price - a.price);
      break;
  }

  return result;
}

// Lấy sản phẩm liên quan dựa trên productId
export async function getRelatedProducts(
  productId: string
): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/products/${productId}/related`);
  if (!res.ok) throw new Error("Failed to fetch related products");

  const data: Product[] = await res.json();
  return data.map((p) => ({
    ...p,
    imageUrl: p.imageUrl || "/placeholder.svg",
  }));
}
