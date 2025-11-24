import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { ReviewRequestDTO, ReviewResponseDTO } from "@/types/Review";
import { createReview, getReviewsByProduct } from "@/services/ReviewService";
import { AxiosError, isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import HeaderSection from "@/components/HeaderSection";

interface BackendError {
  message?: string;
  error?: string;
}

export interface ReviewPageProps {
  productId: string;
  orderId: string;
  orderStatus: string; // "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED"
}

const ReviewPage: React.FC<ReviewPageProps> = ({
  productId,
  orderId,
  orderStatus,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [reviews, setReviews] = useState<ReviewResponseDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const canReview = ["DELIVERED", "CONFIRMED"].includes(orderStatus);

  const navigate = useNavigate();

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const data = await getReviewsByProduct(productId);
        setReviews(data);
      } catch (err) {
        console.error(err);
        Swal.fire("Lỗi", "Không thể tải đánh giá", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [productId]);

  const handleSubmit = async () => {
    const reviewRequest: ReviewRequestDTO = {
      productId,
      orderId,
      rating,
      comment,
    };
    try {
      await createReview(reviewRequest);
      Swal.fire("Thành công", "Đã gửi đánh giá!", "success");
      setComment("");
      setRating(5);
      const data = await getReviewsByProduct(productId);
      setReviews(data);
    } catch (err: unknown) {
      let message = "Không thể gửi đánh giá";
      if (isAxiosError(err)) {
        const axiosErr = err as AxiosError<BackendError>;
        message =
          axiosErr.response?.data?.message ||
          axiosErr.response?.data?.error ||
          axiosErr.message ||
          message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      Swal.fire("Lỗi", message, "error");
    }
  };

  const renderStars = (score: number) => (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-xl mr-1 ${
            star <= score ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );

  return (
    <>
      <HeaderSection />
      <div className="w-full min-h-screen p-6 bg-gray-100">
        {/* Thanh nút trên cùng */}
        <div className="flex gap-3 mb-6">
          <button
            className="px-4 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-700"
            onClick={() => navigate(-1)}
          >
            ← Về trang trước
          </button>
          <button
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            onClick={() => navigate(`/products/${productId}`)}
          >
            Xem sản phẩm
          </button>
          <button
            className="px-4 py-2 ml-auto text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            ⬆ Top
          </button>
        </div>

        <div className="flex flex-col gap-8 mx-auto max-w-7xl lg:flex-row">
          {/* Form đánh giá - bên trái */}
          <div className="w-full p-6 bg-white shadow-lg lg:w-2/3 rounded-xl">
            <h2 className="mb-4 text-2xl font-bold text-gray-800">
              {canReview ? "Viết đánh giá của bạn" : "Đánh giá sản phẩm"}
            </h2>
            {canReview ? (
              <>
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`cursor-pointer text-3xl mr-1 ${
                        star <= rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                      onClick={() => setRating(star)}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <textarea
                  className="w-full p-4 mb-4 border border-gray-300 rounded-lg shadow-sm resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  rows={6}
                  placeholder="Viết nhận xét của bạn..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Gửi đánh giá
                </button>
              </>
            ) : (
              <p className="text-gray-500">
                Chỉ có thể đánh giá sau khi đơn hàng hoàn thành.
              </p>
            )}
          </div>

          {/* Review của người khác - bên phải */}
          <div className="w-full lg:w-1/3 p-4 bg-white shadow-md rounded-xl overflow-y-auto max-h-[80vh]">
            <h3 className="mb-4 text-xl font-semibold text-gray-800">
              Nhận xét của khách hàng
            </h3>
            {loading ? (
              <p>Đang tải...</p>
            ) : reviews.length === 0 ? (
              <p className="text-gray-500">Chưa có đánh giá nào.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div
                    key={r.id}
                    className="p-3 transition border border-gray-200 rounded-lg hover:shadow-md bg-gray-50"
                  >
                    {r.username && (
                      <p className="font-medium text-gray-700">{r.username}</p>
                    )}
                    {renderStars(r.rating)}
                    {r.comment && (
                      <p className="mt-2 text-gray-700">{r.comment}</p>
                    )}
                    <p className="mt-1 text-sm text-gray-400">
                      {new Date(r.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewPage;
