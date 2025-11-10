import React from "react";

const Newsletter: React.FC = () => {
  return (
    <section className="py-16 text-center bg-amber-100">
      <h2 className="mb-4 text-3xl font-semibold">Nhận ưu đãi đặc biệt</h2>
      <p className="mb-6 text-gray-600">
        Đăng ký nhận thông tin giảm giá & sản phẩm mới.
      </p>
      <div className="flex justify-center">
        <input
          type="email"
          placeholder="Nhập email của bạn"
          className="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none"
        />
        <button className="px-6 py-2 text-white bg-amber-500 rounded-r-md hover:bg-amber-600">
          Đăng ký
        </button>
      </div>
    </section>
  );
};

export default Newsletter;
