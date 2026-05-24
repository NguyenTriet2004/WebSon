import React from "react";
import { ArrowRight, Shield, Sparkles, HeartPulse, Leaf, FileText } from "lucide-react";

import paintCanInterior from "../assets/images/paint_can_interior_1779548224098.png";
import paintCanExterior from "../assets/images/paint_can_exterior_1779548243373.png";
import paintCanSpecialty from "../assets/images/paint_can_specialty_1779548279568.png";
import villaExteriorBg from "../assets/images/villa_exterior_bg_1779548854305.png";

interface HeroProps {
  onBuyNowClick: () => void;
  onQuoteClick: () => void;
}

export default function Hero({ onBuyNowClick, onQuoteClick }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white min-h-[550px] lg:min-h-[680px] flex items-center pt-10 pb-12 sm:pt-16 sm:pb-20">
      {/* Full Hero Background Villa Image covering the whole container */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <img 
          src={villaExteriorBg} 
          alt="Modern luxury architectural background" 
          className="w-full h-full object-cover object-center lg:object-right opacity-35 lg:opacity-75"
          referrerPolicy="no-referrer"
        />
        {/* Rich brand coloring and ambient dark gradients matching the exact reference aesthetic */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/75 lg:via-slate-950/40 to-slate-950/10" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-1/5 bg-gradient-to-b from-slate-950 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6 sm:space-y-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.25em] text-emerald-400 uppercase">
                <Shield className="w-3.5 h-3.5" /> SƠN CAO CẤP – BỀN MÀU VƯỢT THỜI GIAN
              </span>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
                Sắc màu tạo nên <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
                  giá trị vững bền
                </span>
              </h1>
              
              <p className="text-base sm:text-lg text-slate-350 leading-relaxed max-w-xl">
                Colora cung cấp các giải pháp sơn chất lượng cao cho mọi công trình – từ không gian sống gia đình đến những dự án đại đô thị mang tầm vóc tương lai.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={onBuyNowClick}
                className="group flex items-center gap-2.5 bg-white text-slate-950 font-bold px-7 py-4 rounded-xl shadow-lg hover:shadow-emerald-500/10 hover:bg-emerald-300 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Mua hàng ngay
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              
              <button
                onClick={onQuoteClick}
                className="flex items-center gap-2 border-2 border-slate-700 text-white hover:border-emerald-400 hover:text-emerald-400 font-bold px-6 py-3.5 rounded-xl transition-all cursor-pointer bg-slate-900/40 backdrop-blur-sm"
              >
                <FileText className="w-4 h-4" />
                Nhận báo giá (B2B)
              </button>
            </div>

            {/* Four values / trust factors underneath */}
            <div className="grid grid-cols-2 gap-4 lg:gap-6 pt-6 border-t border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-bold text-white leading-snug">Chất lượng quốc tế</span>
                  <span className="text-[10px] text-slate-400">Công nghệ CHLB Đức</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-bold text-white leading-snug">Bền màu vượt trội</span>
                  <span className="text-[10px] text-slate-400">Bảo hành tới 15 năm</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-bold text-white leading-snug">An toàn cho sức khỏe</span>
                  <span className="text-[10px] text-slate-400">Hàm lượng VOC cực thấp</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                  <Leaf className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-bold text-white leading-snug">Thân thiện môi trường</span>
                  <span className="text-[10px] text-slate-400">Phân hủy sinh học</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Visuals */}
          <div className="lg:col-span-6 relative w-full flex items-end justify-center lg:justify-end min-h-[350px] sm:min-h-[460px]">
            {/* Cans visual stage overlay with real generated high-fidelity products, now resting directly on full backdrop */}
            <div className="relative z-20 flex items-end justify-center gap-2 sm:gap-4 md:gap-5 w-full max-w-[480px] lg:mr-4 select-none px-4 pt-16">
              
              {/* Can 1: Premium Interior */}
              <div className="relative group flex flex-col items-center transform hover:-translate-y-4 transition-all duration-500 cursor-pointer w-[30%]">
                <div className="w-full aspect-[4/5] bg-gradient-to-b from-slate-900/85 to-indigo-950/40 rounded-2xl border border-slate-800 p-0 flex items-center justify-center relative overflow-hidden group shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent pointer-events-none z-10" />
                  <img
                    src={paintCanInterior}
                    alt="Sơn nội thất Pure White"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover filter drop-shadow-[0_15px_20px_rgba(0,0,0,0.4)] transform group-hover:scale-105 group-hover:rotate-1 transition-transform duration-500"
                  />
                </div>
                <span className="text-[9px] font-extrabold text-cyan-400 mt-2 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/20 shadow-sm whitespace-nowrap">Nội thất</span>
              </div>

              {/* Can 2: Premium Exterior */}
              <div className="relative group flex flex-col items-center transform hover:-translate-y-5 transition-all duration-500 cursor-pointer w-[36%] z-10 -mt-8">
                {/* Popularity Badge */}
                <span className="absolute -top-6 bg-amber-500 text-slate-950 font-black text-[8px] sm:text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-md animate-bounce z-20">
                  Bán chạy
                </span>
                
                <div className="w-full aspect-[4/5] bg-gradient-to-b from-slate-900/85 to-amber-950/40 rounded-2xl border border-amber-800 p-0 flex items-center justify-center relative overflow-hidden group shadow-[0_20px_45px_rgba(0,0,0,0.8)]">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none z-10" />
                  <img
                    src={paintCanExterior}
                    alt="Sơn ngoại thất Max Shield"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.5)] transform group-hover:scale-105 group-hover:-rotate-1 transition-transform duration-500"
                  />
                </div>
                <span className="text-[10px] font-extrabold text-amber-400 mt-2 bg-amber-950 px-2.5 py-0.5 rounded border border-amber-500/20 shadow-sm whitespace-nowrap">Ngoại thất</span>
              </div>

              {/* Can 3: Specialty Coatings */}
              <div className="relative group flex flex-col items-center transform hover:-translate-y-4 transition-all duration-500 cursor-pointer w-[30%]">
                <div className="w-full aspect-[4/5] bg-gradient-to-b from-slate-900/85 to-slate-950/40 rounded-2xl border border-slate-800 p-0 flex items-center justify-center relative overflow-hidden group shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-500/10 via-transparent to-transparent pointer-events-none z-10" />
                  <img
                    src={paintCanSpecialty}
                    alt="Sơn sàn Epoxy Floor"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover filter drop-shadow-[0_15px_20px_rgba(0,0,0,0.4)] transform group-hover:scale-105 group-hover:rotate-1 transition-transform duration-500"
                  />
                </div>
                <span className="text-[9px] font-extrabold text-emerald-300 mt-2 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/20 shadow-sm whitespace-nowrap">Chuyên dụng</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
