import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Sparkles, User, Bot, Loader2, RefreshCw } from "lucide-react";

interface ChatMessage {
  sender: "user" | "bot";
  text: string;
}

export default function GeminiConsult() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "bot",
      text: "Xin chào! Tôi là **Trợ lý Ảo Tư vấn Sắc màu Colora AI**. \n\nTôi có thể hỗ trợ anh/chị chọn tông sơn hoàn hảo, gợi ý cách phối màu hài hòa chuẩn phong thủy, hướng dẫn định lượng và thi công tường nhà an tâm nhất. \n\n*Anh/Chị muốn tô điểm sắc màu gì cho ngôi nhà của mình hôm nay?*"
    }
  ]);
  const [inputVal, setInputVal] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    "Tôi muốn sơn phòng ngủ cho con gái nhỏ, nên kết hợp màu nào an toàn sức khỏe?",
    "Nhà tôi hướng Tây rất nắng, có màu nào cản nhiệt và cản tia sáng nóng không?",
    "Mã màu nào phối ăn khớp nhất với nền gỗ sồi nâu trầm tinh tế?"
  ];

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (userText: string) => {
    if (!userText.trim() || isLoading) return;

    setMessages(prev => [...prev, { sender: "user", text: userText }]);
    setInputVal("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userText })
      });
      const data = await res.json();
      
      setMessages(prev => [...prev, { sender: "bot", text: data.text }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev, 
        { 
          sender: "bot", 
          text: "Xin lỗi, hiện thời đường truyền kĩ thuật có sự cố nghẽn mạng nhẹ! Nhưng quý khách hoàn toàn yên tâm, mã sơn phủ nhà sịn sò Colora luôn sẵn sàng tư vấn. Quý khách có muốn thử một câu hỏi khác?" 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const decodeMarkdown = (text: string) => {
    // Basic formatting helper for bold and bullet points to render nicely
    return text.split("\n").map((line, ix) => {
      let formatted = line;
      
      // Check for bullet points
      const isBullet = line.trim().startsWith("-") || line.trim().startsWith("*");
      if (isBullet) {
        formatted = "• " + line.trim().slice(1).trim();
      }

      // Convert **bold** to <strong>
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;
      
      while ((match = boldRegex.exec(formatted)) !== null) {
        parts.push(formatted.substring(lastIndex, match.index));
        parts.push(<strong key={match.index} className="text-slate-950 font-black">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      parts.push(formatted.substring(lastIndex));

      return (
        <p key={ix} className={`leading-relaxed text-xs sm:text-sm text-slate-700 min-h-[1rem] ${isBullet ? "pl-3 text-slate-800" : ""}`}>
          {parts.length > 1 ? parts : formatted}
        </p>
      );
    });
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-400 to-cyan-500 flex items-center justify-center text-slate-900 shadow-lg">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-1.5 leading-tight">
              Tư vấn phối màu sắc Colora Paint AI Expert
            </h3>
            <span className="text-[10px] text-emerald-400 font-extrabold flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
              Chuyên gia Colora Trực tuyến phản hồi tức khắc
            </span>
          </div>
        </div>
        <button 
          onClick={() => setMessages([{ sender: "bot", text: "Cuộc hội thoại đã được làm mới! Hãy hỏi tôi bất cứ thắc mắc nào về dòng sơn và bảng màu Colora." }])}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 hover:text-emerald-400 font-bold text-xs rounded-xl transition-all cursor-pointer self-start"
          title="Làm mới trò chuyện"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Lọc lịch sử</span>
        </button>
      </div>

      {/* Chat messages stream window */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-6 h-[280px] sm:h-[350px] overflow-y-auto space-y-4 shadow-inner">
        {messages.map((msg, idx) => {
          const isUser = msg.sender === "user";
          return (
            <div 
              key={idx} 
              className={`flex items-start gap-3 w-full ${isUser ? "flex-row-reverse" : "justify-start"}`}
            >
              {/* Profile icon avatar code */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border ${
                isUser 
                  ? "bg-slate-850 border-slate-700 text-emerald-400" 
                  : "bg-gradient-to-tr from-emerald-500 to-cyan-500 border-transparent text-slate-900"
              }`}>
                {isUser ? <User className="w-4.5 h-4.5" /> : <Bot className="w-4.5 h-4.5 font-bold" />}
              </div>

              {/* Chat bubble body text */}
              <div className={`max-w-[80%] rounded-2xl p-3 shadow-md border ${
                isUser 
                  ? "bg-slate-850 border-slate-800 text-slate-200 rounded-tr-none" 
                  : "bg-white border-slate-100 text-slate-800 rounded-tl-none space-y-1.5"
              }`}>
                {isUser ? (
                  <p className="text-xs sm:text-sm text-white/90 font-medium leading-relaxed">{msg.text}</p>
                ) : (
                  decodeMarkdown(msg.text)
                )}
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div className="flex items-center gap-2 text-slate-450 text-xs font-semibold pl-1">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
            <span>Colora Consultant đang suy ngẫm giải pháp tư vấn...</span>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Sample Quick prompt buttons list */}
      <div className="space-y-2">
        <p className="text-[10px] text-slate-400 font-extrabold tracking-wider uppercase">Gợi ý câu hỏi nhanh:</p>
        <div className="flex flex-col sm:flex-row flex-wrap gap-2">
          {samplePrompts.map((p, ix) => (
            <button
              key={ix}
              disabled={isLoading}
              onClick={() => handleSendMessage(p)}
              className="px-3 py-2 text-left bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium cursor-pointer transition-all disabled:opacity-50 select-none max-w-full truncate"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input box tool row */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputVal); }}
        className="flex items-center gap-3 bg-slate-950 border border-slate-800 p-2.5 rounded-2xl shadow focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/25"
      >
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Ví dụ: Bạn hãy phối màu sơn phong thủy phòng khách hướng đông nam cho tuổi giáp tuất..."
          disabled={isLoading}
          className="flex-1 bg-transparent px-3 text-slate-200 outline-none placeholder-slate-500 text-xs sm:text-sm"
          maxLength={150}
        />
        <button
          type="submit"
          disabled={!inputVal.trim() || isLoading}
          className="p-3 cursor-pointer bg-emerald-400 hover:bg-emerald-300 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 rounded-xl transition-all font-bold group"
          title="Gửi tin nhắn"
        >
          <Send className="w-4.5 h-4.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </form>

    </div>
  );
}
