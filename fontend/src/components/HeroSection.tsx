import React from "react";
import { Button } from "@components/ui/button";

const HeroSection: React.FC = () => {
  return (
    <section className="relative py-20 bg-gradient-to-b from-secondary to-background md:py-32">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* Left Content */}
          <div className="space-y-6">
            <h2 className="font-serif text-4xl font-bold md:text-5xl text-foreground text-balance">
              Biến không gian của bạn thành tác phẩm nghệ thuật
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Khám phá bộ sưu tập độc đáo các sản phẩm trang trí nội thất được
              thiết kế tỉ mỉ. Từ những chiếc gối trang trí đến các tác phẩm nghệ
              thuật tường, chúng tôi có mọi thứ để làm cho ngôi nhà của bạn trở
              nên đặc biệt.
            </p>
            <div className="flex gap-4 pt-4">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Khám phá ngay
              </Button>
              <Button variant="outline">Tìm hiểu thêm</Button>
            </div>
          </div>

          {/* Right Image */}

          <div className="relative h-96 md:h-full">
            <img
              src="/images/lamp.png"
              alt="Trang trí nội thất hiện đại"
              className="object-cover w-full h-full rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
