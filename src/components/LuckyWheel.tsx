import React, { useState, useEffect } from "react";
import { Sparkles, X, Gift, HelpCircle, AlertCircle, RefreshCw } from "lucide-react";

interface LuckyWheelProps {
  onAwardCoins: (amount: number) => void;
  onAwardVoucher: (discountPercent: number, code: string) => void;
  userCoins: number;
  onDeductCoins: (amount: number) => boolean;
}

interface Prize {
  name: string;
  lines: string[];
  type: "coin" | "voucher" | "none";
  value: number;
  code?: string;
  probability: number; // Percentage, total sum = 100
  color: string;
}

const PRIZES: Prize[] = [
  { name: "Voucher Giảm 10%", lines: ["MÃ GIẢM", "10%"], type: "voucher", value: 10, code: "COLORA10", probability: 35, color: "#10B981" }, // Emerald 500
  { name: "Tặng 50 Xu", lines: ["NHẬN", "50 XU"], type: "coin", value: 50, probability: 25, color: "#F59E0B" }, // Amber 500
  { name: "Voucher Giảm 15%", lines: ["MÃ GIẢM", "15%"], type: "voucher", value: 15, code: "COLORA15", probability: 15, color: "#6366F1" }, // Indigo 500
  { name: "Tặng 100 Xu", lines: ["CỰC ĐÃ", "100 XU"], type: "coin", value: 100, probability: 10, color: "#EC4899" }, // Pink 500
  { name: "Voucher SIÊU CẤP 20%", lines: ["SIÊU CẤP", "GIẢM 20%"], type: "voucher", value: 20, code: "COLORA20", probability: 5, color: "#EF4444" }, // Red 500
  { name: "Chúc may mắn lần sau", lines: ["MAY MẮN", "LẦN SAU"], type: "none", value: 0, probability: 10, color: "#4B5563" } // Gray 600
];

export default function LuckyWheel({
  onAwardCoins,
  onAwardVoucher,
  userCoins,
  onDeductCoins
}: LuckyWheelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [hasFreeSpin, setHasFreeSpin] = useState(true);
  const [spinResult, setSpinResult] = useState<Prize | null>(null);
  const [spinError, setSpinError] = useState("");

  // Helper to generate coordinates for perfect SVG segment wedges
  const getWedgePath = (startAngleDeg: number, endAngleDeg: number, radius: number): string => {
    // Convert to radians
    const startRad = (startAngleDeg * Math.PI) / 180;
    const endRad = (endAngleDeg * Math.PI) / 180;
    
    const cx = 150;
    const cy = 150;
    
    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);
    
    // Wedge is 60 degrees, so large-arc-flag is 0
    return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
  };

  // Check if a new day has arrived to refresh the free spin
  useEffect(() => {
    const lastSpinDate = localStorage.getItem("colora_last_free_spin");
    const today = new Date().toDateString();
    if (lastSpinDate === today) {
      setHasFreeSpin(false);
    } else {
      setHasFreeSpin(true);
    }
  }, [isOpen]);

  const spinTheWheel = () => {
    if (isSpinning) return;

    const today = new Date().toDateString();
    const usingCoins = !hasFreeSpin;

    if (usingCoins) {
      // Costs 50 coins to spin again
      const success = onDeductCoins(50);
      if (!success) {
        setSpinError("Bạn không đủ Xu để quay tiếp! Cần 50 Xu một lượt.");
        return;
      }
    }

    setSpinError("");
    setSpinResult(null);
    setIsSpinning(true);

    // Pick winning item based on probability
    const rand = Math.random() * 100;
    let accumulatedProb = 0;
    let selectedIndex = 0;

    for (let i = 0; i < PRIZES.length; i++) {
      accumulatedProb += PRIZES[i].probability;
      if (rand <= accumulatedProb) {
        selectedIndex = i;
        break;
      }
    }

    const prize = PRIZES[selectedIndex];
    const segmentAngle = 360 / PRIZES.length;
    
    // Calculate final rotation to align center of chosen segment at the top (270 degrees on a standard circle)
    // Extra rotations (at least 6 full circles) for excitement
    const targetAngle = 360 * 6 - (selectedIndex * segmentAngle) - (segmentAngle / 2);
    setRotation(targetAngle);

    if (!usingCoins) {
      localStorage.setItem("colora_last_free_spin", today);
      setHasFreeSpin(false);
    }

    setTimeout(() => {
      setIsSpinning(false);
      setSpinResult(prize);

      // Award the points / certificates
      if (prize.type === "coin") {
        onAwardCoins(prize.value);
      } else if (prize.type === "voucher" && prize.code) {
        onAwardVoucher(prize.value, prize.code);
      }
    }, 4000); // Animation duration match
  };

  const closeDialog = () => {
    setIsOpen(false);
    setSpinResult(null);
    setSpinError("");
  };

  return (
    <>
      {/* Floating spin wheel launcher */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          id="lucky-wheel-trigger"
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-500 via-amber-500 to-yellow-400 hover:from-rose-400 hover:to-yellow-300 text-white flex items-center justify-center shadow-[0_6px_28px_rgba(245,158,11,0.5)] transition-all transform scale-100 hover:scale-110 cursor-pointer relative animate-pulse"
          title="Vòng quay may mắn"
        >
          <Gift className="w-6 h-6 text-white stroke-[2.5]" />
          <span className="absolute -top-1.5 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-950 border-2 border-amber-400 text-[10px] font-black text-amber-400">
            {hasFreeSpin ? "Free" : "Spin"}
          </span>
          <span className="absolute inset-0 rounded-full bg-amber-500 animate-ping opacity-15 pointer-events-none" />
        </button>
      </div>

      {/* Lucky Wheel overlay modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={closeDialog} />

          <div 
            id="lucky-wheel-container"
            className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl border border-slate-800 p-6 shadow-2xl text-white transform scale-100 transition-all text-center flex flex-col items-center overflow-hidden"
          >
            {/* Spotlight decoration */}
            <div className="absolute top-0 inset-x-0 h-40 bg-radial-gradient from-amber-500/20 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="w-full flex items-center justify-between border-b border-white/10 pb-4 mb-5 z-10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400 animate-spin-slow" />
                <h3 className="font-extrabold text-base sm:text-lg text-amber-300 tracking-tight">Vòng Quay May Mắn Colora</h3>
              </div>
              <button 
                onClick={closeDialog}
                className="p-1 rounded-full hover:bg-white/10 transition-colors text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 max-w-xs leading-relaxed mb-6">
              Bạn có {hasFreeSpin ? "1 lượt QUAY MIỄN PHÍ hôm nay!" : `lượt quay mới bằng Xu. Số xu của bạn: ${userCoins} Xu.`}
            </p>

            {/* Simulated Canvas Wheel render */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center mb-6 z-10">
              
              {/* Wheel Selector Arrow on Top */}
              <div className="absolute top-[-8px] z-30 w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-yellow-400 filter drop-shadow-[0_4px_5px_rgba(0,0,0,0.5)]" />
              
              {/* Outer Golden Border frame with blinking dots */}
              <div className="absolute inset-0 rounded-full border-4 border-amber-400/80 bg-slate-950 p-1 shadow-[0_10px_35px_rgba(245,158,11,0.3)] animate-pulse" />

              {/* Spin board rotation */}
              <div 
                className="w-full h-full rounded-full overflow-hidden relative transition-transform duration-[4000ms] ease-out border-4 border-slate-900"
                style={{ 
                  transform: `rotate(${rotation}deg)`,
                  transitionProperty: isSpinning ? "transform" : "none"
                }}
              >
                {/* SVG-based Segment Wedge Wheel to guarantee zero black gaps */}
                <svg viewBox="0 0 300 300" className="w-[102%] h-[102%] -m-[1%] rounded-full absolute inset-0">
                  {PRIZES.map((prize, idx) => {
                    const segmentAngle = 360 / PRIZES.length;
                    const startAngle = idx * segmentAngle;
                    const endAngle = (idx + 1) * segmentAngle;
                    const midAngle = startAngle + segmentAngle / 2;
                    const pathD = getWedgePath(startAngle, endAngle, 148);

                    return (
                      <g key={idx}>
                        {/* Wedge Slice with secure dark edge stroke */}
                        <path
                          d={pathD}
                          fill={prize.color}
                          stroke="#0F172A"
                          strokeWidth="3"
                          strokeLinejoin="round"
                        />
                        
                        {/* Radially Rotated and Translated text */}
                        <g transform={`rotate(${midAngle + 90}, 150, 150)`}>
                          <text
                            x={150}
                            y={42}
                            textAnchor="middle"
                            className="font-black text-[10px] sm:text-[11px] uppercase tracking-wide fill-white select-none pointer-events-none"
                            style={{
                              filter: "drop-shadow(0px 2px 2.5px rgba(15, 23, 42, 0.95))"
                            }}
                          >
                            <tspan x={150} dy="0">{prize.lines[0]}</tspan>
                            <tspan x={150} dy="13.5" className="fill-yellow-300 font-extrabold text-[11px] sm:text-[12px]">{prize.lines[1]}</tspan>
                          </text>
                        </g>
                      </g>
                    );
                  })}
                </svg>

                {/* Golden Center Pin */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 border-4 border-slate-900 shadow-md flex items-center justify-center z-20">
                  <div className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                </div>
              </div>

              {/* Interactive SPIN CTA inside center (or click trigger) */}
              <button
                disabled={isSpinning}
                onClick={spinTheWheel}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-slate-950 hover:bg-slate-900 text-amber-400 font-extrabold text-xs tracking-tight uppercase border-2 border-amber-400 shadow-2xl transition-all cursor-pointer select-none active:scale-95 disabled:scale-100 disabled:opacity-80 z-20 flex flex-col items-center justify-center"
              >
                {isSpinning ? (
                  <RefreshCw className="w-5 h-5 animate-spin text-amber-400" />
                ) : (
                  <>
                    <span className="text-[10px] leading-tight text-white font-medium">Bấm để</span>
                    <span className="text-[13px] leading-none font-black text-amber-400">QUAY</span>
                  </>
                )}
              </button>

            </div>

            {/* Info display and error banners */}
            {spinError && (
              <div className="w-full p-3 bg-red-950/50 border border-red-500/30 text-rose-300 text-[11px] font-bold rounded-xl mb-4 flex items-center gap-1.5 justify-center">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{spinError}</span>
              </div>
            )}

            {/* Spin winning outputs */}
            {spinResult && !isSpinning && (
              <div className="w-full p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl mb-4 animate-bounce space-y-1">
                <span className="text-[10px] uppercase font-black text-emerald-400 tracking-wider">KẾT QUẢ QUAY</span>
                <p className="text-sm font-extrabold text-white">{spinResult.name}</p>
                {spinResult.type === "voucher" && spinResult.code && (
                  <p className="text-xs text-slate-300">
                    Sử dụng mã coupon <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono font-black border border-emerald-500/30 text-xs">{spinResult.code}</span> tại cổng thanh toán để nhận ngay chiết khấu!
                  </p>
                )}
                {spinResult.type === "coin" && (
                  <p className="text-[11px] text-amber-400 font-bold">+ {spinResult.value} Xu đã được cộng vào tài khoản của bạn.</p>
                )}
                {spinResult.type === "none" && (
                  <p className="text-xs text-slate-400">Hãy thử quay lại sau nhé. Quay tiếp chỉ tốn 50 Xu!</p>
                )}
              </div>
            )}

            {/* Quick footer helper list inside game board */}
            <div className="w-full bg-white/5 border border-white/5 rounded-2xl p-3 flex items-center justify-between text-left mt-2">
              <div className="text-[11px] space-y-0.5">
                <p className="font-extrabold text-slate-100">Ví Xu của bạn:</p>
                <p className="text-xs font-black text-amber-400">{userCoins} Xu <span className="text-slate-400 font-normal">(= {userCoins.toLocaleString("vi")} VND)</span></p>
              </div>
              <button
                disabled={isSpinning || userCoins < 50}
                onClick={spinTheWheel}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <span>Quay tiếp (-50 Xu)</span>
              </button>
            </div>

            <p className="text-[10px] text-slate-500 mt-4">
              * Tỷ lệ trúng thưởng: Voucher 10% (35%), Tận 50 Xu (25%), Voucher 15% (15%), Khác (25%).
            </p>
          </div>
        </div>
      )}
    </>
  );
}
