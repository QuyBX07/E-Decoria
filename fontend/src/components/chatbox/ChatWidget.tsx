import { useEffect, useRef, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { sendChatMessage } from "@/services/ChatService";
import { ChatMessage } from "@/types/Chat";

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // auto scroll xuống cuối
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // click outside để đóng
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      role: "user",
      reply: input,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const botMsg = await sendChatMessage(input);
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          reply: "Có lỗi xảy ra, vui lòng thử lại.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const TypingDots = () => (
    <div className="flex items-center gap-1 px-4 py-2 bg-gray-100 rounded-xl w-fit">
      <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
      <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
      <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" />
    </div>
  );

  return (
    <div ref={ref} className="fixed z-50 bottom-6 right-6">
      {/* Nút mở chat */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center text-white transition rounded-full shadow-lg w-14 h-14 bg-primary hover:bg-primary-dark"
      >
        <MessageCircle />
      </button>

      {/* Box chat */}
      {open && (
        <div className="absolute bottom-20 right-0 flex flex-col w-[380px] h-[520px] bg-white border shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <span className="text-lg font-semibold text-gray-800">
              Decoria AI
            </span>
            <button onClick={() => setOpen(false)}>
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 px-4 py-3 space-y-4 overflow-y-auto">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] rounded-xl px-4 py-2.5 text-[15px]
                  ${
                    m.role === "user"
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {m.reply}

                  {/* Voucher */}
                  {m.intent === "ask_voucher" && m.data?.vouchers && (
                    <div className="mt-3 space-y-2">
                      {m.data.vouchers.map((v) => (
                        <div
                          key={v.code}
                          onClick={() => {
                            navigate("/vouchers");
                            setOpen(false);
                          }}
                          className="p-3 text-sm bg-white border rounded-lg cursor-pointer border-primary/30 hover:bg-primary/5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-primary">
                              🎟 {v.code}
                            </span>
                            <span className="text-gray-500">
                              {v.discount_type === "PERCENT"
                                ? `-${v.discount_value}%`
                                : `-${Number(v.discount_value).toLocaleString()}đ`}
                            </span>
                          </div>

                          <p className="mt-1 text-gray-700">{v.description}</p>

                          <p className="mt-1 text-gray-500">
                            Đơn tối thiểu:{" "}
                            {Number(v.min_order_value).toLocaleString()}đ
                          </p>

                          <p className="text-[11px] text-gray-400">
                            ⏰ {new Date(v.start_date).toLocaleDateString()} –{" "}
                            {new Date(v.end_date).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Sản phẩm */}
                  {m.intent === "search_product" &&
                    m.data?.products?.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          navigate(`/products/${p.id}`);
                          setOpen(false);
                        }}
                        className="flex gap-3 p-3 mt-3 transition bg-white border rounded-lg cursor-pointer hover:bg-gray-50 hover:border-primary/40"
                      >
                        <img
                          src={p.image_url}
                          alt={p.name}
                          className="object-cover w-12 h-12 rounded"
                        />
                        <div>
                          <p className="text-sm font-medium line-clamp-2">
                            {p.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {p.price.toLocaleString()} đ
                          </p>
                        </div>
                      </div>
                    ))}

                  {/* Đánh giá */}
                  {/* Đánh giá */}
                  {m.intent === "ask_review" && m.data?.reviews && (
                    <div className="p-3 mt-3 bg-white border rounded-xl">
                      <div className="flex items-center gap-2">
                        điểm tb:
                        <span className="text-lg font-semibold text-gray-800">
                          {m.data.reviews.avg_rating} / 5
                        </span>
                        <span className="text-xl font-semibold text-yellow-500">
                          ⭐
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-gray-500">
                        Dựa trên {m.data.reviews.reviews.length} đánh giá của
                        khách hàng
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex justify-start">
                <TypingDots />
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex gap-3 p-4 border-t">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Nhập tin nhắn..."
              className="flex-1 px-4 py-2.5 text-[15px] border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="px-5 text-[15px] font-medium text-white rounded-xl bg-primary hover:bg-primary-dark disabled:opacity-50"
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
