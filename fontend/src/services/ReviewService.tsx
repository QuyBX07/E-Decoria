// services/ReviewService.ts
import axios from "axios";
import {
  ReviewRequestDTO,
  ReviewResponseDTO,
  AverageRatingDTO,
} from "@/types/Review";

const BASE_URL = "http://localhost:8081/api/reviews";

// Lấy token từ localStorage (dành cho API cần auth)
function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// 🧩 Tạo review (cần đăng nhập)
export const createReview = async (
  review: ReviewRequestDTO
): Promise<ReviewResponseDTO> => {
  const res = await axios.post<ReviewResponseDTO>(BASE_URL, review, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });
  return res.data;
};

// 🧩 Lấy review theo product (không cần auth)
export const getReviewsByProduct = async (
  productId: string
): Promise<ReviewResponseDTO[]> => {
  const res = await axios.get<ReviewResponseDTO[]>(
    `${BASE_URL}/product/${productId}`
  );
  return res.data;
};

// 🧩 Lấy trung bình rating (không cần auth)
export const getAverageRatingByProduct = async (
  productId: string
): Promise<AverageRatingDTO> => {
  const res = await axios.get<AverageRatingDTO>(
    `${BASE_URL}/product/${productId}/average`
  );
  return res.data;
};
