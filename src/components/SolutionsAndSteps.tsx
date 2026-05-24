import React from "react";
import { 
  ArrowRight, Check, ShieldCheck, DollarSign, Clock, BookOpen,
  CreditCard, RefreshCw, Truck, MessageSquare, ChevronRight
} from "lucide-react";

interface SolutionsAndStepsProps {
  onQuoteClick: () => void;
}

export default function SolutionsAndSteps({ onQuoteClick }: SolutionsAndStepsProps) {
  const steps = [
    {
      num: "01",
      title: "Chọn sản phẩm",
      desc: "Dễ dàng tìm kiếm và lựa chọn sản phẩm phù hợp với nhu cầu sơn sửa."
    },
    {
      num: "02",
      title: "Thêm vào giỏ",
      desc: "Kiểm tra kỹ lưỡng giỏ hàng của bạn và điều chỉnh số lượng phù hợp."
    },
    {
      num: "03",
      title: "Thanh toán",
      desc: "Thanh toán online tiện lợi hoặc chọn thanh toán trực tiếp khi nhận hàng."
    },
    {
      num: "04",
      title: "Theo dõi đơn hàng",
      desc: "Cập nhật tiến trình sản xuất, đóng gói và lộ trình giao nhận thời gian thực."
    }
  ];

  const valueTrusters = [
    {
      icon: <CreditCard className="w-6 h-6 text-emerald-400" />,
      title: "Thanh toán linh hoạt",
      desc: "Nhiều hình thức tiện lợi: Thẻ visa/atm, chuyển khoản nhanh, ví điện tử hoặc nhận hàng COD."
    },
    {
      icon: <RefreshCw className="w-6 h-6 text-amber-400" />,
      title: "Đổi trả dễ dàng",
      desc: "Hỗ trợ đổi trả, bù màu miễn phí trong vòng 7 ngày nếu sản phẩm giao sai màu hoặc phát hiện lỗi."
    },
    {
      icon: <Truck className="w-6 h-6 text-emerald-500" />,
      title: "Giao hàng nhanh",
      desc: "Giao hàng tận nơi toàn quốc từ 1-3 ngày làm việc, đảm bảo tiến độ thi công đúng hẹn dự án."
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-blue-400" />,
      title: "Tư vấn chuyên sâu",
      desc: "Đội ngũ kỹ thuật hỗ trợ khảo sát mặt tường thực trạng & tư vấn chọn dòng sơn tối ưu."
    }
  ];

  return (
    <div className="space-y-20 scroll-mt-24" id="solutions-section">
      
      {/* 1. Solutions for Enterprises / Contractors */}
      <div className="bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative">
        <div className="absolute inset-0 bg-radial-gradient from-emerald-950/20 via-transparent to-transparent opacity-50 pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Left Text */}
          <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 flex flex-col justify-center space-y-6">
            <span className="text-xs sm:text-sm font-bold tracking-[0.2em] text-emerald-400 uppercase">
              UƯ ĐÃI ĐẶC BIỆT CHO ĐƠN HÀNG LỚN
            </span>
            
            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              Giải pháp cho <br className="hidden sm:inline" />
              doanh nghiệp & nhà thầu
            </h2>

            <ul className="space-y-4">
              {[
                "Chiết khấu siêu hấp dẫn theo quy mô dự án",
                "Hỗ trợ kỹ thuật thực địa & chuyên ban tư vấn phối màu riêng biệt",
                "Báo giá nhanh chóng trong vòng 2 giờ nhận yêu cầu",
                "Giao hàng nhanh trực tiếp từ nhà máy tới tận công trình"
              ].map((text, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="p-0.5 rounded-full bg-emerald-500/20 text-emerald-400 mt-1">
                    <Check className="w-4 h-4 stroke-[3px]" />
                  </div>
                  <span className="text-sm sm:text-base text-slate-300 font-medium">
                    {text}
                  </span>
                </li>
              ))}
            </ul>

            <button
              onClick={onQuoteClick}
              className="group flex items-center gap-2 bg-emerald-400 text-slate-950 hover:bg-emerald-300 font-bold px-6 py-3.5 rounded-xl transition-all self-start shadow-md cursor-pointer active:scale-98"
            >
              Nhận báo giá ngay
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Right Visual Image & overlay mockup */}
          <div className="lg:col-span-6 min-h-[300px] lg:min-h-full bg-slate-900 relative flex items-center justify-center p-8 border-t lg:border-t-0 lg:border-l border-slate-800">
            {/* Engineer shaking hand style geometric construct */}
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/60 to-transparent z-10" />
            <div className="absolute top-[10%] left-[10%] w-[80%] h-[80%] border border-dashed border-slate-800 rounded-2xl pointer-events-none" />
            
            {/* Architectural grid design mimic */}
            <div className="absolute bottom-[20%] right-[10%] w-36 h-36 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 rounded-full blur-2xl pointer-events-none" />

            {/* Float blocks matching exact overlay in photograph */}
            <div className="relative z-20 grid grid-cols-2 gap-4 w-full max-w-[420px]">
              
              <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-2xl flex items-center gap-3 backdrop-blur shadow-xl hover:border-emerald-500/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400 border border-emerald-500/10">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs text-slate-400 font-semibold uppercase">Chiết khấu</h4>
                  <p className="text-sm font-black text-white">Đến 25%</p>
                </div>
              </div>

              <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-2xl flex items-center gap-3 backdrop-blur shadow-xl hover:border-emerald-500/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center text-orange-400 border border-orange-500/10">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs text-slate-400 font-semibold uppercase">Công nợ</h4>
                  <p className="text-sm font-black text-white">Linh hoạt</p>
                </div>
              </div>

              <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-2xl flex items-center gap-3 backdrop-blur shadow-xl hover:border-emerald-500/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center text-cyan-400 border border-cyan-500/10">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs text-slate-400 font-semibold uppercase">Hỗ trợ</h4>
                  <p className="text-sm font-black text-white">24/7 tức thì</p>
                </div>
              </div>

              <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-2xl flex items-center gap-3 backdrop-blur shadow-xl hover:border-emerald-500/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-500 border border-emerald-500/10">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs text-slate-400 font-semibold uppercase">Kỹ thuật</h4>
                  <p className="text-sm font-black text-white">Đào tạo bài bản</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* 2. Step purchase process */}
      <div className="space-y-12">
        <div className="space-y-2 text-center max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Mua hàng dễ dàng
          </h2>
          <p className="text-sm text-slate-500">
            Quy trình khép kín, tối giản hóa trải nghiệm đặt hàng thiết kế công trình
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative select-none">
          {steps.map((st, i) => (
            <div key={i} className="relative flex flex-col bg-slate-50 rounded-3xl p-6 border border-slate-100 hover:bg-white hover:shadow-lg transition-all duration-300">
              {/* Chevron connectors (desktop only) */}
              {i < 3 && (
                <div className="hidden md:flex absolute top-1/2 -right-4 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white border border-slate-105 items-center justify-center shadow-sm">
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </div>
              )}
              
              <div className="space-y-4">
                <span className="text-3xl font-black text-emerald-400 opacity-60">
                  {st.num}
                </span>
                
                <h3 className="font-extrabold text-slate-950 text-base">
                  {st.title}
                </h3>
                
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 4 Bottom value trusts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-8 border-t border-slate-100">
          {valueTrusters.map((vt, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex-shrink-0">
                {vt.icon}
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">
                  {vt.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {vt.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
