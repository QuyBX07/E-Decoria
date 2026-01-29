import HeaderSection from "@components/HeaderSection";
import FooterSection from "@components/FooterSection";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf8f3] via-[#fffaf6] to-[#f7efe7]">
      <HeaderSection />

      <main className="px-4 py-16 mx-auto max-w-7xl">
        {/* Hero ngắn */}
        <section className="relative overflow-hidden rounded-3xl">
          <img
            src="https://images.unsplash.com/photo-1618220179428-22790b461013"
            alt="Decoria decor"
            className="h-[320px] w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center text-center text-white">
            <div>
              <h1 className="text-4xl font-bold font-display md:text-5xl">
                Về <span className="text-amber-300">Decoria</span>
              </h1>
              <p className="mt-4 text-white/90">
                Trang trí không gian – nâng tầm cảm xúc sống
              </p>
            </div>
          </div>
        </section>

        {/* Nội dung chính */}
        <section className="grid gap-12 mt-14 md:grid-cols-2 md:items-center">
          {/* Text */}
          <div>
            <h2 className="mb-4 font-serif text-2xl font-bold text-gray-800">
              Không gian đẹp bắt đầu từ chi tiết nhỏ
            </h2>
            <p className="leading-relaxed text-gray-600">
              <span className="font-semibold text-gray-800">Decoria</span> là
              nền tảng chuyên về đồ trang trí nội thất và décor phong cách hiện
              đại. Chúng tôi tin rằng một không gian đẹp không cần cầu kỳ, chỉ
              cần đúng chất liệu, đúng màu sắc và đúng cảm xúc.
            </p>
          </div>

          {/* Image */}
          <img
            src="https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a"
            alt="Decor lifestyle"
            className="object-cover w-full h-64 shadow-lg rounded-3xl"
          />
        </section>

        {/* Giá trị cốt lõi */}
        <section className="grid gap-6 mt-14 md:grid-cols-3">
          {[
            {
              title: "Thiết kế tinh tế",
              desc: "Phong cách tối giản, hiện đại, dễ phối không gian.",
            },
            {
              title: "Chất lượng chọn lọc",
              desc: "Chú trọng chất liệu, độ hoàn thiện và cảm giác sử dụng.",
            },
            {
              title: "Trải nghiệm thân thiện",
              desc: "Giao diện đơn giản, mua sắm nhanh chóng và tiện lợi.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="p-6 bg-white rounded-2xl shadow-soft"
            >
              <h3 className="mb-2 text-lg font-semibold text-gray-800">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </section>
      </main>

      <FooterSection />
    </div>
  );
};

export default AboutPage;
