import React, { useState, useEffect } from "react";
import { 
  Users, CheckCircle2, TrendingUp, Sparkles, Filter, 
  PhoneCall, Mail, Calendar, FileText, Check, Trash 
} from "lucide-react";
import { Lead } from "../types";

export default function LeadsManager() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");
  const [confirmDeleteLeadId, setConfirmDeleteLeadId] = useState<string | null>(null);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/leads");
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
      }
    } catch (err) {
      console.error("Failed to fetch leads", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/leads/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) {
        const data = await res.json();
        setMessage(`Cập nhật thành công trạng thái Lead của anh/chị sang "${newStatus}"!`);
        setTimeout(() => setMessage(""), 3000);
        
        // Update local state smoothly
        setLeads(prev => prev.map(l => l.id === id ? { ...l, status: data.lead.status } : l));
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
        setMessage("Đã xóa lead tư vấn khỏi CRM thành công!");
        setTimeout(() => setMessage(""), 3000);
        setConfirmDeleteLeadId(null);
      } else {
        setMessage("Có lỗi xảy ra khi thực hiện xóa lead.");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusLabelAndStyle = (status: string) => {
    switch (status) {
      case "new":
        return { label: "Mới (Chưa gọi)", style: "bg-blue-100 text-blue-900 border-blue-200" };
      case "contacted":
        return { label: "Đã gọi tư vấn", style: "bg-amber-100 text-amber-950 border-amber-200" };
      case "qualified":
        return { label: "Đủ điều kiện B2B", style: "bg-purple-100 text-purple-900 border-purple-200" };
      case "won":
        return { label: "Đã chốt Hợp đồng", style: "bg-emerald-100 text-emerald-950 border-emerald-200" };
      case "lost":
        return { label: "Thất bại", style: "bg-slate-100 text-slate-700 border-slate-200" };
      default:
        return { label: status, style: "bg-slate-100 text-slate-700 border-slate-200" };
    }
  };

  const filteredLeads = filterStatus === "all" 
    ? leads 
    : leads.filter(l => l.status === filterStatus);

  // Statistics calculation
  const totalLeadsCount = leads.length;
  const newLeadsCount = leads.filter(l => l.status === "new").length;
  const wonLeadsCount = leads.filter(l => l.status === "won").length;
  const winRate = totalLeadsCount > 0 ? Math.round((wonLeadsCount / totalLeadsCount) * 100) : 0;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-500 animate-pulse" />
            Hệ thống Quản lý Leads Colora CRM
          </h3>
          <p className="text-xs text-slate-500">
            Duyệt danh sách liên hệ khách hàng đăng ký mua sơn & nhận tư vấn phối màu được ghi nhận thời gian thực
          </p>
        </div>

        {/* Sync refresh button */}
        <button 
          onClick={fetchLeads}
          className="px-4 py-2 bg-slate-950 hover:bg-emerald-400 hover:text-slate-950 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm active:scale-95 flex items-center gap-1.5"
        >
          <Sparkles className="w-4 h-4 animate-spin-slow" />
          <span>Đồng bộ Ngay</span>
        </button>
      </div>

      {/* Success banner notifications */}
      {message && (
        <div className="p-3 bg-emerald-100 border border-emerald-200 text-emerald-950 text-xs font-bold rounded-xl animate-bounce flex items-center gap-2">
          <Check className="w-4 h-4 stroke-[3px]" />
          <span>{message}</span>
        </div>
      )}

      {/* Statistics pipeline grids */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl">
          <span className="text-[10px] uppercase font-bold text-slate-400">Tổng Số Leads Nhận</span>
          <p className="text-2xl font-black text-slate-950 mt-1">{totalLeadsCount}</p>
        </div>

        <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl">
          <span className="text-[10px] uppercase font-bold text-blue-550">Chưa xử lý (New)</span>
          <p className="text-2xl font-black text-slate-950 mt-1">{newLeadsCount}</p>
        </div>

        <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl">
          <span className="text-[10px] uppercase font-bold text-emerald-550">Chốt thầu (Won)</span>
          <p className="text-2xl font-black text-slate-950 mt-1">{wonLeadsCount}</p>
        </div>

        <div className="bg-purple-50/50 border border-purple-100 p-4 rounded-2xl">
          <span className="text-[10px] uppercase font-bold text-purple-550">Tỷ lệ Chuyển Đổi</span>
          <p className="text-2xl font-black text-slate-950 mt-1">{winRate}%</p>
        </div>

      </div>

      {/* Filter Options */}
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Lọc Trạng Thái:</span>
        <div className="flex flex-wrap gap-1.5 ml-2">
          {["all", "new", "contacted", "won"].map((st) => {
            let label = "Tất cả";
            if (st === "new") label = "Mới";
            if (st === "contacted") label = "Đã gọi";
            if (st === "won") label = "Đã chốt thầu";

            return (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterStatus === st
                    ? "bg-slate-950 text-emerald-400"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Leads Table lists */}
      {isLoading ? (
        <div className="h-40 flex items-center justify-center text-slate-400 font-semibold gap-2">
          <Sparkles className="w-5 h-5 animate-spin text-emerald-500" />
          <span>Đang truy xuất hệ thống CRM dữ liệu...</span>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 font-semibold text-sm">
          Không có Lead phù hợp tiêu chí lọc. Hãy thử gửi thông tin tư vấn vào form liên hệ Colora để nhận lead tự động!
        </div>
      ) : (
        <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-inner">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-300 text-xs font-bold uppercase tracking-wider border-b border-slate-800">
                  <th className="py-3.5 px-4 sm:px-6">Khách hàng</th>
                  <th className="py-3.5 px-4">Đại lượng/Dịch vụ</th>
                  <th className="py-3.5 px-4">Nội dung tin nhắn</th>
                  <th className="py-3.5 px-4 w-[180px]">Mùa trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {filteredLeads.map((item) => {
                  const badge = getStatusLabelAndStyle(item.status);
                  const formattedDate = new Date(item.createdAt).toLocaleDateString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit"
                  });

                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors text-xs sm:text-sm">
                      
                      {/* Customer primary profiles */}
                      <td className="py-4 px-4 sm:px-6 space-y-1.5 text-slate-950">
                        <div className="font-extrabold flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span>{item.name}</span>
                        </div>
                        <div className="space-y-0.5 text-slate-500 text-[11px] font-medium font-mono">
                          <p onClick={() => window.open(`tel:${item.phone}`)} className="flex items-center gap-1 cursor-pointer hover:text-emerald-500 hover:underline">
                            <PhoneCall className="w-3 h-3 text-emerald-400 flex-shrink-0" /> {item.phone}
                          </p>
                          {item.email && (
                            <p className="flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-450 flex-shrink-0" /> {item.email}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Service requested */}
                      <td className="py-4 px-4 text-slate-800 font-semibold">
                        <p>{item.service}</p>
                        <p className="text-[10px] text-slate-400 font-bold font-mono mt-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-300" /> {formattedDate}
                        </p>
                      </td>

                      {/* Brief text contents */}
                      <td className="py-4 px-4 text-slate-500 font-medium max-w-[280px] break-words">
                        <p className="line-clamp-3 text-xs leading-relaxed flex gap-1 items-start">
                          <FileText className="w-3.5 h-3.5 mt-0.5 text-slate-350 flex-shrink-0" />
                          <span>{item.message}</span>
                        </p>
                      </td>

                      {/* Dropdown status update controls */}
                      <td className="py-4 px-4">
                        <div className="space-y-2">
                          <span className={`inline-block px-2.5 py-1 text-[10px] font-black rounded-lg border uppercase tracking-wider ${badge.style}`}>
                            {badge.label}
                          </span>
                          
                          <select
                            value={item.status}
                            onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                            className="block w-full bg-slate-100 hover:bg-slate-200 border border-slate-200 hover:border-slate-300 text-slate-800 rounded-lg px-2.5 py-1 text-xs font-bold cursor-pointer transition-all"
                          >
                            <option value="new">Mới nhận</option>
                            <option value="contacted">Đã gọi hỗ trợ</option>
                            <option value="won">Chốt ký kết</option>
                            <option value="lost">Thất bại</option>
                          </select>

                          {item.status === "lost" && (
                            <button
                              onClick={() => handleDeleteLead(item.id)}
                              className={`w-full h-8 flex items-center justify-center gap-1 border font-bold text-xs rounded-lg transition-all shadow-sm cursor-pointer ${
                                confirmDeleteLeadId === item.id
                                  ? "bg-rose-600 hover:bg-rose-700 border-rose-700 text-white animate-pulse"
                                  : "bg-rose-50 hover:bg-rose-100 border-rose-150 text-rose-600 hover:text-rose-700"
                              }`}
                            >
                              <Trash className="w-3.5 h-3.5" />
                              <span>{confirmDeleteLeadId === item.id ? "Chắc chắn xóa?" : "Xóa lead hỏng"}</span>
                            </button>
                          )}
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
