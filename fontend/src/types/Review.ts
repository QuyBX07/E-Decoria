export interface ReviewRequestDTO {
  productId: string;
  orderId: string;
  rating: number;    // 1-5
  comment?: string;
}

export interface ReviewResponseDTO {
  id: string;
  productId: string;
  orderId: string;
  userId: string;
  username: string;  
  rating: number;
  comment?: string;
  createdAt: string;  // ISO string
}


export interface AverageRatingDTO {
  productId: string;
  averageRating: number;
  reviewCount: number;
}