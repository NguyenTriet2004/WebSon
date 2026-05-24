import React, { useState } from "react";
import { X, AlertCircle, Sparkles, Loader2 } from "lucide-react";
import { signInWithGoogle } from "../firebase";

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (email: string, name: string, picture: string) => void;
}

export default function GoogleAuthModal({ isOpen, onClose, onLoginSuccess }: GoogleAuthModalProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const user = await signInWithGoogle();
      if (user) {
        // Standard user properties from Firebase User Credential
        const email = user.email || "";
        const name = user.displayName || email.split("@")[0] || "Người dùng Colora";
        const picture = user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${name}&backgroundColor=0d9488,10b981,f59e0b`;
        
        onLoginSuccess(email, name, picture);
        onClose();
      } else {
        setErrorMsg("Không lấy được thông tin tài khoản Google. Vui lòng thử lại!");
      }
    } catch (err: any) {
      console.error(err);
      // Friendly, clean helper translation of firebase auth errors
      if (err?.code === "auth/popup-blocked") {
        setErrorMsg("Trình duyệt đã chặn cửa sổ bật lên (popup). Vui lòng cho phép hiện popup và nhấn đăng nhập lại.");
      } else if (err?.code === "auth/popup-closed-by-user") {
        setErrorMsg("Bạn đã đóng cửa sổ đăng nhập Google trước khi hoàn thành.");
      } else if (err?.code === "auth/cancelled-popup-request") {
        setErrorMsg("Yêu cầu đăng nhập đã bị hủy hoặc đang xử lý một cửa sổ khác.");
      } else {
        setErrorMsg(err?.message || "Đăng nhập Google thất bại. Vui lòng thử lại!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="google-auth-modal">
      {/* Background Dim Backdrop */}
      <div 
        className="absolute inset-0 bg-black/75 backdrop-blur-md transition-all duration-300" 
        onClick={loading ? undefined : onClose} 
      />

      {/* Main Panel */}
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-150 flex flex-col z-10 animate-fade-in">
        
        {/* Google Themed Colored Top Bar decoration */}
        <div className="h-1.5 w-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-500" />

        {/* Head Area */}
        <div className="p-6 border-b border-white/[0.06] flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5.04c1.55 0 2.94.53 4.03 1.58l3-3A11.93 11.93 0 0 0 12 0c-4.63 0-8.62 2.63-10.57 6.47l3.52 2.73C5.78 6.47 8.63 5.04 12 5.04z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.82-.07-1.61-.21-2.39H12v4.51h6.44a5.52 5.52 0 0 1-2.4 3.63l3.71 2.87c2.17-2 3.74-4.94 3.74-8.62z"
              />
              <path
                fill="#FBBC05"
                d="M4.95 14.74a7.14 7.14 0 0 1 0-4.48l-3.52-2.73a11.96 11.96 0 0 0 0 9.94l3.52-2.73z"
              />
              <path
                fill="#34A853"
                d="M12 18.96c-3.37 0-6.22-1.43-7.05-4.22l-3.52 2.73c1.95 3.84 5.94 6.47 10.57 6.47a11.75 11.75 0 0 0 8.16-2.95l-3.71-2.87a7.08 7.08 0 0 1-4.45 1.57z"
              />
            </svg>
            <h4 className="font-extrabold text-white text-sm sm:text-base">Liên kết Google Firebase Auth</h4>
          </div>
          <button 
            disabled={loading}
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 cursor-pointer text-slate-400 hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-8 space-y-6 flex flex-col items-center">
          
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 relative">
            <Sparkles className="w-8 h-8 animate-pulse" />
            <div className="absolute inset-0 rounded-2xl bg-emerald-500/20 blur-lg -z-10" />
          </div>

          <div className="text-center space-y-2">
            <h3 className="font-black text-white text-[17px] sm:text-lg">Trải nghiệm Đồng bộ Trực tiếp Firebase</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-[280px] mx-auto">
              Đăng nhập bằng tài khoản Google thật để liên kết an toàn, bảo vệ số dư Xu tích lũy và theo dõi trạng thái đơn hàng.
            </p>
          </div>

          {/* Real Google Auth trigger button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white hover:bg-slate-100 active:scale-95 text-slate-900 font-extrabold text-xs sm:text-sm py-3.5 px-5 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-3 cursor-pointer select-none group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
            ) : (
              <svg className="w-5 h-5 group-hover:scale-105 transition-transform" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5.04c1.55 0 2.94.53 4.03 1.58l3-3A11.93 11.93 0 0 0 12 0c-4.63 0-8.62 2.63-10.57 6.47l3.52 2.73C5.78 6.47 8.63 5.04 12 5.04z"
                />
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.82-.07-1.61-.21-2.39H12v4.51h6.44a5.52 5.52 0 0 1-2.4 3.63l3.71 2.87c2.17-2 3.74-4.94 3.74-8.62z"
                />
                <path
                  fill="#FBBC05"
                  d="M4.95 14.74a7.14 7.14 0 0 1 0-4.48l-3.52-2.73a11.96 11.96 0 0 0 0 9.94l3.52-2.73z"
                />
                <path
                  fill="#34A853"
                  d="M12 18.96c-3.37 0-6.22-1.43-7.05-4.22l-3.52 2.73c1.95 3.84 5.94 6.47 10.57 6.47a11.75 11.75 0 0 0 8.16-2.95l-3.71-2.87a7.08 7.08 0 0 1-4.45 1.57z"
                />
              </svg>
            )}
            <span>{loading ? "Đang xử lý kết nối..." : "Đăng nhập bằng tài khoản Google"}</span>
          </button>

          {/* Feedback error display block */}
          {errorMsg && (
            <div className="w-full p-4 bg-rose-500/10 border border-rose-500/20 text-rose-350 rounded-2xl flex items-start gap-2.5 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-450 flex-shrink-0 mt-0.5" />
              <p className="font-semibold leading-relaxed flex-1">{errorMsg}</p>
            </div>
          )}

          <div className="border-t border-white/[0.04] w-full pt-4 text-center">
            <span className="text-[10px] text-slate-500 font-medium">
              * Hệ thống cam kết tuyệt đối không lưu trữ mật khẩu của bạn.
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
