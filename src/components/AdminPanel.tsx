import React, { useState, useEffect } from "react";
import { 
  Users, CheckCircle2, TrendingUp, Sparkles, Filter, Gift, ShoppingBag,
  PhoneCall, Mail, Calendar, FileText, Check, Trash2, Edit, Plus, X, Package, 
  ArrowRight, ShieldCheck, RefreshCw, Layers
} from "lucide-react";
import { Product, Lead } from "../types";

interface Order {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  discountAmount: number;
  coinsUsed: number;
  couponCode?: string;
  status: "pending" | "processing" | "shipped" | "cancelled";
  createdAt: string;
}

interface AdminPanelProps {
  products: Product[];
  onProductsUpdate: (updatedProducts: Product[]) => void;
}

export default function AdminPanel({
  products,
  onProductsUpdate
}: AdminPanelProps) {
  const [activeAdminTab, setActiveAdminTab] = useState<"leads" | "orders" | "products">("leads");

  // CRM Leads
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filterLeadStatus, setFilterLeadStatus] = useState<string>("all");
  const [isLeadsLoading, setIsLeadsLoading] = useState(true);

  // Orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterOrderStatus, setFilterOrderStatus] = useState<string>("all");
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);

  // Non-blocking iframe-safe click confirm delete states
  const [confirmDeleteOrderId, setConfirmDeleteOrderId] = useState<string | null>(null);
  const [confirmDeleteLeadId, setConfirmDeleteLeadId] = useState<string | null>(null);
  const [confirmDeleteProductId, setConfirmDeleteProductId] = useState<string | null>(null);

  // Edit / Add Product Form Modals
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Target states for forms
  const [prodName, setProdName] = useState("");
  const [prodCode, setProdCode] = useState("");
  const [prodCategory, setProdCategory] = useState<"interior" | "exterior" | "specialty" | "primer">("interior");
  const [prodDescription, setProdDescription] = useState("");
  const [prodPrice, setProdPrice] = useState(1000000);
  const [prodUnit, setProdUnit] = useState("Thùng 15L");
  const [prodFeatures, setProdFeatures] = useState("");
  const [prodBadge, setProdBadge] = useState("");
  const [prodImage, setProdImage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert("Ảnh quá lớn! Vui lòng chọn ảnh có dung lượng dưới 8MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProdImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Sync operations
  const fetchLeads = async () => {
    setIsLeadsLoading(true);
    try {
      const res = await fetch("/api/admin/leads");
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
      }
    } catch (err) {
      console.error("Failed to fetch leads", err);
    } finally {
      setIsLeadsLoading(false);
    }
  };

  const fetchOrders = async () => {
    setIsOrdersLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setIsOrdersLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchOrders();
  }, []);

  const triggerToast = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  // 1. Leads Operations
  const handleUpdateLeadStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/leads/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) {
        const data = await res.json();
        triggerToast("Cập nhật trạng thái liên hệ thành công!");
        setLeads(prev => prev.map(l => l.id === id ? { ...l, status: data.lead.status } : l));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 2. Orders Operations
  const handleUpdateOrderStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/orders/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus as any } : o));
        triggerToast("Cập nhật trạng thái đơn hàng thành công!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (confirmDeleteOrderId !== orderId) {
      setConfirmDeleteOrderId(orderId);
      setTimeout(() => {
        setConfirmDeleteOrderId(prev => prev === orderId ? null : prev);
      }, 3500);
      return;
    }
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setOrders(prev => prev.filter(o => o.id !== orderId));
        triggerToast("Đã xóa đơn hàng thành công rực rỡ!");
        setConfirmDeleteOrderId(null);
      } else {
        triggerToast("Có lỗi xảy ra khi thực hiện xóa đơn.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (confirmDeleteLeadId !== leadId) {
      setConfirmDeleteLeadId(leadId);
      setTimeout(() => {
        setConfirmDeleteLeadId(prev => prev === leadId ? null : prev);
      }, 3500);
      return;
    }
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setLeads(prev => prev.filter(l => l.id !== leadId));
        triggerToast("Đã xóa lead tư vấn khỏi CRM!");
        setConfirmDeleteLeadId(null);
      } else {
        triggerToast("Có lỗi xảy ra khi thực hiện xóa lead.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 3. Products Operations
  const resetProductForm = () => {
    setProdName("");
    setProdCode("");
    setProdCategory("interior");
    setProdDescription("");
    setProdPrice(1200000);
    setProdUnit("Thùng 15L");
    setProdFeatures("Không mùi, Siêu phủ, Dễ lau lau");
    setProdBadge("");
    setProdImage("");
    setEditingProduct(null);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProdName(prod.name);
    setProdCode(prod.code);
    setProdCategory(prod.category);
    setProdDescription(prod.description);
    setProdPrice(prod.price);
    setProdUnit(prod.unit);
    setProdFeatures(prod.features.join(", "));
    setProdBadge(prod.badge || "");
    setProdImage(prod.image || "");
    setShowAddProductModal(true); // Shared modal form
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: prodName,
      code: prodCode,
      category: prodCategory,
      description: prodDescription,
      price: Number(prodPrice),
      unit: prodUnit,
      features: prodFeatures.split(",").map(f => f.trim()).filter(Boolean),
      badge: prodBadge || undefined,
      image: prodImage || undefined
    };

    try {
      let url = "/api/admin/products";
      let method = "POST";

      if (editingProduct) {
        url = `/api/admin/products/${editingProduct.id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        onProductsUpdate(data.products);
        triggerToast(editingProduct ? "Đã lưu chỉnh sửa sản phẩm thành công!" : "Đã thêm sản phẩm Colora mới thành công!");
        setShowAddProductModal(false);
        resetProductForm();
      } else {
        alert("Có lỗi xảy ra khi lưu trữ sản phẩm.");
      }
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi hệ thống khi kết nối tới máy chủ.");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirmDeleteProductId !== productId) {
      setConfirmDeleteProductId(productId);
      setTimeout(() => {
        setConfirmDeleteProductId(prev => prev === productId ? null : prev);
      }, 3500);
      return;
    }
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        const data = await res.json();
        onProductsUpdate(data.products);
        triggerToast("Sản phẩm đã được gỡ bỏ thành công.");
        setConfirmDeleteProductId(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Helpers
  const getLeadBadgeStyle = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-900 border-blue-200";
      case "contacted": return "bg-amber-100 text-amber-950 border-amber-200";
      case "won": return "bg-emerald-100 text-emerald-950 border-emerald-200";
      case "lost": return "bg-slate-100 text-slate-700 border-slate-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getOrderBadgeStyle = (status: string) => {
    switch (status) {
      case "pending": return "bg-sky-100 text-sky-950 border-sky-200";
      case "processing": return "bg-indigo-100 text-indigo-950 border-indigo-200";
      case "shipped": return "bg-emerald-100 text-emerald-950 border-emerald-200 animate-pulse";
      case "cancelled": return "bg-rose-100 text-rose-950 border-rose-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "interior": return "Nội thất";
      case "exterior": return "Ngoại thất";
      case "specialty": return "Chuyên dụng";
      case "primer": return "Sơn lót";
      default: return cat;
    }
  };

  // Filter lists
  const filteredLeads = filterLeadStatus === "all" ? leads : leads.filter(l => l.status === filterLeadStatus);
  const filteredOrders = filterOrderStatus === "all" ? orders : orders.filter(o => o.status === filterOrderStatus);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in text-slate-800">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-150 pb-5">
        <div className="space-y-1">
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-500 stroke-[2.5]" />
            Bảng Quản Trị Hệ Thống Colora Paint (Admin Panel)
          </h3>
          <p className="text-xs text-slate-550">
            Dành riêng cho quản trị viên <span className="font-extrabold text-[#0D9488]">triet1509w@gmail.com</span> để quản lý dữ liệu CRM Leads, Đơn và Danh mục sản phẩm.
          </p>
        </div>

        {/* Sync refresh button */}
        <div className="flex gap-2">
          {activeAdminTab === "leads" && (
            <button 
              onClick={fetchLeads}
              className="px-4 py-2 bg-slate-950 hover:bg-emerald-400 hover:text-slate-950 text-white font-extrabold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Đồng bộ CRM Leads</span>
            </button>
          )}
          {activeAdminTab === "orders" && (
            <button 
              onClick={fetchOrders}
              className="px-4 py-2 bg-slate-950 hover:bg-emerald-400 hover:text-slate-950 text-white font-extrabold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Đồng bộ Đơn hàng</span>
            </button>
          )}
          {activeAdminTab === "products" && (
            <button 
              onClick={() => { resetProductForm(); setShowAddProductModal(true); }}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white hover:text-emerald-950 font-extrabold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Thêm Sản Phẩm Mới</span>
            </button>
          )}
        </div>
      </div>

      {/* Success banner notifications */}
      {successMsg && (
        <div className="p-3.5 bg-emerald-100 border border-emerald-250 text-emerald-950 text-xs font-bold rounded-xl flex items-center gap-2 animate-pulse">
          <Check className="w-4 h-4 stroke-[3px] text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Nav Tabs switches */}
      <div className="border-b border-slate-100">
        <nav className="flex space-x-6 -mb-px" aria-label="Tabs">
          <button
            onClick={() => setActiveAdminTab("leads")}
            className={`border-b-2 py-3 px-1 text-sm font-extrabold cursor-pointer flex items-center gap-2 transition ${
              activeAdminTab === "leads"
                ? "border-emerald-500 text-emerald-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            <Users className="w-4.5 h-4.5" />
            <span>Quản lý Leads CRM ({leads.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab("orders")}
            className={`border-b-2 py-3 px-1 text-sm font-extrabold cursor-pointer flex items-center gap-2 transition ${
              activeAdminTab === "orders"
                ? "border-emerald-500 text-emerald-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            <ShoppingBag className="w-4.5 h-4.5" />
            <span>Quản lý Đơn hàng ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab("products")}
            className={`border-b-2 py-3 px-1 text-sm font-extrabold cursor-pointer flex items-center gap-2 transition ${
              activeAdminTab === "products"
                ? "border-emerald-500 text-emerald-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            <Package className="w-4.5 h-4.5" />
            <span>Danh mục sản phẩm ({products.length})</span>
          </button>
        </nav>
      </div>

      {/* TAB 1 CONTENT: REALTIME CRM LEADS */}
      {activeAdminTab === "leads" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lọc Trạng Thái:</span>
            {["all", "new", "contacted", "won"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterLeadStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  filterLeadStatus === st ? "bg-slate-900 text-emerald-400" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {st === "all" ? "Tất cả" : st === "new" ? "Mới nhận" : st === "contacted" ? "Đã gọi" : "Đã chốt thầu"}
              </button>
            ))}
          </div>

          {isLeadsLoading ? (
            <div className="py-20 text-center text-slate-400 font-semibold flex items-center justify-center gap-2">
              <RefreshCw className="w-4.5 h-4.5 animate-spin" />
              <span>Đang đồng bộ CRM...</span>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-12 text-center border-2 border-dashed border-slate-150 rounded-2xl text-slate-450 font-medium">
              Không tìm thấy lead tư vấn nào phù hợp bộ lọc.
            </div>
          ) : (
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-inner">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-605 text-xs font-black uppercase tracking-wider border-b border-slate-200">
                    <th className="py-3.5 px-4 sm:px-6">Khách hàng</th>
                    <th className="py-3.5 px-4">Đại lượng/Dịch vụ</th>
                    <th className="py-3.5 px-4">Ghi chú yêu cầu</th>
                    <th className="py-3.5 px-4 w-[160px]">Cập nhật</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {filteredLeads.map((item) => {
                    const style = getLeadBadgeStyle(item.status);
                    return (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-4 sm:px-6">
                          <p className="font-extrabold text-slate-900">{item.name}</p>
                          <div className="text-[11px] text-slate-550 font-medium font-mono space-y-0.5 mt-1">
                            <p className="flex items-center gap-1 text-slate-900">
                              <PhoneCall className="w-3 h-3 text-emerald-500" /> {item.phone}
                            </p>
                            {item.email && <p className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" /> {item.email}</p>}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-bold text-slate-800">{item.service}</p>
                          <p className="text-[10px] text-slate-411 font-semibold mt-1">
                            {new Date(item.createdAt).toLocaleString("vi-VN")}
                          </p>
                        </td>
                        <td className="py-4 px-4 text-slate-550 max-w-[280px] break-words font-medium leading-relaxed">
                          {item.message}
                        </td>
                        <td className="py-4 px-4 space-y-2">
                          <select
                            value={item.status}
                            onChange={(e) => handleUpdateLeadStatus(item.id, e.target.value)}
                            className="bg-slate-100 hover:bg-slate-150 border border-slate-200 outline-none text-slate-900 rounded-lg px-2.5 py-1.5 text-xs font-bold cursor-pointer transition w-full"
                          >
                            <option value="new">🆕 Mới nhận</option>
                            <option value="contacted">📞 Đang gọi</option>
                            <option value="won">🎉 Đã chốt thầu</option>
                            <option value="lost">❌ Thất bại</option>
                          </select>

                          {item.status === "lost" && (
                            <button
                              onClick={() => handleDeleteLead(item.id)}
                              className={`w-full h-8 flex items-center justify-center gap-1 border font-extrabold text-[11px] rounded-lg transition-all shadow-sm cursor-pointer ${
                                confirmDeleteLeadId === item.id
                                  ? "bg-rose-600 hover:bg-rose-700 border-rose-750 text-white animate-pulse"
                                  : "bg-rose-50 hover:bg-rose-100 border-rose-150 text-rose-600 hover:text-rose-700"
                              }`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>{confirmDeleteLeadId === item.id ? "Xác nhận xóa?" : "Xóa lead hỏng"}</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2 CONTENT: INTERACTIVE ORDER PROCESSING */}
      {activeAdminTab === "orders" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lọc Trạng Thái Đơn:</span>
            {["all", "pending", "processing", "shipped", "cancelled"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterOrderStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  filterOrderStatus === st ? "bg-slate-900 text-emerald-400" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {st === "all" ? "Tất cả" : st === "pending" ? "Chờ duyệt" : st === "processing" ? "Đang xử lý" : st === "shipped" ? "Đã giao" : "Đã hủy"}
              </button>
            ))}
          </div>

          {isOrdersLoading ? (
            <div className="py-20 text-center text-slate-400 font-semibold flex items-center justify-center gap-2">
              <RefreshCw className="w-4.5 h-4.5 animate-spin" />
              <span>Đang đồng bộ Đơn hàng...</span>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center border-2 border-dashed border-slate-150 rounded-2xl text-slate-450 font-medium">
              Chưa ghi nhận đơn đặt mua sơn nào phù hợp tiêu chuẩn lọc.
            </div>
          ) : (
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-inner">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-605 text-xs font-black uppercase tracking-wider border-b border-slate-200">
                    <th className="py-3.5 px-4 sm:px-6">Đơn Hàng / Khách mua</th>
                    <th className="py-3.5 px-4">Sản Phẩm Đặt</th>
                    <th className="py-3.5 px-4">Tổng Thanh Toán</th>
                    <th className="py-3.5 px-4 w-[160px]">Thay đổi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {filteredOrders.map((ord) => {
                    const style = getOrderBadgeStyle(ord.status);
                    return (
                      <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-4 sm:px-6 space-y-1.5">
                          <p className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                            <span className="font-mono bg-slate-900 text-white px-2 py-0.5 rounded text-[10px]">{ord.id}</span>
                            <span>{ord.name}</span>
                          </p>
                          <div className="text-[11px] text-slate-550 font-medium font-mono space-y-0.5 mt-1">
                            <p className="flex items-center gap-1 text-slate-900 font-bold">
                              <PhoneCall className="w-3 h-3 text-emerald-500" /> {ord.phone}
                            </p>
                            <p className="flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-400" /> {ord.email}
                            </p>
                            <p className="text-slate-500 text-[10px]">📍 {ord.address}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-xs">
                          <div className="space-y-1 font-semibold text-slate-700">
                            {ord.items.map((item, idx) => (
                              <p key={idx} className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md inline-block max-w-full truncate text-[11px]">
                                {item.productName} <span className="text-emerald-600 font-black">x{item.quantity}</span>
                              </p>
                            ))}
                          </div>
                          <p className="text-[10px] text-slate-411 font-semibold mt-1">
                            🕒 {new Date(ord.createdAt).toLocaleString("vi-VN")}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-black text-rose-600 text-sm">{ord.totalAmount.toLocaleString("vi")}đ</p>
                          <div className="text-[10px] text-slate-500 mt-1 font-semibold space-y-0.5">
                            {ord.discountAmount > 0 && <p className="text-emerald-600">💸 Giảm giá: -{ord.discountAmount.toLocaleString("vi")}đ</p>}
                            {ord.coinsUsed > 0 && <p className="text-amber-600">🪙 Dùng {ord.coinsUsed} Xu (-{(ord.coinsUsed * 100).toLocaleString("vi")}đ)</p>}
                            {ord.couponCode && <p className="bg-slate-150 inline-block px-1.5 py-0.5 rounded font-mono text-[9px] uppercase">🎟️ {ord.couponCode}</p>}
                          </div>
                        </td>
                        <td className="py-4 px-4 space-y-2">
                          <select
                            value={ord.status}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                            className="bg-slate-100 hover:bg-slate-150 border border-slate-200 outline-none text-slate-900 rounded-lg px-2.5 py-1.5 text-xs font-bold cursor-pointer transition w-full"
                          >
                            <option value="pending">⏳ Chờ duyệt</option>
                            <option value="processing">⚙️ Đang xử lý</option>
                            <option value="shipped">🚚 Đã giao hàng</option>
                            <option value="cancelled">❌ Đơn hủy</option>
                          </select>

                          {ord.status === "cancelled" && (
                            <button
                              onClick={() => handleDeleteOrder(ord.id)}
                              className={`w-full h-8 flex items-center justify-center gap-1 border font-extrabold text-[11px] rounded-lg transition-all shadow-sm cursor-pointer ${
                                confirmDeleteOrderId === ord.id
                                  ? "bg-rose-600 hover:bg-rose-700 border-rose-750 text-white animate-pulse"
                                  : "bg-rose-50 hover:bg-rose-100 border-rose-150 text-rose-600 hover:text-rose-700"
                              }`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>{confirmDeleteOrderId === ord.id ? "Xác nhận xóa?" : "Xóa đơn hủy này"}</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3 CONTENT: DETAILED PRODUCT GRID AND INVENTORY CONTROLS */}
      {activeAdminTab === "products" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
              <Layers className="w-4 h-4 text-emerald-500" />
              Sản phẩm hiện đang bày bán ({products.length} dòng thành phẩm)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((item) => (
              <div 
                key={item.id} 
                className="p-5 border border-slate-200 bg-slate-50 rounded-2xl hover:shadow-md transition relative flex flex-col justify-between"
              >
                {/* Visual badge highlight */}
                {item.badge && (
                  <span className="absolute top-4 right-4 bg-amber-500 text-slate-950 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase shadow">
                    {item.badge}
                  </span>
                )}

                <div className="space-y-2">
                  <div className="flex gap-3 items-center">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      <img 
                        src={item.image || "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=100&auto=format&fit=crop&q=60"} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="bg-slate-950 text-emerald-400 font-mono font-bold text-[10px] px-2 py-0.5 rounded inline-block">
                        {item.code}
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-sm pr-10 leading-tight">{item.name}</h4>
                    </div>
                  </div>
                  
                  <p className="text-[11px] text-slate-450 uppercase font-black">{getCategoryLabel(item.category)} • {item.unit}</p>
                  
                  <p className="text-xs text-slate-550 leading-relaxed font-semibold line-clamp-3">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.features.slice(0, 3).map((feat, idx) => (
                      <span key={idx} className="bg-slate-200/60 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-medium">
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200/70 pt-4 mt-4">
                  <span className="text-base font-black text-emerald-600">
                    {item.price.toLocaleString("vi")}đ
                  </span>

                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleOpenEditProduct(item)}
                      className="p-2 cursor-pointer bg-white text-slate-700 hover:text-indigo-600 rounded-lg border border-slate-200 hover:bg-slate-100 transition shadow-sm"
                      title="Sửa chi tiết"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(item.id)}
                      className={`p-2 cursor-pointer rounded-lg border transition shadow-sm ${
                        confirmDeleteProductId === item.id
                          ? "bg-rose-600 border-rose-700 text-white animate-pulse"
                          : "bg-white text-slate-700 hover:text-red-600 border-slate-200 hover:bg-slate-100"
                      }`}
                      title={confirmDeleteProductId === item.id ? "Xác nhận xóa sản phẩm" : "Xóa sản phẩm"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MULTIPURPOSE PRODUCT ADD / EDIT MODAL SHEET */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddProductModal(false)} />

          <div className="relative w-full max-w-lg bg-white rounded-3xl border shadow-2xl p-6 overflow-hidden z-10 flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <h4 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                <Layers className="w-5 h-5 text-emerald-500" />
                {editingProduct ? `Cập nhật: ${editingProduct.name}` : "Thêm Thùng Sơn Colora Mới"}
              </h4>
              <button 
                onClick={() => setShowAddProductModal(false)}
                className="p-1 rounded-full hover:bg-slate-100 cursor-pointer text-slate-400 hover:text-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveProduct} className="space-y-4 overflow-y-auto pr-1 flex-1 pb-2">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Tên thành phẩm sơn *</label>
                  <input
                    type="text"
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    placeholder="Sơn chống thấm Colora Guard"
                    className="w-full text-xs sm:text-sm font-semibold p-2.5 bg-slate-50 focus:bg-slate-100 outline-none border border-slate-200 focus:border-emerald-500 rounded-xl transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Mã sản phẩm *</label>
                  <input
                    type="text"
                    value={prodCode}
                    onChange={(e) => setProdCode(e.target.value)}
                    placeholder="CL-CG08"
                    className="w-full text-xs sm:text-sm font-semibold p-2.5 bg-slate-50 focus:bg-slate-100 outline-none border border-slate-200 focus:border-emerald-500 rounded-xl transition font-mono uppercase"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Đơn giá định dạng (VND) *</label>
                  <input
                    type="number"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    min={100000}
                    className="w-full text-xs sm:text-sm font-semibold p-2.5 bg-slate-50 focus:bg-slate-100 outline-none border border-slate-200 focus:border-emerald-500 rounded-xl transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Dung lượng đóng gói *</label>
                  <input
                    type="text"
                    value={prodUnit}
                    onChange={(e) => setProdUnit(e.target.value)}
                    placeholder="Thùng 15L, Bộ 20kg"
                    className="w-full text-xs sm:text-sm font-semibold p-2.5 bg-slate-50 focus:bg-slate-100 outline-none border border-slate-200 focus:border-emerald-500 rounded-xl transition"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Phân khúc mục tiêu *</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value as any)}
                    className="w-full text-xs sm:text-sm font-semibold p-2.5 bg-slate-50 outline-none border border-slate-200 focus:border-emerald-500 rounded-xl cursor-pointer"
                  >
                    <option value="interior">Sơn Nội thất (Interior)</option>
                    <option value="exterior">Sơn Ngoại thất (Exterior)</option>
                    <option value="specialty">Sơn chuyên dụng (Epoxy/Chất phủ)</option>
                    <option value="primer">Sơn lót kháng kiềm (Primer)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Tag nổi bật (Badge)</label>
                  <input
                    type="text"
                    value={prodBadge}
                    onChange={(e) => setProdBadge(e.target.value)}
                    placeholder="Bán chạy, Mới, Cao cấp"
                    className="w-full text-xs sm:text-sm font-semibold p-2.5 bg-slate-50 focus:bg-slate-100 outline-none border border-slate-200 focus:border-emerald-500 rounded-xl transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Đặc điểm chính (cách nhau bằng dấu phẩy) *</label>
                <input
                  type="text"
                  value={prodFeatures}
                  onChange={(e) => setProdFeatures(e.target.value)}
                  placeholder="Kháng nấm mốc tốt, Chống phai màu, Chống thấm sâu"
                  className="w-full text-xs sm:text-sm font-semibold p-2.5 bg-slate-50 focus:bg-slate-100 outline-none border border-slate-200 focus:border-emerald-500 rounded-xl transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Tải ảnh sản phẩm từ thiết bị</label>
                <div className="border-2 border-dashed border-slate-200 hover:border-emerald-500 bg-slate-50/50 hover:bg-slate-50 rounded-2xl p-4 transition text-center relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  
                  {prodImage ? (
                    <div className="flex flex-col items-center gap-2 relative">
                      <img 
                        src={prodImage} 
                        alt="Xem trước hình ảnh" 
                        className="w-24 h-24 object-contain rounded-xl border bg-white shadow-sm"
                      />
                      <div className="space-y-0.5">
                        <p className="text-xs font-black text-emerald-600">Đã chọn ảnh từ thiết bị!</p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setProdImage("");
                          }}
                          className="text-[10px] font-black text-rose-500 hover:text-rose-600 underline cursor-pointer z-20 relative"
                        >
                          Xóa & Chọn ảnh khác
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-2 space-y-2 pointer-events-none">
                      <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                        <Plus className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-slate-700">Tải ảnh lên từ thiết bị</p>
                        <p className="text-[10px] text-slate-400">Kéo thả ảnh hoặc Click vào đây (JPG, PNG)</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Mô tả đặc điểm sản phẩm *</label>
                <textarea
                  rows={3}
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  placeholder="Hệ sơn acrylic gốc nước cực kỳ vững màng bảo vệ môi trường hoàn hảo..."
                  className="w-full text-xs sm:text-sm font-semibold p-3 bg-slate-50 focus:bg-slate-100 outline-none border border-slate-200 focus:border-emerald-500 rounded-xl transition resize-none leading-relaxed"
                  required
                />
              </div>

              {/* Action Operations footer inside modal sheet */}
              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-5 py-2.5 border rounded-xl hover:bg-slate-50 transition font-bold text-xs cursor-pointer text-slate-600"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-950 hover:bg-emerald-500 hover:text-slate-950 text-white font-black text-xs rounded-xl transition flex items-center gap-1 cursor-pointer shadow-md"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingProduct ? "Lưu Chỉnh Sửa" : "Thêm Sản Phẩm"}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
