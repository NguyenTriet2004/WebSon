import React, { useState } from "react";
import { ArrowRight, Star, ShoppingBag, Eye, Heart, CheckCircle2 } from "lucide-react";
import { Product } from "../types";

// Realistic generated paint can mockups
import paintCanInterior from "../assets/images/paint_can_interior_1779548224098.png";
import paintCanExterior from "../assets/images/paint_can_exterior_1779548243373.png";
import paintCanPrimer from "../assets/images/paint_can_primer_1779548260286.png";
import paintCanSpecialty from "../assets/images/paint_can_specialty_1779548279568.png";

interface CategoriesAndProductsProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
}

export default function CategoriesAndProducts({
  products,
  onAddToCart,
  onSelectCategory,
  selectedCategory
}: CategoriesAndProductsProps) {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  // Helper to map category to real generated asset image
  const getProductImage = (category: string) => {
    switch (category) {
      case "interior":
        return paintCanInterior;
      case "exterior":
        return paintCanExterior;
      case "primer":
        return paintCanPrimer;
      case "specialty":
        return paintCanSpecialty;
      default:
        return paintCanInterior;
    }
  };

  // Category blocks matching the background colors and details in the photo
  const categories = [
    {
      id: "interior",
      name: "Sơn nội thất",
      desc: "Mịn đẹp, không mùi, dễ lau chùi",
      bgColor: "bg-orange-50/80 hover:bg-orange-100/90 border-orange-100",
      textColor: "text-orange-950",
      descColor: "text-orange-850",
      accent: "from-amber-200 to-orange-200",
      iconDetail: (
        <div className="absolute right-3 bottom-3 opacity-30 group-hover:opacity-60 transition-opacity">
          {/* Chair / armchair SVG mockup */}
          <svg className="w-16 h-16 text-orange-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
            <path d="M12 2v10" />
            <path d="M8 8h8" />
            <path d="M3 15h18" />
          </svg>
        </div>
      )
    },
    {
      id: "exterior",
      name: "Sơn ngoại thất",
      desc: "Bền màu, chống thấm, chống bám bẩn",
      bgColor: "bg-sky-50/80 hover:bg-sky-100/90 border-sky-100",
      textColor: "text-sky-950",
      descColor: "text-sky-850",
      accent: "from-cyan-200 to-sky-200",
      iconDetail: (
        <div className="absolute right-3 bottom-3 opacity-30 group-hover:opacity-60 transition-opacity">
          {/* Modern Building architectural line mockup */}
          <svg className="w-16 h-16 text-sky-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="4" y="2" width="16" height="20" rx="1" />
            <line x1="9" y1="6" x2="15" y2="6" strokeDasharray="2 2" />
            <line x1="9" y1="11" x2="15" y2="11" strokeDasharray="2 2" />
            <line x1="9" y1="16" x2="15" y2="16" strokeDasharray="2 2" />
          </svg>
        </div>
      )
    },
    {
      id: "primer",
      name: "Sơn lót",
      desc: "Tăng độ bám dính, độ bền cho lớp phủ",
      bgColor: "bg-emerald-50/80 hover:bg-emerald-100/90 border-emerald-100",
      textColor: "text-emerald-950",
      descColor: "text-emerald-800",
      accent: "from-teal-200 to-emerald-200",
      iconDetail: (
        <div className="absolute right-3 bottom-3 opacity-30 group-hover:opacity-60 transition-opacity">
          {/* Abstract Grid of adhesive cells */}
          <svg className="w-16 h-16 text-emerald-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 4h16v16H4z" />
            <path d="M4 12h16" />
            <path d="M12 4v16" />
          </svg>
        </div>
      )
    },
    {
      id: "specialty",
      name: "Sơn chuyên dụng",
      desc: "Giải pháp cho mọi bề mặt đặc biệt",
      bgColor: "bg-slate-100 hover:bg-slate-200 border-slate-200",
      textColor: "text-slate-950",
      descColor: "text-slate-700",
      accent: "from-zinc-200 to-slate-200",
      iconDetail: (
        <div className="absolute right-3 bottom-3 opacity-30 group-hover:opacity-60 transition-opacity">
          {/* Industrial gear pattern */}
          <svg className="w-16 h-16 text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
        </div>
      )
    }
  ];

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + "đ";
  };

  return (
    <div className="space-y-16">
      
      {/* 1. Category section */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Danh mục sản phẩm
            </h2>
            <p className="text-sm text-slate-500">
              Các giải pháp chất phủ chuyên biệt bảo vệ công trình bền đẹp
            </p>
          </div>
          <button 
            onClick={() => onSelectCategory("all")}
            className="text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-950 transition-colors flex items-center gap-1 group cursor-pointer"
          >
            Xem tất cả
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id === selectedCategory ? "all" : cat.id)}
              className={`group relative p-6 rounded-3xl border cursor-pointer overflow-hidden transition-all duration-300 min-h-[140px] flex flex-col justify-between ${cat.bgColor} ${
                selectedCategory === cat.id 
                  ? "ring-2 ring-emerald-500 ring-offset-2 scale-[1.02] shadow-md"
                  : "hover:shadow-lg hover:-translate-y-1"
              }`}
            >
              {/* Top content */}
              <div className="space-y-1.5 z-10">
                <h3 className={`text-lg font-black tracking-tight ${cat.textColor}`}>
                  {cat.name}
                </h3>
                <p className={`text-xs font-semibold leading-relaxed max-w-[80%] ${cat.descColor}`}>
                  {cat.desc}
                </p>
              </div>

              {/* Dynamic decorative illustration inside */}
              {cat.iconDetail}

              {/* Circle button with arrow */}
              <div className="z-10 mt-6 self-start">
                <div className="w-9 h-9 rounded-full bg-white text-slate-950 flex items-center justify-center shadow transition-transform group-hover:rotate-45">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Featured Products section */}
      <div id="products-catalog-section" className="scroll-mt-24">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Sản phẩm nổi bật
            </h2>
            <p className="text-sm text-slate-500">
              {selectedCategory === "all" 
                ? "Thành phẩm tinh chọn tối ưu, tin dùng hàng đầu bởi kiến trúc sư"
                : `Dòng sản phẩm chất lượng phân loại: ${selectedCategory === "interior" ? "Sơn Nội Thất" : selectedCategory === "exterior" ? "Sơn Ngoại Thất" : selectedCategory === "primer" ? "Sơn Lót Kháng Kiềm" : "Sơn Chuyên Dụng"}`
              }
            </p>
          </div>
          <button 
            onClick={() => onSelectCategory("all")}
            className="text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-950 transition-colors flex items-center gap-1 group cursor-pointer"
          >
            Xem tất cả
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products
            .filter(p => selectedCategory === "all" || p.category === selectedCategory)
            .map((prod) => {
              // Custom can color mapping for product visualization
              let canColor = "from-cyan-400 to-indigo-500";
              let badgeColor = "bg-purple-100 text-purple-900";
              if (prod.category === "exterior") {
                canColor = "from-amber-400 to-orange-500";
                badgeColor = "bg-orange-100 text-orange-950";
              } else if (prod.category === "primer") {
                canColor = "from-emerald-400 to-teal-600";
                badgeColor = "bg-emerald-100 text-emerald-950";
              } else if (prod.category === "specialty") {
                canColor = "from-slate-700 to-slate-950";
                badgeColor = "bg-slate-200 text-slate-950";
              }

              return (
                <div
                  key={prod.id}
                  className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative group"
                  onMouseEnter={() => setHoveredProduct(prod.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  {/* Badge */}
                  {prod.badge && (
                    <span className={`absolute top-4 left-4 z-10 text-[10px] font-extrabold px-2.5 py-1 rounded shadow-sm tracking-wider uppercase ${badgeColor}`}>
                      {prod.badge}
                    </span>
                  )}

                  {/* Visual product mock-container using real generated paint can images */}
                  <div className="w-full aspect-[4/3] bg-gradient-to-b from-slate-50 to-white relative overflow-hidden group border-b border-slate-50 p-0 flex items-center justify-center">
                    <img
                      src={prod.image || getProductImage(prod.category)}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover filter drop-shadow-[0_10px_15px_rgba(30,41,59,0.18)] transform group-hover:scale-105 group-hover:-rotate-1 transition-transform duration-500 ease-out"
                    />
                    {/* Visual indicator representation of the actual paint color selection */}
                    <span className={`absolute bottom-3 right-3 w-5 h-5 rounded-full border-2 border-white bg-gradient-to-br ${canColor} shadow-md z-10`} />
                  </div>

                  {/* Details section */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="font-extrabold text-slate-900 leading-tight group-hover:text-emerald-500 transition-colors">
                        {prod.name}
                      </h3>
                      
                      {/* Stars & review counts exactly copying reference style */}
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center text-amber-400">
                          {[...Array(prod.stars)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <span className="text-xs text-slate-400">({prod.reviews})</span>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {prod.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                      <div>
                        <p className="text-xs text-slate-400 font-medium">Hộp/Thùng ({prod.unit.split(" ")[1]})</p>
                        <p className="text-base sm:text-lg font-black text-slate-950">
                          {formatPrice(prod.price)}
                        </p>
                      </div>

                      <button
                        onClick={() => onAddToCart(prod)}
                        className="w-10 h-10 rounded-full bg-slate-950 hover:bg-emerald-400 text-white hover:text-slate-950 flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95"
                        title="Thêm vào giỏ"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
        </div>
      </div>

    </div>
  );
}
