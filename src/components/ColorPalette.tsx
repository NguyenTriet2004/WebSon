import React, { useState } from "react";
import { 
  Palette, Calculator, Home, Bed, Sparkles, Building2, 
  HelpCircle, Info, CheckCircle2, ChevronRight, ShoppingCart 
} from "lucide-react";
import { ColorItem, Product } from "../types";

interface ColorPaletteProps {
  colors: ColorItem[];
  products: Product[];
  onAddCalculatedToCart: (productId: string, quantity: number) => void;
  onColorSelectNotifier: (colorName: string) => void;
}

type RoomType = "living" | "bedroom" | "exterior";

export default function ColorPalette({
  colors,
  products,
  onAddCalculatedToCart,
  onColorSelectNotifier
}: ColorPaletteProps) {
  
  // States
  const [selectedCollection, setSelectedCollection] = useState<string>("all");
  const [activeColor, setActiveColor] = useState<ColorItem>(colors[3]); // Standard CL-2012 Xám Sợi Khói
  const [activeRoom, setActiveRoom] = useState<RoomType>("living");
  
  // Calculator States
  const [width, setWidth] = useState<number>(5);
  const [height, setHeight] = useState<number>(3);
  const [walls, setWalls] = useState<number>(4);
  const [doors, setDoors] = useState<number>(1);
  const [windows, setWindows] = useState<number>(2);
  const [selectedProduct, setSelectedProduct] = useState<string>("prod_1");
  const [calcResult, setCalcResult] = useState<any | null>(null);

  // Collections mapping
  const collections = [
    { label: "Tất cả", id: "all" },
    { label: "Classic Warm (Ấm áp Cổ điển)", id: "classic" },
    { label: "Modern Neutral (Hiện đại Tối giản)", id: "modern" },
    { label: "Peaceful Pastel (Pastel Diệu ngọt)", id: "pastel" },
    { label: "Earthy Warmth (Sắc màu Đất mẹ)", id: "earthy" },
  ];

  const filteredColors = selectedCollection === "all" 
    ? colors 
    : colors.filter(c => c.category === selectedCollection);

  const handleColorClick = (color: ColorItem) => {
    setActiveColor(color);
    onColorSelectNotifier(color.name);
  };

  // Calculate Paint Quantity logic
  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Total Wall Area = (Width * Height * number of walls to paint)
    let netArea = width * height * walls;
    
    // Deduct doors (~2m2 per door) and windows (~1.5m2 per window)
    const doorDeduction = doors * 2.0;
    const windowDeduction = windows * 1.5;
    netArea = Math.max(5, netArea - doorDeduction - windowDeduction);

    // standard coverages (1 Liter covers ~10m2 for 1 layer)
    // We assume 2 layers of topcoat (Standard paint standard)
    // 1 Thùng 15L topcoat covers ~75m2 for 2 layers (approx 150m2/layer)
    // 1 Thùng 18L primer covers ~120m2 for 1 layer (approx 180m2/layer)
    
    const litersTopcoatNeeded = (netArea * 2) / 10; 
    const litersPrimerNeeded = netArea / 10;

    // Get selected topcoat product
    const topcoat = products.find(p => p.id === selectedProduct) || products[0];
    const primer = products.find(p => p.category === "primer") || products[4];

    // Cans required (round up)
    // 1 can = 15 Liters
    const topcoatCans = Math.max(1, Math.ceil(litersTopcoatNeeded / 15));
    const primerCans = Math.max(1, Math.ceil(litersPrimerNeeded / 18));

    const topcoatCost = topcoatCans * topcoat.price;
    const primerCost = primerCans * primer.price;
    const totalCost = topcoatCost + primerCost;

    setCalcResult({
      area: Math.round(netArea * 10) / 10,
      topcoatNeeded: Math.round(litersTopcoatNeeded * 10) / 10,
      primerNeeded: Math.round(litersPrimerNeeded * 10) / 10,
      topcoatCans,
      primerCans,
      topcoatName: topcoat.name,
      topcoatPrice: topcoat.price,
      primerName: primer.name,
      primerPrice: primer.price,
      topcoatCost,
      primerCost,
      totalCost,
      topcoatId: topcoat.id,
      primerId: primer.id
    });
  };

  const handleAddCalculatedToCart = () => {
    if (!calcResult) return;
    onAddCalculatedToCart(calcResult.topcoatId, calcResult.topcoatCans);
    onAddCalculatedToCart(calcResult.primerId, calcResult.primerCans);
    alert(`Đã thêm ${calcResult.topcoatCans} thùng ${calcResult.topcoatName} và ${calcResult.primerCans} thùng ${calcResult.primerName} vào giỏ hàng của bạn!`);
  };

  return (
    <div id="color-palette-section" className="scroll-mt-24 bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <Palette className="w-3.5 h-3.5" /> BẢNG MÀU ONLINE & PHIÊN BẢN TRẢI NGHIỆM SỐ
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Trải nghiệm Phối màu 3D Colora
          </h2>
          <p className="text-sm text-slate-500">
            Xem thực quan màu sơn trên các mô hình 3D phòng ngủ, phòng khách hoặc ngoại thất lộng lẫy và tính toán khối lượng sơn đầu tư chính xác.
          </p>
        </div>

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Color swatches pallet & selector (Col Span 5) */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-1.5">
              <h3 className="text-lg font-extrabold text-slate-950 flex items-center gap-2">
                Bộ sưu tập Màu sắc sắc sảo
              </h3>
              <p className="text-xs text-slate-400">Chọn tông mảng màu để đổi màu phòng demo tức thì</p>
            </div>

            {/* Collection Pills Tab Bar */}
            <div className="flex flex-wrap gap-1.5 pb-2 border-b border-slate-100">
              {collections.map((coll) => (
                <button
                  key={coll.id}
                  onClick={() => setSelectedCollection(coll.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedCollection === coll.id
                      ? "bg-slate-950 text-emerald-400"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {coll.label.split(" ")[0]}
                </button>
              ))}
            </div>

            {/* Scrollable Swatch Squares Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto pr-1">
              {filteredColors.map((color) => {
                const isActive = activeColor.code === color.code;
                return (
                  <button
                    key={color.code}
                    onClick={() => handleColorClick(color)}
                    className={`flex flex-col items-center p-1.5 rounded-xl border transition-all cursor-pointer group text-center space-y-1 ${
                      isActive 
                        ? "border-slate-950 ring-2 ring-emerald-400 bg-emerald-50/20" 
                        : "border-slate-100 hover:border-slate-300 bg-white"
                    }`}
                  >
                    {/* Swatch color square */}
                    <div 
                      className="w-full aspect-square rounded-lg shadow-sm group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: color.hex }}
                    />
                    
                    <div>
                      <p className="text-[9px] font-black tracking-tight text-slate-950 leading-none truncate w-full max-w-[55px]">
                        {color.name}
                      </p>
                      <p className="text-[7px] text-slate-400 mt-0.5">
                        {color.code}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Currently Selected Color Details Bar */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-xl border border-dashed border-slate-300 shadow-sm"
                  style={{ backgroundColor: activeColor.hex }}
                />
                <div className="leading-tight">
                  <h4 className="text-sm font-extrabold text-slate-950">{activeColor.name}</h4>
                  <p className="text-[10px] text-emerald-500 font-extrabold pb-0.5">{activeColor.code}</p>
                  <p className="text-[10px] text-slate-400 italic font-medium leading-none">{activeColor.description}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-xs font-mono bg-white px-2 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-bold select-all">
                  {activeColor.hex.toUpperCase()}
                </span>
              </div>
            </div>

          </div>

          {/* Middle Column: Interactive Room Visualizer Simulation (Col Span 7) */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-lg font-extrabold text-slate-950 flex items-center gap-2">
                  Phối màu thực tế ảo
                </h3>
                <p className="text-xs text-slate-400">Chọn mô hình kiến trúc để ướm sắc màu Colora</p>
              </div>

              {/* Room Toggles */}
              <div className="flex bg-slate-100 p-1 rounded-xl self-start">
                <button
                  onClick={() => setActiveRoom("living")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeRoom === "living"
                      ? "bg-white text-slate-950 shadow-sm"
                      : "text-slate-500 hover:text-slate-950"
                  }`}
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Phòng khách</span>
                </button>

                <button
                  onClick={() => setActiveRoom("bedroom")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeRoom === "bedroom"
                      ? "bg-white text-slate-950 shadow-sm"
                      : "text-slate-500 hover:text-slate-950"
                  }`}
                >
                  <Bed className="w-3.5 h-3.5" />
                  <span>Phòng ngủ</span>
                </button>

                <button
                  onClick={() => setActiveRoom("exterior")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeRoom === "exterior"
                      ? "bg-white text-slate-950 shadow-sm"
                      : "text-slate-500 hover:text-slate-950"
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Mặt tiền nhà</span>
                </button>
              </div>
            </div>

            {/* Visual Screen Sandbox showing room line outline and changing color wall */}
            <div className="relative aspect-[16/9] md:aspect-[16/8.5] rounded-2xl overflow-hidden border border-slate-200 shadow-inner flex items-center justify-center select-none bg-slate-100">
              {/* Back Wall (Colorable) */}
              <div 
                className="absolute inset-0 transition-colors duration-1000 ease-out"
                style={{ backgroundColor: activeColor.hex }}
              />

              {/* Gradient shadows overlay to represent natural interior lighting corners */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-l from-black/15 via-transparent to-transparent pointer-events-none" />

              {/* Room Elements Overlay based on Type */}
              {activeRoom === "living" && (
                <div className="absolute inset-0 z-10 flex flex-col justify-end p-6">
                  {/* Floor element */}
                  <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-b from-amber-900 to-amber-950 border-t border-amber-800 shadow-md flex items-center justify-center">
                    <span className="text-[10px] text-white/20 uppercase font-mono tracking-wider">Sàn Gỗ Sồi Cổ Điển Colora</span>
                  </div>
                  
                  {/* Plant pot line elements */}
                  <div className="absolute bottom-16 left-6 w-12 h-24 flex flex-col justify-end items-center">
                    <div className="w-8 h-10 bg-slate-200 border border-slate-300 rounded-b shadow" />
                    <div className="w-16 h-16 rounded-full bg-emerald-600/40 border border-emerald-400 absolute bottom-9 animate-pulse blur-[1px]" />
                  </div>

                  {/* Couch outline */}
                  <div className="w-[60%] h-24 bg-white/90 border-2 border-slate-700/30 rounded-t-2xl shadow-[0_10px_20px_rgba(0,0,0,0.15)] self-center mb-10 relative flex items-center justify-center">
                    <div className="absolute -top-3 w-[90%] h-4 bg-slate-200/50 rounded" />
                    <div className="absolute bottom-0 left-4 w-6 h-6 rounded bg-slate-900" />
                    <div className="absolute bottom-0 right-4 w-6 h-6 rounded bg-slate-900" />
                    <div className="text-center font-bold text-slate-950 text-xs tracking-wide">
                      Phòng khách mẫu • Tông {activeColor.name}
                    </div>
                  </div>
                </div>
              )}

              {activeRoom === "bedroom" && (
                <div className="absolute inset-0 z-10 flex flex-col justify-end p-6">
                  {/* Light wood floor */}
                  <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-b from-amber-700 to-amber-800 border-t border-amber-600 shadow-md" />

                  {/* Bed outline */}
                  <div className="w-[50%] h-28 bg-white/95 border-2 border-slate-350 rounded-lg shadow-xl mb-12 self-start ml-12 relative flex flex-col justify-between p-4">
                    <div className="flex gap-2">
                      <div className="w-12 h-6 bg-slate-200/80 rounded" />
                      <div className="w-12 h-6 bg-slate-200/80 rounded" />
                    </div>
                    <div className="w-full h-4 bg-emerald-500/10 rounded border-t border-dashed border-slate-300 text-center text-[10px] text-slate-950 font-bold">
                      Phòng ngủ trẻ ấm cúng
                    </div>
                  </div>

                  {/* Floating shelfs on the wall */}
                  <div className="absolute top-[20%] right-[15%] w-32 h-6 bg-white/30 border border-white/25 rounded backdrop-blur-sm flex items-center justify-center shadow-sm">
                    <span className="text-[8px] text-white font-extrabold uppercase tracking-widest">KỆ TRANG TRÍ</span>
                  </div>
                </div>
              )}

              {activeRoom === "exterior" && (
                <div className="absolute inset-0 z-10 flex flex-col justify-end p-6">
                  {/* Concrete block path floor */}
                  <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-b from-slate-600 to-slate-800 border-t border-slate-500 shadow-md" />

                  {/* Luxury modern facade architecture mockup glass panel */}
                  <div className="absolute top-[10%] right-[5%] w-1/3 bottom-12 border-l border-y bg-slate-900/80 backdrop-blur-md border-slate-700/40 p-4 flex flex-col justify-between text-white/55">
                    <div className="w-full h-1/2 rounded border border-white/10 bg-slate-850/40 flex items-center justify-center text-[9px] font-mono tracking-widest uppercase text-amber-500 font-extrabold">
                      Cửa Kính Ban Công
                    </div>
                    <div className="text-[10px] font-black text-center text-white truncate">
                      VILLA EXTERIOR PREVIEW
                    </div>
                  </div>

                  {/* Left pillar wall */}
                  <div className="absolute left-[8%] top-[10%] w-[15%] bottom-12 bg-gradient-to-b from-amber-100 to-amber-200/70 border border-amber-300 shadow-md rounded-t-lg flex items-center justify-center">
                    <span className="text-[8px] text-amber-950 font-black tracking-widest rotate-90 whitespace-nowrap">ĐÁ GRANITE</span>
                  </div>
                </div>
              )}

              {/* Watermark branding label over simulated screenshot */}
              <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur border border-slate-800 rounded-lg px-2.5 py-1 text-[10px] font-black tracking-wider text-white z-20">
                COLORA STUDIO™ VISUALIZER
              </div>
            </div>
          </div>

        </div>

        {/* 3. Paint volume Calculator Form and invoice panel */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex gap-3 items-center mb-6">
            <Calculator className="w-6 h-6 text-emerald-500" />
            <h3 className="text-xl font-black text-slate-950">Công cụ Tính lượng Sơn Dự án</h3>
          </div>

          <form onSubmit={handleCalculate} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Input fields settings left column (Col Span 5) */}
            <div className="md:col-span-5 space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Chiều rộng phòng (m) *</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-950 font-semibold focus:outline-emerald-500 focus:bg-white text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Chiều cao tường (m) *</label>
                  <input
                    type="number"
                    min="1.5"
                    max="10"
                    step="0.1"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-950 font-semibold focus:outline-emerald-500 focus:bg-white text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1.5 uppercase">Số bức tường</label>
                  <input
                    type="number"
                    min="1"
                    max="4"
                    value={walls}
                    onChange={(e) => setWalls(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-950 font-semibold focus:outline-emerald-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1.5 uppercase">Số cửa chính (2m²)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={doors}
                    onChange={(e) => setDoors(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-950 font-semibold focus:outline-emerald-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1.5 uppercase">Số cửa sổ (1.5m²)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={windows}
                    onChange={(e) => setWindows(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-950 font-semibold focus:outline-emerald-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Loại sơn phủ mong muốn</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-950 font-semibold text-sm cursor-pointer"
                >
                  {products
                    .filter(p => p.category !== "primer")
                    .map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.code}) - {p.price.toLocaleString("vi")}đ
                      </option>
                    ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full cursor-pointer bg-slate-950 hover:bg-emerald-400 hover:text-slate-950 font-bold py-3.5 rounded-xl transition-all text-white text-sm tracking-wide"
              >
                Tính Toán Đơn Giá Dự Toán
              </button>

            </div>

            {/* Calculations Invoice Right Column (Col Span 7) */}
            <div className="md:col-span-7 bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
              
              {!calcResult ? (
                <div className="h-full min-h-[220px] flex flex-col justify-center items-center text-center space-y-3">
                  <Info className="w-10 h-10 text-slate-350 animate-pulse" />
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-700">Chưa có dữ liệu tính toán</h4>
                    <p className="text-xs text-slate-400 max-w-[280px]">Vui lòng điều chỉnh thông số kích thước phòng bên trái và bấm Tính toán để ước tính thùng sơn và chi phí chuẩn xác.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Báo cáo dự toán hoàn thiện bức tường
                    </h4>
                    <span className="text-[10px] px-2 py-1 bg-amber-500-10% border border-amber-500 text-amber-600 font-bold rounded">
                      2 Lớp phủ + 1 Lớp lót
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 border-b border-slate-200 pb-4">
                    <div className="bg-white p-3 rounded-xl border border-slate-150 text-center shadow-sm">
                      <p className="text-[10px] text-slate-400 font-semibold mb-0.5 uppercase">Diện tích sơn thực</p>
                      <p className="text-base sm:text-lg font-black text-slate-900">{calcResult.area} m²</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-150 text-center shadow-sm">
                      <p className="text-[10px] text-slate-400 font-semibold mb-0.5 uppercase">Lượng sơn lót cần</p>
                      <p className="text-base sm:text-lg font-black text-slate-900">{calcResult.primerNeeded} L</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-150 text-center shadow-sm">
                      <p className="text-[10px] text-slate-400 font-semibold mb-0.5 uppercase">Sơn phủ màu cần</p>
                      <p className="text-base sm:text-lg font-black text-slate-900">{calcResult.topcoatNeeded} L</p>
                    </div>
                  </div>

                  {/* Line item invoices detailed breaks */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center text-slate-600">
                      <span>{calcResult.topcoatCans} Thùng x Phủ: {calcResult.topcoatName} (Hộp 15L):</span>
                      <span className="font-bold text-slate-900">{calcResult.topcoatCost.toLocaleString()}đ</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                      <span>{calcResult.primerCans} Thùng x Lót: {calcResult.primerName} (Hộp 18L):</span>
                      <span className="font-bold text-slate-900">{calcResult.primerCost.toLocaleString()}đ</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-dashed border-slate-200 pt-3 text-sm font-black text-slate-900 uppercase">
                      <span>Tổng chi phí vật tư:</span>
                      <span className="text-base text-emerald-500 font-black">{calcResult.totalCost.toLocaleString()}đ</span>
                    </div>
                  </div>

                  {/* Cart trigger cta inside estimate page */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={handleAddCalculatedToCart}
                      className="flex-1 cursor-pointer bg-slate-900 hover:bg-slate-850 text-white font-bold py-3 px-5 rounded-xl border border-slate-700 hover:border-slate-500 transition-all text-xs flex items-center justify-center gap-2.5 active:scale-98"
                    >
                      <ShoppingCart className="w-4 h-4 text-emerald-400" />
                      <span>Thêm bộ combo dự toán vào giỏ</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => alert("Hồ sơ dự toán đã được lưu về bộ nhớ đệm trình duyệt!")}
                      className="px-4 py-3 border border-slate-200 hover:border-slate-400 text-slate-700 bg-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Lưu bản in kĩ thuật
                    </button>
                  </div>

                  <p className="text-[10px] text-slate-400 text-center pt-1.5 italic">
                    * Lưu ý: Con số mang tính chất ước lượng chuẩn kỹ thuật Colora. Hao hụt bề mặt thực tiễn có thể dao bám tùy chất tường (tường thô/bả matit) từ 5% - 10%.
                  </p>
                </div>
              )}

            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
