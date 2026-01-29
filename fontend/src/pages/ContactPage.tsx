import HeaderSection from "@components/HeaderSection";
import FooterSection from "@components/FooterSection";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf8f3] via-[#fffaf6] to-[#f7efe7]">
      <HeaderSection />

      <main className="max-w-6xl px-4 py-20 mx-auto">
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* Nội dung */}
          <div>
            <h1 className="mb-4 text-4xl font-bold text-gray-800 font-display">
              Liên hệ với <span className="text-amber-600">Decoria</span>
            </h1>
            <p className="mb-8 text-gray-600">
              Nếu bạn cần tư vấn sản phẩm, hỗ trợ đặt hàng hoặc có bất kỳ thắc
              mắc nào, đừng ngần ngại liên hệ với chúng tôi.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-soft">
                <span className="text-xl">📞</span>
                <div>
                  <p className="text-sm text-gray-500">Số điện thoại</p>
                  <p className="font-semibold text-gray-800">0353 248 808</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-soft">
                <span className="text-xl">✉️</span>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold text-gray-800">
                    duyquybaixa@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Hình ảnh / trang trí */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
              alt="Contact decor"
              className="h-[360px] w-full rounded-3xl object-cover shadow-lg"
            />
            <div className="absolute px-5 py-4 bottom-6 left-6 rounded-2xl bg-white/90 backdrop-blur">
              <p className="text-lg font-semibold text-gray-800 font-display">
                Decoria
              </p>
              <p className="text-sm text-gray-600">
                Trang trí không gian – nâng tầm cảm xúc
              </p>
            </div>
          </div>
        </div>
      </main>

      <FooterSection />
    </div>
  );
};

export default ContactPage;
