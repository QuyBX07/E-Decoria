export interface Category {
  id: string; // UUID
  name: string;
  description?: string;
  imageCategory: string;
}

export interface Product {
  id: string; // UUID
  name: string;
  categoryId: string;
  price: number;
  imageUrl: string;
  description?: string;
  stock?: number;
  color?: string;
  material?: string;
  style?: string;
}

export interface ProductCardProps {
  product: Product;
}

export interface ProductGridProps {
  products: Product[];
}

export interface ProductFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

export interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
}
