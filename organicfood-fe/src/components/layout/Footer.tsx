import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import logo from "../../assets/logo.png";
import { SiFacebook, SiYoutube } from "react-icons/si";

const FOOTER_LINKS = [
  {
    title: "Về chúng tôi",
    links: [
      { label: "Giới thiệu", href: "/pages/gioi-thieu" },
      { label: "Chứng nhận hữu cơ", href: "/pages/chung-nhan-huu-co" },
      { label: "Doanh nghiệp do phụ nữ làm chủ", href: "/pages/about" },
      { label: "Blog / Tin tức", href: "/blogs/news" },
    ],
  },
  {
    title: "Chính sách",
    links: [
      { label: "Chính sách đổi trả", href: "/pages/chinh-sach-doi-tra" },
      { label: "Chính sách bảo mật", href: "/pages/chinh-sach-bao-mat" },
      { label: "Điều khoản sử dụng", href: "/pages/dieu-khoan" },
      { label: "Chính sách vận chuyển", href: "/pages/van-chuyen" },
    ],
  },
  {
    title: "Hỗ trợ",
    links: [
      { label: "Hướng dẫn mua hàng", href: "/pages/huong-dan-mua-hang" },
      { label: "Hàng sỉ giá tốt", href: "/pages/hang-si" },
      { label: "Gói thành viên", href: "/collections/goi-thanh-vien" },
      { label: "Câu hỏi thường gặp", href: "/pages/faq" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-neutral-800 text-neutral-300 mt-10">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-12 py-12">
        <div className="grid grid-cols-4 gap-10">
          {/* Cột 1: Brand */}
          <div className="col-span-1">
            <Link to="/">
              <img
                src={logo}
                alt="Organicfood.vn"
                className="h-14 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-sm mt-4 leading-relaxed text-neutral-400">
              Sứ mệnh của Organicfood.vn là giúp mọi người dễ dàng tiếp cận với
              thực phẩm hữu cơ, tự nhiên và an toàn cho sức khỏe.
            </p>

            {/* Mạng xã hội */}
            <div className="flex gap-3 mt-5">
              <a
                href="https://facebook.com/organicfood.vn"
                target="_blank"
                rel="noreferrer"
                className="bg-neutral-700 hover:bg-primary-500 text-white rounded-full p-2 transition-colors"
              >
                <SiFacebook size={18} />
              </a>

              <a
                href="https://youtube.com/@organicfood"
                target="_blank"
                rel="noreferrer"
                className="bg-neutral-700 hover:bg-primary-500 text-white rounded-full p-2 transition-colors"
              >
                <SiYoutube size={18} />
              </a>
            </div>
          </div>

          {/* Cột 2-4: Links */}
          {FOOTER_LINKS.map((group) => (
            <div key={group.title}>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wide mb-4">
                {group.title}
              </h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-neutral-400 hover:text-primary-500 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Liên hệ */}
        <div className="border-t border-neutral-700 mt-10 pt-8 flex gap-10">
          <div className="flex items-center gap-3 flex-[2]">
            <MapPin size={16} className="text-primary-500 shrink-0" />
            <p className="text-sm text-neutral-400">
              63 Trần Đình Xu, Phường Cô Giang, Quận 1, TP. Hồ Chí Minh
            </p>
          </div>
          <div className="flex items-center gap-3 flex-[1]">
            <Phone size={16} className="text-primary-500 shrink-0" />
            <a
              href="tel:02873071088"
              className="text-sm text-neutral-400 hover:text-primary-500 transition-colors"
            >
              028 7307 1088
            </a>
          </div>
          <div className="flex items-center gap-3 flex-[1]">
            <Mail size={16} className="text-primary-500 shrink-0" />
            <a
              href="mailto:info@organicfood.vn"
              className="text-sm text-neutral-400 hover:text-primary-500 transition-colors"
            >
              info@organicfood.vn
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-neutral-700 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-12 py-4 flex items-center justify-between">
          <p className="text-xs text-neutral-500">
            © 2026 Organicfood.vn – Cửa hàng thực phẩm hữu cơ. All rights
            reserved.
          </p>
          <p className="text-xs text-neutral-500">
            Thiết kế bởi{" "}
            <span className="text-primary-400">Organicfood Team</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
