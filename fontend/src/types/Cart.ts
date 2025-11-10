export interface CartItemRequestDTO {
  productId: string;
  quantity: number;
}

export interface CartItemResponseDTO {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}
