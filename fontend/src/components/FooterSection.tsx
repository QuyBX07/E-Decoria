import { Facebook, Instagram, Twitter, Mail } from "lucide-react";

const FooterSection: React.FC = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold">Décor Studio</h3>
            <p className="opacity-80">
              Mang vẻ đẹp và phong cách vào không gian sống của bạn.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h4 className="font-semibold">Về chúng tôi</h4>
            <ul className="space-y-2 opacity-80">
              <li>
                <a href="#" className="transition hover:opacity-100">
                  Câu chuyện của chúng tôi
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:opacity-100">
                  Sứ mệnh
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:opacity-100">
                  Đội ngũ
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h4 className="font-semibold">Hỗ trợ</h4>
            <ul className="space-y-2 opacity-80">
              <li>
                <a href="#" className="transition hover:opacity-100">
                  Liên hệ
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:opacity-100">
                  Câu hỏi thường gặp
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:opacity-100">
                  Chính sách bảo mật
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h4 className="font-semibold">Theo dõi chúng tôi</h4>
            <div className="flex gap-4">
              <a href="#" className="transition hover:opacity-80">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="transition hover:opacity-80">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="transition hover:opacity-80">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="transition hover:opacity-80">
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between pt-8 text-sm border-t border-primary-foreground/20 md:flex-row opacity-80">
          <p>&copy; 2025 Décor Studio. Tất cả quyền được bảo lưu.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="transition hover:opacity-100">
              Điều khoản sử dụng
            </a>
            <a href="#" className="transition hover:opacity-100">
              Chính sách bảo mật
            </a>
            <a href="#" className="transition hover:opacity-100">
              Chính sách cookie
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default FooterSection;
