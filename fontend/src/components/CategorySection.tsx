import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { getCategories } from "@services/ProductService";
import { Category } from "@/types/Products";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CategorySection: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCategories()
      .then((data) => setCategories(data.slice(0, 6))) // lấy 6 category đầu nếu muốn
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="py-10 text-center">Đang tải danh mục...</p>;
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // desktop
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024, // tablet
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640, // mobile
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className="py-16 md:py-24 bg-amber-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <h2 className="mb-12 font-serif text-3xl font-bold text-center md:text-4xl text-amber-900">
          Danh mục sản phẩm
        </h2>

        <Slider {...settings}>
          {categories.map((category) => (
            <div key={category.id} className="px-2">
              <div className="relative h-64 overflow-hidden transition-shadow shadow-sm cursor-pointer rounded-xl group hover:shadow-lg">
                <img
                  src={category.imageCategory || "/placeholder.svg"}
                  alt={category.name}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex flex-col justify-end p-6 transition-colors duration-300 bg-gradient-to-t from-black/70 via-black/40 to-transparent group-hover:from-black/80">
                  <h3 className="mb-1 font-serif text-2xl font-semibold text-amber-50">
                    {category.name}
                  </h3>
                  {/* <p className="text-amber-100/80">
                    {category.count || "0 sản phẩm"}
                  </p> */}
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default CategorySection;
