import React, { useState } from "react";
import { Search, ShoppingBag, Menu, X, User, Settings, Coins, LogOut, ShieldCheck } from "lucide-react";

interface HeaderProps {
  cartCount: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCart: () => void;
  setShowAdmin: (show: boolean) => void;
  showAdmin: boolean;
  currentUser: { email: string; name: string; picture: string } | null;
  coins: number;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export default function Header({
  cartCount,
  activeTab,
  setActiveTab,
  onOpenCart,
  setShowAdmin,
  showAdmin,
  currentUser,
  coins,
  onOpenLogin,
  onLogout
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { label: "Trang chủ", id: "home" },
    { label: "Sản phẩm", id: "products" },
    { label: "Giải pháp", id: "solutions" },
    { label: "Dự án", id: "projects" },
    { label: "Bảng màu online", id: "colors" },
  ];

  const handleMenuClick = (id: string) => {
    setActiveTab(id);
    setShowAdmin(false);
    setMobileMenuOpen(false);
    
    // Quick smooth scroll
    if (id === "colors") {
      setTimeout(() => {
        const el = document.getElementById("color-palette-section");
        el?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else if (id === "products") {
      setTimeout(() => {
        const el = document.getElementById("products-catalog-section");
        el?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else if (id === "solutions") {
      setTimeout(() => {
        const el = document.getElementById("solutions-section");
        el?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Check if current user is the exact authorized admin
  const isAuthorizedAdmin = currentUser && currentUser.email === "triet1509w@gmail.com";

  return (
    <header className="sticky top-0 z-50 bg-slate-950 text-white/90 border-b border-slate-800 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20" id="colora-navbar">
          {/* Logo */}
          <div 
            onClick={() => { setActiveTab("home"); setShowAdmin(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="relative w-9 h-9">
              {/* Overlapping circular paint rings */}
              <div className="absolute top-0 left-0 w-6 h-6 rounded-full border-2 border-emerald-400 bg-transparent opacity-90 transition-transform group-hover:scale-110"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full border-2 border-amber-500 bg-transparent opacity-90 transition-transform group-hover:scale-110"></div>
              <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-cyan-400"></div>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl sm:text-2xl font-black tracking-wider text-white">
                COLORA
              </span>
              <span className="text-[10px] tracking-[6px] font-light text-slate-400 text-center uppercase pl-1 -mt-0.5">
                PAINT
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-1 sm:space-x-4 lg:space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`px-3 py-2 text-sm font-medium transition-colors cursor-pointer rounded-lg relative ${
                  activeTab === item.id && !showAdmin
                    ? "text-emerald-400 bg-slate-900/50"
                    : "text-slate-300 hover:text-white hover:bg-slate-900/30"
                }`}
              >
                {item.label}
                {activeTab === item.id && !showAdmin && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-emerald-400 rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Right Menu Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Gamified Coins widget for logged in users */}
            {currentUser && (
              <div 
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-amber-400 text-xs font-black rounded-xl border border-amber-500/20 shadow"
                title="Số dư Xu của bạn"
              >
                <Coins className="w-4 h-4 text-amber-500 animate-pulse" />
                <span>{coins.toLocaleString("vi")} Xu</span>
              </div>
            )}

            {/* Cart Button */}
            <button 
              onClick={onOpenCart}
              className="p-2 text-slate-300 hover:text-white transition-colors relative cursor-pointer"
              title="Giỏ hàng"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-amber-500 text-slate-950 font-bold text-xs rounded-full flex items-center justify-center border-2 border-slate-950 shadow-md animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin Controls - Strictly gated to triet1509w@gmail.com */}
            {isAuthorizedAdmin && (
              <button
                onClick={() => { setShowAdmin(!showAdmin); }}
                className={`p-2 rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 text-xs font-semibold ${
                  showAdmin 
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                    : "bg-slate-900 text-slate-300 border border-slate-800 hover:text-white"
                }`}
                title="Quản trị Colora"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="hidden lg:inline">Quản trị CRM</span>
              </button>
            )}

            {/* Google Authentication Control */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <img 
                  src={currentUser.picture} 
                  alt={currentUser.name} 
                  className="w-8 h-8 rounded-full border-2 border-emerald-500 shadow-sm"
                  title={`${currentUser.name} (${currentUser.email})`}
                />
                <button 
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                  title="Đăng xuất"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={onOpenLogin}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-850 hover:border-slate-500 text-white font-black text-xs rounded-xl border border-slate-700 transition cursor-pointer"
              >
                <User className="w-4 h-4 text-emerald-400" />
                <span>Đăng nhập</span>
              </button>
            )}

            {/* mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-t border-slate-800 py-4 px-4 space-y-2 z-50 shadow-xl text-xs sm:text-sm">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`w-full text-left block px-4 py-3 rounded-xl font-medium text-base transition-colors ${
                activeTab === item.id && !showAdmin
                  ? "bg-slate-900 text-emerald-400"
                  : "text-slate-300 hover:bg-slate-900/60 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
          
          {currentUser && (
            <div className="p-4 border-t border-slate-800 mt-2 text-amber-400 font-extrabold flex items-center justify-between">
              <span>Ví Xu tích lũy:</span>
              <span>🪙 {coins.toLocaleString("vi")} Xu</span>
            </div>
          )}

          {isAuthorizedAdmin && (
            <button
              onClick={() => { setShowAdmin(true); setMobileMenuOpen(false); }}
              className={`w-full text-left block px-4 py-3 rounded-xl font-medium text-base transition-colors ${
                showAdmin 
                  ? "bg-emerald-950/40 text-emerald-400"
                  : "text-slate-300 hover:bg-slate-900/60 hover:text-white"
              }`}
            >
              Bảng Quản lý Admin Panel (CRM)
            </button>
          )}
        </div>
      )}
    </header>
  );
}
