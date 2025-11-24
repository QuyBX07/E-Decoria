// src/pages/reviews/ReviewPageWrapper.tsx
import React from "react";
import { useParams, useLocation } from "react-router-dom";
import ReviewPage, { ReviewPageProps } from "@/pages/reviews/ReviewPage";

const ReviewPageWrapper: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const location = useLocation();

  // lấy state từ navigate, ví dụ: { orderId, orderStatus }
  const state = location.state as {
    orderId: string;
    orderStatus: string;
  } | null;

  // nếu thiếu dữ liệu thì hiển thị thông báo
  if (!productId || !state) {
    return (
      <div className="p-6 text-center text-red-600">
        Không tìm thấy thông tin đánh giá
      </div>
    );
  }

  // trả về ReviewPage với đầy đủ props
  const props: ReviewPageProps = {
    productId,
    orderId: state.orderId,
    orderStatus: state.orderStatus,
  };

  return <ReviewPage {...props} />;
};

export default ReviewPageWrapper;
