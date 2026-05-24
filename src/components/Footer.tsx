import React from "react";
import { 
  Facebook, Youtube, Linkedin, ArrowRight, Paintbrush, 
  MapPin, Phone, Mail, Clock 
} from "lucide-react";

interface FooterProps {
  onNewsletterSubmit: (email: string) => void;
  onLinkTabClick: (tabId: string) => void;
}

export default function Footer({ onNewsletterSubmit, onLinkTabClick }: FooterProps) {
  const [email, setEmail] = React.useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    onNewsletterSubmit(email);
    setEmail("");
    alert("Cảm ơn anh/chị đã đăng ký nhận bảng tin khuyến mãi và cập nhật dòng sơn Colora mới nhất!");
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs sm:text-sm border-t border-slate-850">
      
      {/* Top Footer Detailed Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          
          {/* Left Column: Branding Logos (Col Span 4) */}
          <div className="md:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 flex-shrink-0">
                <div className="absolute top-0 left-0 w-5 h-5 rounded-full border border-emerald-400 bg-transparent opacity-90 animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full border border-amber-500 bg-transparent opacity-90"></div>
                <div className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-cyan-400"></div>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg sm:text-xl font-black tracking-wider text-white">COLORA</span>
                <span className="text-[9px] tracking-[5px] font-light text-slate-400 text-center uppercase -mt-0.5 pl-1">PAINT</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Colora cam kết mang đến những sản phẩm sơn và chất phủ đạt tiêu chuẩn chất lượng cao nhất của CHLB Đức, nâng tầm vẻ đẹp bền bỉ vượt trôi cùng sức khỏe hạnh phúc của mọi gia đình Việt.
            </p>

            {/* Social media icons mirroring the photograph */}
            <div className="flex items-center gap-3.5 pt-2">
              <span className="p-2.5 rounded-xl bg-slate-900 border border-slate-805 hover:bg-slate-800 hover:text-emerald-400 hover:-translate-y-0.5 transition-all text-slate-300 cursor-pointer">
                <Facebook className="w-4.5 h-4.5" />
              </span>
              <span className="p-2.5 rounded-xl bg-slate-900 border border-slate-805 hover:bg-slate-800 hover:text-emerald-400 hover:-translate-y-0.5 transition-all text-slate-300 cursor-pointer">
                <Youtube className="w-4.5 h-4.5" />
              </span>
              <span className="p-2.5 rounded-xl bg-slate-900 border border-slate-805 hover:bg-slate-800 hover:text-emerald-400 hover:-translate-y-0.5 transition-all text-slate-300 cursor-pointer">
                <Linkedin className="w-4.5 h-4.5" />
              </span>
              <span className="p-2.5 rounded-xl bg-slate-900 border border-slate-805 hover:bg-slate-800 hover:text-emerald-400 hover:-translate-y-0.5 transition-all text-slate-300 cursor-pointer">
                {/* TikTok style music icon */}
                <Paintbrush className="w-4.5 h-4.5" />
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links (Col Span 2) */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-white text-xs font-black tracking-widest uppercase">Liên kết nhanh</h4>
            <ul className="space-y-2.5 text-xs text-slate-450">
              {[
                { label: "Sản phẩm", id: "products" },
                { label: "Giải pháp", id: "solutions" },
                { label: "Dự án", id: "projects" },
                { label: "Bảng màu online", id: "colors" },
                { label: "Tin tức", id: "home" },
                { label: "Liên hệ", id: "home" }
              ].map((link, ix) => (
                <li key={ix}>
                  <button 
                    onClick={() => onLinkTabClick(link.id)}
                    className="hover:text-white transition-colors cursor-pointer text-left block"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Care Policy (Col Span 3) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-white text-xs font-black tracking-widest uppercase">Hỗ trợ khách hàng</h4>
            <ul className="space-y-2.5 text-xs text-slate-450">
              {[
                "Hướng dẫn mua hàng",
                "Chính sách thanh toán",
                "Chính sách giao nhận hàng",
                "Chính sách đổi trả màu sơn",
                "Câu hỏi thường gặp (FAQ)",
                "Quy trình bảo hành 15 năm"
              ].map((policy, ix) => (
                <li key={ix}>
                  <p className="hover:text-white cursor-pointer transition-colors">
                    {policy}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter / Subscription input (Col Span 3) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-white text-xs font-black tracking-widest uppercase">Đăng ký nhận tin</h4>
            <div className="space-y-3">
              <p className="text-xs text-slate-400 leading-relaxed">
                Nhận thông tin sản phẩm mới, bảng màng sơn độc quyền và ưu đãi sớm đặc biệt từ Colora.
              </p>
              
              <form onSubmit={handleSubscribe} className="flex relative bg-slate-900 border border-slate-800 p-1.5 rounded-xl focus-within:border-emerald-400">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email của bạn..."
                  className="bg-transparent flex-1 px-3 outline-none text-slate-200 placeholder-slate-650 text-xs"
                  required
                />
                <button
                  type="submit"
                  className="p-2.5 bg-emerald-405 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-transform hover:scale-105 cursor-pointer"
                  title="Gửi"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>

      {/* Corporate address block bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-slate-900 grid grid-cols-1 md:grid-cols-3 gap-4 text-[10px] text-slate-550">
        <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" /> Trụ sở chính: Tầng 15, Cao ốc Colora, Thảo Điền, Quận 2, TPHCM</p>
        <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" /> Liên hệ tư vấn: 1800 6006 • Hotline đại lý: 091 122 3344</p>
        <p className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" /> Thời gian làm việc: Thứ 2 - Thứ 7 (08:00 - 17:30)</p>
      </div>

      {/* Bottom Copyright bar and Credits */}
      <div className="bg-slate-1000 py-5 text-[10px] tracking-wide border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 font-medium select-none">
          <p>© 2026 Colora Paint. Tất cả quyền được bảo lưu.</p>
          <p className="flex items-center gap-1">
            <span>Thiết kế kĩ thuật bởi</span> 
            <strong className="text-slate-450 font-bold">Colora Build Team</strong>
          </p>
        </div>
      </div>

    </footer>
  );
}
