export interface ChatMessage {
  role: "user" | "bot";
  reply?: string;
  intent?: string;
  data?: ChatData;
}

export interface ChatData {
  products?: ChatProduct[] | null;
  reviews?: ChatReviewData | null;
  vouchers?: ChatVoucher[] | null;
}


export interface ChatProduct {
  id: string;
  name: string;
  price: number;
  image_url: string;
}

export interface ChatReviewData {
  avg_rating: string;
  reviews: {
    rating: number;
    comment: string;
    created_at: string;
  }[];
}

export interface ChatVoucher {
  code: string;
  description: string;
  discount_type: "PERCENT" | "FIXED";
  discount_value: string;
  min_order_value: string;
  start_date: string;
  end_date: string;
}

