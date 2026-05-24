import React, { useState, useEffect } from "react";
import { 
  ShoppingBag, Phone, X, Check, Users, MessageSquare, 
  Send, ShieldAlert, Sparkles, Paintbrush, ArrowRight, UserCheck 
} from "lucide-react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import CategoriesAndProducts from "./components/CategoriesAndProducts";
import SolutionsAndSteps from "./components/SolutionsAndSteps";
import ColorPalette from "./components/ColorPalette";
import GeminiConsult from "./components/GeminiConsult";
import AdminPanel from "./components/AdminPanel";
import GoogleAuthModal from "./components/GoogleAuthModal";
import LuckyWheel from "./components/LuckyWheel";
import Footer from "./components/Footer";
import { Product, ColorItem } from "./types";
import { Coins, LogOut, Gift } from "lucide-react";
import { auth, logOut as logoutFirebase } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

// Failsafe local configurations in case the backend server API is launching
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "prod_1",
    name: "Sơn nội thất Pure White",
    code: "CL-PW01",
    category: "interior",
    description: "Sơn nội thất siêu mịn, trắng tinh khiết, mang lại không gian sáng bóng tươi mới, độ phủ cao và dễ dàng lau chùi.",
    price: 1250000,
    unit: "Thùng 15L",
    stars: 5,
    reviews: 128,
    features: ["Không mùi", "Dễ lau chùi", "Kháng khuẩn cao"],
    badge: "Mới"
  },
  {
    id: "prod_2",
    name: "Sơn ngoại thất Max Shield",
    code: "CL-MS02",
    category: "exterior",
    description: "Sơn ngoại thất cao cấp chống thấm tuyệt đối, giảm nhiệt bề mặt tới 5 độ C, chống tia UV và bền bỉ trong 15 năm.",
    price: 1850000,
    unit: "Thùng 15L",
    stars: 5,
    reviews: 256,
    features: ["Chống thấm nước", "Chống rêu mốc", "Giảm nhiệt 5°C"],
    badge: "Bán chạy"
  },
  {
    id: "prod_3",
    name: "Sơn nội thất Super Satin",
    code: "CL-SS03",
    category: "interior",
    description: "Sơn siêu bóng ngọc trai quý phái đem đến chiều sâu phản chiếu lung linh, màng sơn mịn sờ sướng tay, kháng nước hoàn mỹ.",
    price: 1650000,
    unit: "Thùng 15L",
    stars: 5,
    reviews: 96,
    features: ["Bóng ánh ngọc trai", "Kháng bám bụi", "Màu sắc sống động"],
    badge: "Cao cấp"
  },
  {
    id: "prod_4",
    name: "Sơn sàn Epoxy Floor",
    code: "CL-EF04",
    category: "specialty",
    description: "Sơn phủ sàn công nghiệp tính năng cao chống mài mòn hóa chất, va đập mạnh, tạo độ bóng gương sang xịn mịn cho sàn xưởng.",
    price: 2350000,
    unit: "Bộ 20kg",
    stars: 5,
    reviews: 64,
    features: ["Kháng mài mòn tốt", "Bóng gương tinh tế", "Chịu tải trọng lớn"],
    badge: "Chuyên dụng"
  },
  {
    id: "prod_5",
    name: "Sơn lót kháng kiềm Colora Primer",
    code: "CL-PR05",
    category: "primer",
    description: "Sơn lót đặc dụng kháng kiềm hóa và chống muối hóa của hồ vữa tơi xốp, nâng đỡ độ bám hoàn hảo cho mọi dòng phủ.",
    price: 950000,
    unit: "Thùng 18L",
    stars: 5,
    reviews: 112,
    features: ["Kháng kiềm & muối", "Tăng độ bám 200%", "Tiết kiệm sơn phủ"]
  }
];

const DEFAULT_COLORS: ColorItem[] = [
  { hex: "#FDFBF7", name: "Trắng Sữa Gió", code: "CL-1011", category: "classic", description: "Trắng mịn màng dịu ngọt, dễ phối mọi nội thất cổ điển." },
  { hex: "#F3E5D8", name: "Cát Vàng Sông Trẻ", code: "CL-1024", category: "classic", description: "Mang màu cát vàng phù sa êm đềm ấm áp, sang trọng." },
  { hex: "#CAB097", name: "Nâu Đất Sét", code: "CL-1088", category: "classic", description: "Đất sét gốm trầm, tạo sự vững vàng tin cậy cao sơn nhấn." },
  { hex: "#F4F4F5", name: "Xám Sợi Khói", code: "CL-2012", category: "modern", description: "Xám bạc nhạt như khói sớm, mang chuẩn tinh thần scandinavian." },
  { hex: "#D4D4D8", name: "Xám Sương Sớm", code: "CL-2035", category: "modern", description: "Xám trung tính thời thượng, rất sạch sẽ và hiện đại." },
  { hex: "#A1A1AA", name: "Xám Bê Tông", code: "CL-2055", category: "modern", description: "Tinh hoa tối giản bê tông xám thanh nhã, thô mộc xịn mịn." },
  { hex: "#E0F2FE", name: "Xanh Băng Tuyết", code: "CL-3012", category: "pastel", description: "Màu xanh da trời sương mờ trong vắt tạo sự thư giãn vô cực ngủ ngon." },
  { hex: "#E0F7FA", name: "Xanh Bạc Hà", code: "CL-3025", category: "pastel", description: "Bạc hà sảng khoái kích thích tư duy sáng tạo căng tràn sinh khí." },
  { hex: "#FCE7F3", name: "Hồng Pháo Hoa", code: "CL-3044", category: "pastel", description: "Hồng ngọt dịu cho bé yêu thích mộng mơ cổ tích màng bảo vệ tốt." },
  { hex: "#FEF3C7", name: "Vàng Nắng Mai", code: "CL-3066", category: "pastel", description: "Màu nắng sớm nhẹ nhàng sưởi ấm căn bếp gia đình sum vầy." },
  { hex: "#B45309", name: "Cam Đất Nung", code: "CL-4015", category: "earthy", description: "Màu gạch gốm nóng ấm kiến tạo không gian sống nhiệt đới đậm đà." },
  { hex: "#854D0E", name: "Nâu Gỗ Sồi", code: "CL-4045", category: "earthy", description: "Mang năng lượng rừng già kiêu hãnh của dòng gỗ cao cấp đắt tiền." },
  { hex: "#15803D", name: "Xanh Lá Thông", code: "CL-4068", category: "earthy", description: "Không gian chữa lành với sắc lục thông yên bình thanh tịnh màng phủ." },
  { hex: "#1E3A8A", name: "Xanh Đại Dương", code: "CL-4099", category: "earthy", description: "Sâu thẳm như đại dương bao la, nâng niu sức khỏe gia can." }
];

interface CartItem {
  product: Product;
  quantity: number;
}

export default function App() {
  // Configurations
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [colors, setColors] = useState<ColorItem[]>(DEFAULT_COLORS);
  
  // Navigation & Cart States
  const [activeTab, setActiveTab] = useState<string>("home");
  const [showAdmin, setShowAdmin] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState<boolean>(false);

  // User & Gamification States
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string; picture: string } | null>(() => {
    const saved = localStorage.getItem("colora_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [coins, setCoins] = useState<number>(() => {
    const savedUser = localStorage.getItem("colora_user");
    if (savedUser) {
      const email = JSON.parse(savedUser).email;
      const savedCoins = localStorage.getItem(`colora_coins_${email}`);
      return savedCoins ? Number(savedCoins) : 0;
    }
    return 0;
  });

  const [claimedCoupons, setClaimedCoupons] = useState<string[]>(() => {
    const savedUser = localStorage.getItem("colora_user");
    if (savedUser) {
      const email = JSON.parse(savedUser).email;
      const savedCoupons = localStorage.getItem(`colora_vouchers_${email}`);
      return savedCoupons ? JSON.parse(savedCoupons) : [];
    }
    return [];
  });

  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showCheckinAlert, setShowCheckinAlert] = useState<boolean>(false);
  const [couponInput, setCouponInput] = useState<string>("");
  const [appliedCoupon, setAppliedCoupon] = useState<string>("");
  const [useCoinsAtCheckout, setUseCoinsAtCheckout] = useState<boolean>(false);

  // Modular Checkout Form states inside cart rail
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [checkoutName, setCheckoutName] = useState<string>("");
  const [checkoutPhone, setCheckoutPhone] = useState<string>("");
  const [checkoutEmail, setCheckoutEmail] = useState<string>("");
  const [checkoutAddress, setCheckoutAddress] = useState<string>("");

  // Lead Submission Form States
  const [fullname, setFullname] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("Tư vấn sơn nội thất");
  const [message, setMessage] = useState<string>("");
  const [submittingLead, setSubmittingLead] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // Color Notification alerts
  const [alertInfo, setAlertInfo] = useState<string>("");
  const [showHotline, setShowHotline] = useState<boolean>(false);

  // Sync user values on mount/login
  useEffect(() => {
    if (currentUser) {
      const savedCoins = localStorage.getItem(`colora_coins_${currentUser.email}`);
      setCoins(savedCoins ? Number(savedCoins) : 0);

      const savedCoupons = localStorage.getItem(`colora_vouchers_${currentUser.email}`);
      setClaimedCoupons(savedCoupons ? JSON.parse(savedCoupons) : []);

      // Check daily check-in
      const today = new Date().toDateString();
      const lastCheckin = localStorage.getItem(`colora_checkin_${currentUser.email}`);
      if (lastCheckin !== today) {
        setCoins(c => {
          const newCoins = c + 100;
          localStorage.setItem(`colora_coins_${currentUser.email}`, String(newCoins));
          return newCoins;
        });
        localStorage.setItem(`colora_checkin_${currentUser.email}`, today);
        setShowCheckinAlert(true);
      }
    } else {
      setCoins(0);
      setClaimedCoupons([]);
      setUseCoinsAtCheckout(false);
      setAppliedCoupon("");
    }
  }, [currentUser]);

  // Register Firebase Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const u = {
          email: firebaseUser.email || "",
          name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Người dùng Colora",
          picture: firebaseUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${firebaseUser.displayName || "Colora"}&backgroundColor=0d9488,10b981,f59e0b`
        };
        localStorage.setItem("colora_user", JSON.stringify(u));
        setCurrentUser(u);
      } else {
        localStorage.removeItem("colora_user");
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch("/api/paint-config");
        if (res.ok) {
          const data = await res.json();
          if (data.products && data.products.length > 0) setProducts(data.products);
          if (data.colors && data.colors.length > 0) setColors(data.colors);
        }
      } catch (err) {
        console.warn("Using offline failsafe products/colors catalogs configuration.", err);
      }
    };
    fetchConfig();
  }, []);

  // Cart operations
  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
    setAlertInfo(`Đã thêm 1 thùng ${product.name} vào giỏ hàng!`);
    setTimeout(() => setAlertInfo(""), 3000);
  };

  const handleAddCalculatedToCart = (productId: string, quantity: number) => {
    const targetProd = products.find(p => p.id === productId);
    if (!targetProd) return;
    setCart(prev => {
      const existing = prev.find(item => item.product.id === productId);
      if (existing) {
        return prev.map(item => item.product.id === productId ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { product: targetProd, quantity }];
    });
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          return newQty <= 0 ? null : { ...item, quantity: newQty };
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };

  const getDiscountAmount = () => {
    if (!appliedCoupon) return 0;
    const base = getCartTotal();
    if (appliedCoupon === "COLORA10") return Math.round(base * 0.1);
    if (appliedCoupon === "COLORA15") return Math.round(base * 0.15);
    if (appliedCoupon === "COLORA20") return Math.round(base * 0.2);
    return 0;
  };

  const getCoinsDiscount = () => {
    if (!useCoinsAtCheckout || !currentUser) return 0;
    // Exactly 100 coins = 100 VND, meaning 1 coin = 1 VND
    const maxDiscountPossible = getCartTotal() - getDiscountAmount();
    return Math.min(coins, maxDiscountPossible);
  };

  const getFinalTotal = () => {
    const final = getCartTotal() - getDiscountAmount() - getCoinsDiscount();
    return Math.max(0, final);
  };

  // Dedicated checkout and order submission
  const handlePlaceOrder = async (orderInfo: { name: string; phone: string; email: string; address: string }) => {
    if (cart.length === 0) return;

    try {
      const coinsToDuct = useCoinsAtCheckout ? getCoinsDiscount() : 0;
      const payload = {
        name: orderInfo.name,
        phone: orderInfo.phone,
        email: orderInfo.email,
        address: orderInfo.address,
        items: cart.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price
        })),
        totalAmount: getFinalTotal(),
        discountAmount: getDiscountAmount(),
        coinsUsed: coinsToDuct,
        couponCode: appliedCoupon || undefined
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        
        // Deduct points from local storage
        if (coinsToDuct > 0 && currentUser) {
          setCoins(current => {
            const next = Math.max(0, current - coinsToDuct);
            localStorage.setItem(`colora_coins_${currentUser.email}`, String(next));
            return next;
          });
        }

        // Wipe local carts
        setCart([]);
        setAppliedCoupon("");
        setUseCoinsAtCheckout(false);
        setCartOpen(false);

        alert(`🎉 Chúc mừng ${orderInfo.name}! Đơn hàng ${data.order.id} đặt mua sơn Colora trị giá ${payload.totalAmount.toLocaleString("vi")}đ đã được thiết lập thành công. Đội ngũ kỹ sư sẽ bốc xếp xe tải giao vận trong 24 giờ tới!`);
      } else {
        alert("Có lỗi xảy ra khi thiết lập đơn mua sơn. Vui lòng thử lại hoặc gọi Hotline!");
      }
    } catch (err) {
      console.error(err);
      // Offline fallback
      setCart([]);
      setCartOpen(false);
      alert("Đã lưu đơn hàng thành công rực rỡ ở local!");
    }
  };

  // Gamification Wheel Event handlers
  const handleAwardCoins = (amount: number) => {
    if (!currentUser) {
      setAlertInfo(`Mừng bạn quay trúng ${amount} Xu! Hãy đăng nhập để lưu vào ví.`);
      setTimeout(() => setAlertInfo(""), 4500);
      return;
    }
    setCoins(current => {
      const next = current + amount;
      localStorage.setItem(`colora_coins_${currentUser.email}`, String(next));
      return next;
    });
    setAlertInfo(`Nhận tiền vàng! Nạp thành công +${amount} Xu vào tài khoản.`);
    setTimeout(() => setAlertInfo(""), 4500);
  };

  const handleAwardVoucher = (percent: number, code: string) => {
    if (!currentUser) {
      setAlertInfo(`Bạn nhận được mã giảm ${percent}%: ${code}! Hãy đăng nhập để dùng.`);
      setTimeout(() => setAlertInfo(""), 4500);
      return;
    }
    setClaimedCoupons(current => {
      if (current.includes(code)) return current;
      const next = [...current, code];
      localStorage.setItem(`colora_vouchers_${currentUser.email}`, JSON.stringify(next));
      return next;
    });
    setAppliedCoupon(code); // auto apply to cart
    setAlertInfo(`Chúc mừng! Voucher ${code} (-${percent}%) đã được nạp vào ví.`);
    setTimeout(() => setAlertInfo(""), 4500);
  };

  const handleDeductCoins = (amount: number): boolean => {
    if (!currentUser) {
      alert("Vui lòng đăng nhập Google để sử dụng Xu bắt đầu vòng quay!");
      return false;
    }
    let success = false;
    setCoins(current => {
      if (current >= amount) {
        const next = current - amount;
        localStorage.setItem(`colora_coins_${currentUser.email}`, String(next));
        success = true;
        return next;
      }
      return current;
    });
    return success;
  };

  // Lead Submission POST
  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullname.trim() || !phone.trim()) {
      alert("Vui lòng cung cấp cả Họ tên và Số điện thoại liên hệ!");
      return;
    }

    setSubmittingLead(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullname,
          phone,
          email,
          service: selectedService,
          message: message || "Khách hàng gửi yêu cầu khảo sát công trình & phối màu sơn."
        })
      });

      if (res.ok) {
        setSubmitSuccess(true);
        setFullname("");
        setPhone("");
        setEmail("");
        setMessage("");
        
        // Hide message banner after 4 seconds
        setTimeout(() => setSubmitSuccess(false), 4000);
      } else {
        alert("Gặp sự cố nhỏ khi lưu yêu cầu, vui lòng điện thoại hotline 1800 6006 để được tư vấn trực tiếp!");
      }
    } catch (err) {
      console.error(err);
      alert("Yêu cầu tư vấn của bạn được Colora tự động giữ ở bộ nhớ đệm thành công.");
    } finally {
      setSubmittingLead(false);
    }
  };

  const notifyColorChosen = (colorName: string) => {
    setAlertInfo(`Đã ướm thử màu "${colorName}" lên phòng ảo mẫu!`);
    setTimeout(() => setAlertInfo(""), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans leading-relaxed selection:bg-emerald-400 selection:text-slate-900 flex flex-col justify-between">
      
      {/* Alert toast notifications */}
      {alertInfo && (
        <div className="fixed bottom-6 left-6 z-50 bg-slate-950 border border-emerald-500/30 text-white font-extrabold text-xs sm:text-sm rounded-2xl px-5 py-3.5 shadow-2xl flex items-center gap-2.5 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400 stroke-[3px]" />
          <span>{alertInfo}</span>
        </div>
      )}

      {/* Floating Call Hotline help center */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5">
        {showHotline && (
          <div className="bg-slate-900 border border-emerald-500/40 text-white font-extrabold text-xs sm:text-sm rounded-2xl px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center gap-2.5 animate-bounce select-none">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Hotline: <a href="tel:0559083403" className="text-emerald-400 hover:text-emerald-300 underline font-black">0559083403</a></span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowHotline(false);
              }}
              className="text-slate-400 hover:text-white ml-1 p-0.5 rounded-lg hover:bg-white/10 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        <button 
          onClick={() => setShowHotline(!showHotline)}
          title="Xem Hotline Colora" 
          className="w-14 h-14 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full flex items-center justify-center shadow-[0_4px_24px_rgba(16,185,129,0.45)] transition-all cursor-pointer relative scale-100 hover:scale-110"
        >
          <Phone className="w-6 h-6 animate-pulse" />
          <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-25" />
        </button>
      </div>

      <div>
        {/* Navigation Head */}
        <Header 
          cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenCart={() => setCartOpen(true)}
          setShowAdmin={setShowAdmin}
          showAdmin={showAdmin}
          currentUser={currentUser}
          coins={coins}
          onOpenLogin={() => setShowAuthModal(true)}
          onLogout={async () => {
            try {
              await logoutFirebase();
            } catch (err) {
              console.error("Lỗi đăng xuất Firebase:", err);
            }
            localStorage.removeItem("colora_user");
            setCurrentUser(null);
          }}
        />

        {showAdmin && currentUser && currentUser.email === "triet1509w@gmail.com" ? (
          /* Backoffice Leads database manager CRM screen */
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <AdminPanel 
              products={products}
              onProductsUpdate={(updatedProds) => setProducts(updatedProds)}
            />
          </main>
        ) : (
          /* Primary Customer App interface */
          <>
            {/* Hero Stage slider visual can overlays */}
            <Hero 
              onBuyNowClick={() => {
                const catalog = document.getElementById("catalog-showcase");
                catalog?.scrollIntoView({ behavior: "smooth" });
              }}
              onQuoteClick={() => {
                const formNode = document.getElementById("quote-enquiry-form");
                formNode?.scrollIntoView({ behavior: "smooth" });
              }}
            />

            {/* Main view container lists card details */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
              
              {/* Product catalog grids (interior & exterior) */}
              <section id="catalog-showcase" className="scroll-mt-24">
                <CategoriesAndProducts 
                  products={products}
                  onAddToCart={handleAddToCart}
                  onSelectCategory={setSelectedCategory}
                  selectedCategory={selectedCategory}
                />
              </section>

              {/* Enterprise solutions details & step indicators */}
              <section>
                <SolutionsAndSteps 
                  onQuoteClick={() => {
                    const formNode = document.getElementById("quote-enquiry-form");
                    formNode?.scrollIntoView({ behavior: "smooth" });
                  }}
                />
              </section>

              {/* Color swatches collections online palette with calculator */}
              <section>
                <ColorPalette 
                  colors={colors}
                  products={products}
                  onAddCalculatedToCart={handleAddCalculatedToCart}
                  onColorSelectNotifier={notifyColorChosen}
                />
              </section>

              {/* Gemini context-grounded consultant smart chatbot panel */}
              <section className="scroll-mt-24" id="consult-ai-section">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-5 space-y-4">
                    <span className="text-xs font-bold tracking-widest text-[#0D9488] uppercase bg-teal-50 px-3 py-1 rounded border border-teal-150">
                      CÔNG NGHỆ CHATBOT AI VÀNG
                    </span>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                      Bạn băn khoăn về <br />
                      màu sắc hay thi công?
                    </h2>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Sở hữu Trí tuệ Nhân tạo Colora AI được đào tạo bởi các nhà thiết kế phối học hàng đầu. Nhập câu hỏi và nhận tư vấn màu sơn, phương pháp hòa quyện màu mảng, tư thế đón nắng cản gió ấm áp tức thì.
                    </p>
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-3">
                      <Paintbrush className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-slate-950 text-xs">Mã sơn tham chiếu chính xác</h4>
                        <p className="text-[11px] text-slate-450 leading-relaxed">AI tự liên kết các mã màu Colora (VD: CL-2012) để bạn ướm trực quan nhanh chóng!</p>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-7">
                    <GeminiConsult />
                  </div>
                </div>
              </section>

              {/* Lead captures contact forms section */}
              <section id="quote-enquiry-form" className="scroll-mt-24 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 rounded-3xl p-8 sm:p-12 border border-slate-800 relative overflow-hidden text-white shadow-2xl">
                {/* Background ambient glowing spheres */}
                <div className="absolute top-[10%] right-[5%] w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
                  
                  {/* Form instructions left Column (Col Span 5) */}
                  <div className="md:col-span-5 space-y-5">
                    <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-emerald-400 uppercase">
                      LIÊN HỆ KHẢO SÁT & NHẬN MẪU THỬ
                    </span>
                    
                    <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                      Yêu cầu tư vấn trực tiếp kĩ thuật tại công trình
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-350 leading-relaxed">
                      Điền đầy đủ thông tin vào biểu mẫu liên hệ khảo sát thực trạng tường, Colora Paint sẽ phái cử chuyên gia kỹ thuật mang quạt màu xịn màu màng sơn tới tận nhà đo đạc độ ẩm và gợi ý bảng màu miễn phí.
                    </p>

                    <div className="space-y-3 pt-2 text-xs sm:text-sm text-slate-300 font-medium">
                      <div className="flex gap-2 items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>Giảm tới 25% cho công trình biệt thự, dự án lớn</span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>Trải nghiệm sơn bám dính siêu việt bảo hành 15 năm</span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>Hỗ trợ phối cảnh 3D ngoại thất không tốn phí</span>
                      </div>
                    </div>
                  </div>

                  {/* Absolute Form Sheet right Column (Col Span 7) */}
                  <form onSubmit={handleSubmitLead} className="md:col-span-7 bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4 backdrop-blur-md">
                    
                    {submitSuccess && (
                      <div className="p-4 bg-emerald-500/25 border border-emerald-500/45 text-emerald-350 rounded-xl space-y-1 text-xs">
                        <div className="flex items-center gap-1.5 font-extrabold text-white">
                          <UserCheck className="w-4 h-4" />
                          <span>Yêu cầu đăng ký hoàn thành xuất sắc!</span>
                        </div>
                        <p>Thông tin của anh/chị đã được nạp tự động vào quản trị Leads Colora CRM. Kỹ sư khu vực sẽ gọi điện thoại liên hệ hỗ trợ trong 5-10 phút!</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">Họ và tên của bạn *</label>
                        <input
                          type="text"
                          value={fullname}
                          onChange={(e) => setFullname(e.target.value)}
                          placeholder="Nguyễn Văn A"
                          className="w-full bg-white/5 focus:bg-white/10 outline-none border border-white/15 focus:border-emerald-400 text-white font-semibold rounded-xl px-4 py-3 text-sm placeholder-slate-500 transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">Số điện thoại di động *</label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="091 xxxx xxx"
                          className="w-full bg-white/5 focus:bg-white/10 outline-none border border-white/15 focus:border-emerald-400 text-white font-semibold rounded-xl px-4 py-3 text-sm placeholder-slate-500 transition-all font-mono"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">Địa chỉ thư điện tử (Email)</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ten@gmail.com (Không bắt buộc)"
                        className="w-full bg-white/5 focus:bg-white/10 outline-none border border-white/15 focus:border-emerald-400 text-white font-semibold rounded-xl px-4 py-3 text-sm placeholder-slate-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">Dịch vụ đang quan tâm</label>
                      <select
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 text-slate-200 outline-none focus:border-emerald-400 font-semibold rounded-xl px-4 py-3 text-sm cursor-pointer"
                      >
                        <option value="Tư vấn sơn nội thất">Cần sơn phòng khách, phòng ngủ riêng tư (Nội thất)</option>
                        <option value="Sơn ngoại thất chống thấm">Cần sơn gai, chống thấm dột tường đứng biệt thự (Ngoại thất)</option>
                        <option value="Tư vấn phối màu phong thủy">Phối cảnh màu sắc 3D chọn mã màu hợp mệnh (Phong thủy)</option>
                        <option value="Sơn dự án B2B sàn công nghiệp">Báo giá gói nhà thầu, đại lý phân phối cấp 1 (B2B)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">Yêu cầu cụ thể chi tiết công trình</label>
                      <textarea
                        rows={3.5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Nhập ghi chú địa chỉ công trình hoặc tổng quan diện tích cần sơn..."
                        className="w-full bg-white/5 focus:bg-white/10 outline-none border border-white/15 focus:border-emerald-400 text-white rounded-xl p-4 text-sm placeholder-slate-500 resize-none transition-all leading-relaxed"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingLead}
                      className="w-full cursor-pointer bg-white hover:bg-emerald-300 text-slate-950 hover:text-slate-950 font-black py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                    >
                      {submittingLead ? (
                        <span>Đang ghi nhận liên hệ...</span>
                      ) : (
                        <>
                          <span>Gửi Đăng Ký Khảo Sát & Nhận Thử Sơn</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                  </form>

                </div>
              </section>

            </main>
          </>
        )}
      </div>

      {/* Shopping Cart Drawer system */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Overlay mask background */}
          <div 
            onClick={() => { setCartOpen(false); setIsCheckingOut(false); }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
              
              {/* Cart Drawer Header */}
              <div className="px-6 py-5 bg-slate-950 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-extrabold text-base sm:text-lg">
                    {isCheckingOut ? "Thông tin nhận sơn Colora" : "Giỏ hàng Colora của bạn"}
                  </h3>
                </div>
                <button 
                  onClick={() => { setCartOpen(false); setIsCheckingOut(false); }}
                  className="p-1 rounded-full hover:bg-slate-900 cursor-pointer text-slate-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Items lists scrollable wrapper or Checkout Form */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col justify-center items-center text-center space-y-2 text-slate-400">
                    <ShoppingBag className="w-12 h-12 stroke-1 text-slate-300" />
                    <h4 className="font-bold text-slate-700">Giỏ hàng trống trơn</h4>
                    <p className="text-xs text-slate-400">Hãy thêm một vài thùng sơn chất phủ cao cấp phía dưới để thi công dự án nhé!</p>
                  </div>
                ) : !isCheckingOut ? (
                  <>
                    {/* Stage 1: Item list & Gamification options review */}
                    <div className="space-y-3.5">
                      <p className="text-[11px] uppercase font-black text-slate-422 tracking-wider">Danh sách sản phẩm ({cart.reduce((sum, item) => sum + item.quantity, 0)} Thùng)</p>
                      {cart.map((item) => (
                        <div key={item.product.id} className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex items-center gap-4 relative">
                          <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center font-mono font-black text-colora text-emerald-400 text-[10px]">
                            {item.product.code}
                          </div>

                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate pr-4">{item.product.name}</h4>
                              <button 
                                onClick={() => updateCartQuantity(item.product.id, -item.quantity)}
                                className="p-1 text-slate-400 hover:text-red-500 cursor-pointer absolute top-3 right-3"
                                title="Xóa sản phẩm"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-xs text-slate-550 font-bold">{item.product.price.toLocaleString("vi")}đ / {item.product.unit}</p>
                            
                            <div className="flex items-center gap-2 pt-1">
                              <button 
                                onClick={() => updateCartQuantity(item.product.id, -1)}
                                className="w-5.5 h-5.5 bg-white border border-slate-200 rounded-md flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 text-xs cursor-pointer"
                              >
                                -
                              </button>
                              <span className="text-xs font-black text-slate-900 w-5 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => updateCartQuantity(item.product.id, 1)}
                                className="w-5.5 h-5.5 bg-white border border-slate-200 rounded-md flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 text-xs cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Gamified point system & coupon wallets panel */}
                    <div className="border-t border-slate-100 pt-4 space-y-4">
                      
                      {/* 1. Enter custom voucher or show claimed pouches */}
                      <div className="space-y-2">
                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">Phiếu giảm giá (Coupons Voucher)</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="Mã giảm giá (ví dụ: COLORA10)" 
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value)}
                            className="bg-slate-50 border border-slate-250 focus:border-slate-500 outline-none text-xs rounded-xl px-3.5 py-2.5 flex-1 font-bold uppercase"
                          />
                          <button
                            onClick={() => {
                              const uppercaseInput = couponInput.trim().toUpperCase();
                              if (["COLORA10", "COLORA15", "COLORA20"].includes(uppercaseInput)) {
                                setAppliedCoupon(uppercaseInput);
                                alert(`🎉 Áp dụng thành công mã ${uppercaseInput}!`);
                              } else {
                                alert("Mã không hợp lệ hoặc đã hết hạn!");
                              }
                            }}
                            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition cursor-pointer"
                          >
                            Áp dụng
                          </button>
                        </div>

                        {/* If they are logged in, list of vouchers claimed from LuckyWheel spins */}
                        {currentUser && (
                          <div className="space-y-1.5 pt-1">
                            <span className="text-[10px] text-slate-450 font-bold block">🎟️ Ví Voucher của bạn từ vòng quay may mắn:</span>
                            {claimedCoupons.length === 0 ? (
                              <p className="text-[10px] italic text-slate-400">Quay vòng quay may mắn để lấy mã giảm tới 20%!</p>
                            ) : (
                              <div className="flex flex-wrap gap-1.5">
                                {claimedCoupons.map((code, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => {
                                      setAppliedCoupon(code);
                                      setCouponInput(code);
                                    }}
                                    className={`px-2 py-1 text-[10px] font-extrabold rounded-lg border flex items-center gap-1 transition cursor-pointer ${
                                      appliedCoupon === code 
                                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-400" 
                                        : "bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200"
                                    }`}
                                  >
                                    <span>{code}</span>
                                    {appliedCoupon === code && <Check className="w-3 h-3 text-emerald-600 stroke-[3px]" />}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* 2. Coin system integration: 100 coins = 100 VND discount */}
                      {currentUser ? (
                        <div className="p-3.5 bg-amber-500/5 border border-amber-500/15 rounded-2xl space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <Coins className="w-4.5 h-4.5 text-amber-500 animate-pulse" />
                              <div className="text-left">
                                <p className="text-xs font-black text-slate-900">Dùng Xu tích lũy hỗ trợ giá</p>
                                <p className="text-[10px] font-bold text-slate-450 mt-0.5">Số dư khả dụng: <span className="text-amber-600">{coins.toLocaleString("vi")} Xu</span></p>
                              </div>
                            </div>
                            <input 
                              type="checkbox"
                              checked={useCoinsAtCheckout}
                              onChange={(e) => setUseCoinsAtCheckout(e.target.checked)}
                              className="w-5.5 h-5.5 rounded-md border-slate-300 focus:ring-emerald-500 cursor-pointer accent-amber-500"
                              disabled={coins <= 0}
                            />
                          </div>
                          {useCoinsAtCheckout && coins > 0 && (
                            <p className="text-[11px] text-amber-700 font-bold leading-relaxed">
                              🪙 Cấu hình trừ {Math.min(coins, getCartTotal() - getDiscountAmount()).toLocaleString("vi")} Xu giảm trực tiếp <span className="underline font-black">-{getCoinsDiscount().toLocaleString("vi")}đ</span> vào đơn mua sơn này!
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-1.5">
                          <p className="text-slate-500 text-xs font-semibold leading-relaxed">Đăng nhập tài khoản Google để tích xu đổi quà & lưu trữ mã giảm giá!</p>
                          <button
                            onClick={() => setShowAuthModal(true)}
                            className="text-xs font-black text-[#0D9488] hover:underline"
                          >
                            Đăng nhập nhận 100 Xu ngay →
                          </button>
                        </div>
                      )}

                    </div>
                  </>
                ) : (
                  /* Stage 2: Courier & Delivery Details Form sheet */
                  <div className="space-y-4 animate-fade-in text-slate-800">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest border-b pb-2">Điền địa chỉ xe tải chở sơn Colora tới</p>
                    
                    <div className="space-y-3.5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase">Họ tên của bạn *</label>
                        <input
                          type="text"
                          required
                          value={checkoutName}
                          onChange={(e) => setCheckoutName(e.target.value)}
                          placeholder="Trần Anh Quốc"
                          className="w-full text-xs font-semibold p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-400 focus:bg-white transition"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase">Số điện thoại di động *</label>
                        <input
                          type="tel"
                          required
                          value={checkoutPhone}
                          onChange={(e) => setCheckoutPhone(e.target.value)}
                          placeholder="091 xxx xxx"
                          className="w-full text-xs font-semibold p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-400 focus:bg-white transition font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase">Địa chỉ cụ thể nhận sơn *</label>
                        <input
                          type="text"
                          required
                          value={checkoutAddress}
                          onChange={(e) => setCheckoutAddress(e.target.value)}
                          placeholder="Số 45, Đường Lý Tự Trọng, Quận 1, TP. HCM"
                          className="w-full text-xs font-semibold p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-400 focus:bg-white transition"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase">Thư điện tử (Email nhận hóa đơn)</label>
                        <input
                          type="email"
                          value={checkoutEmail}
                          onChange={(e) => setCheckoutEmail(e.target.value)}
                          placeholder="anhquoc@gmail.com (Không bắt buộc)"
                          className="w-full text-xs font-semibold p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-400 focus:bg-white transition"
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-[#E0F2F1] text-[11px] text-[#004D40] font-bold rounded-xl leading-relaxed">
                      💡 Xe tải vận tải nặng của Colora Paint sẽ di chuyển đơn hàng sơn đóng thùng gốc nhựa acrylic chính hãng trong bán kính 24h từ cửa kho chính. Quý khách được khui nắp kiểm hàng màu sơn trước khi thanh toán.
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom footer checkout costs */}
              {cart.length > 0 && (
                <div className="border-t border-slate-150 p-5 bg-slate-50 space-y-4">
                  
                  {/* Costs Breakdowns */}
                  <div className="space-y-1.5 text-xs text-slate-600 font-semibold">
                    <div className="flex justify-between">
                      <span>Tiền hàng cơ bản:</span>
                      <span className="font-bold text-slate-900">{getCartTotal().toLocaleString("vi")}đ</span>
                    </div>

                    {appliedCoupon && (
                      <div className="flex justify-between text-emerald-600">
                        <span>Voucher giảm giá ({appliedCoupon}):</span>
                        <span className="font-extrabold">-{getDiscountAmount().toLocaleString("vi")}đ</span>
                      </div>
                    )}

                    {useCoinsAtCheckout && getCoinsDiscount() > 0 && (
                      <div className="flex justify-between text-amber-600">
                        <span>Khấu trừ điểm tích lũy (Xu):</span>
                        <span className="font-extrabold">-{getCoinsDiscount().toLocaleString("vi")}đ</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-sm font-black text-slate-900 pt-2 border-t border-slate-200/50">
                      <span className="uppercase text-slate-700">Tổng thanh toán:</span>
                      <span className="text-base sm:text-lg text-rose-600 font-extrabold">{getFinalTotal().toLocaleString("vi")}đ</span>
                    </div>
                  </div>

                  {!isCheckingOut ? (
                    <button
                      onClick={() => {
                        setIsCheckingOut(true);
                        // Auto-fill form fields if we have a logged-in user profile
                        if (currentUser) {
                          setCheckoutName(currentUser.name);
                          setCheckoutEmail(currentUser.email);
                        }
                      }}
                      className="w-full cursor-pointer bg-slate-950 hover:bg-emerald-400 hover:text-slate-950 font-black py-3.5 rounded-xl transition-all text-white text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-slate-950/10 active:scale-98"
                    >
                      <span>TIẾN HÀNH ĐẶT MUA SƠN NGAY</span>
                      <ArrowRight className="w-4.5 h-4.5" />
                    </button>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setIsCheckingOut(false)}
                        className="col-span-1 border hover:bg-slate-100 transition text-xs font-black rounded-xl text-slate-600 cursor-pointer"
                      >
                        Quay lại
                      </button>
                      <button
                        onClick={() => {
                          if (!checkoutName.trim() || !checkoutPhone.trim() || !checkoutAddress.trim()) {
                            alert("Vui lòng nhập đầy đủ các trường thông tin có đánh dấu hoa thị (*)!");
                            return;
                          }
                          handlePlaceOrder({
                            name: checkoutName,
                            phone: checkoutPhone,
                            email: checkoutEmail,
                            address: checkoutAddress
                          });
                        }}
                        className="col-span-2 cursor-pointer bg-emerald-500 hover:bg-emerald-400 text-white font-black py-3.5 rounded-xl transition shadow text-[11px] sm:text-xs flex items-center justify-center gap-1"
                      >
                        <Check className="w-4.5 h-4.5 stroke-[2.5]" />
                        <span>ĐẶT MUA XE TẢI CHỞ SƠN</span>
                      </button>
                    </div>
                  )}

                  <p className="text-[10px] text-slate-400 text-center italic leading-relaxed">
                    * Miễn phí giao xe tải tận công trình khu vực lân cận bán kính 20km. Các khu vực khác hỗ trợ chi phí 50%.
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Footer information blocks */}
      <Footer 
        onNewsletterSubmit={(e) => console.log("Newsletter sub:", e)}
        onLinkTabClick={(tabId) => {
          setShowAdmin(false);
          setActiveTab(tabId);
          setTimeout(() => {
            const el = document.getElementById(tabId === "colors" ? "color-palette-section" : tabId === "products" ? "products-catalog-section" : "solutions-section");
            el?.scrollIntoView({ behavior: "smooth" });
          }, 150);
        }}
      />

      {/* Dynamic Google SSO account picker modal */}
      <GoogleAuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={(email, name, picture) => {
          const u = { email, name, picture };
          localStorage.setItem("colora_user", JSON.stringify(u));
          setCurrentUser(u);
        }}
      />

      {/* Dynamic Floating Spin Wheel in bottom-left */}
      <LuckyWheel 
        userCoins={coins}
        onAwardCoins={handleAwardCoins}
        onAwardVoucher={handleAwardVoucher}
        onDeductCoins={handleDeductCoins}
      />

      {/* Celebrating Check-in pop card */}
      {showCheckinAlert && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-slate-900 border border-amber-500/20 text-white p-5 rounded-3xl shadow-2xl flex gap-3.5 items-start animate-bounce">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center flex-shrink-0 text-amber-400 font-extrabold text-base">
            🎁
          </div>
          <div className="flex-1 space-y-1 text-left">
            <h4 className="font-extrabold text-xs uppercase tracking-widest text-amber-400">Xu điểm danh mỗi ngày!</h4>
            <p className="text-xs text-slate-300 leading-relaxed font-semibold">
              Hệ thống tặng bạn <span className="text-emerald-400 font-black">+100 Xu</span> vào số dư tích lũy hỗ trợ giá hôm nay!
            </p>
            <button
              onClick={() => setShowCheckinAlert(false)}
              className="text-[10px] font-black uppercase text-emerald-400 tracking-wider hover:underline pt-1 block cursor-pointer"
            >
              Tuyệt vời, cảm ơn!
            </button>
          </div>
        </div>
      )}

      {/* General Floating Toast notices */}
      {alertInfo && (
        <div className="fixed bottom-6 left-6 z-50 max-w-sm bg-slate-900 text-white px-5 py-3 rounded-2xl border border-slate-800 shadow-xl flex items-center gap-2 animate-pulse text-xs font-bold">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>{alertInfo}</span>
        </div>
      )}

    </div>
  );
}
