"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  id: number;
  from: "bot" | "user";
  text: string;
};

const INITIAL: Message[] = [
  {
    id: 0,
    from: "bot",
    text: "Сайн байна уу! FoodCity-д тавтай морил. Оффис түрээс, барилга эсвэл үл хөдлөхийн талаар асуух зүйл байвал бэлэн хариулъя.",
  },
];

const QUICK = [
  "Боломжит оффисүүд",
  "Үнийн мэдээлэл",
  "Холбоо барих",
];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [open, messages]);

  function addMessage(from: "bot" | "user", text: string) {
    setMessages((prev) => [...prev, { id: nextId.current++, from, text }]);
  }

  function botReply(userText: string) {
    setTyping(true);
    const lower = userText.toLowerCase();
    let reply =
      "Таны асуултыг манай зөвлөхүүдэд дамжуулна. +976 1100-0000 дугаарт залгах эсвэл contact хэсгийг ашиглана уу.";

    if (lower.includes("оффис") || lower.includes("боломжит") || lower.includes("нэгж")) {
      reply =
        "Одоогоор 85+ оффисийн нэгж боломжтой — 65 м² suite-аас 800 м² бүтэн давхар хүртэл. /properties хэсгийг үзнэ үү.";
    } else if (lower.includes("үнэ") || lower.includes("price") || lower.includes("төлбөр")) {
      reply =
        "Үнэ нь хэмжээ, байрлалаас хамаарна. Хамтын ажлын байр ₮150,000/ширээнээс, гүйцэтгэх suite ₮680,000/сар, том оффис ₮4,200,000/сараас эхэлнэ.";
    } else if (lower.includes("холбоо") || lower.includes("утас") || lower.includes("имэйл")) {
      reply =
        "Утас: +976 1100-0000\nИмэйл: info@foodcity.mn\nАжлын цаг: Даваа–Баасан 09:00–18:00";
    } else if (lower.includes("байршил") || lower.includes("хаана") || lower.includes("хаяг")) {
      reply =
        "Бид Энх тайваны өргөн чөлөө 17, Сүхбаатар дүүрэг, Улаанбаатар 14200-д байрладаг.";
    } else if (lower.includes("паркинг") || lower.includes("зогсоол")) {
      reply = "Манай барилгад 240 паркингийн байр байна. Нэгж бүрт паркингийн байр харгалзан олгогдоно.";
    }

    setTimeout(() => {
      setTyping(false);
      addMessage("bot", reply);
    }, 900);
  }

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    addMessage("user", trimmed);
    setInput("");
    botReply(trimmed);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") send(input);
  }

  return (
    <>
      {/* Chat panel */}
      <div
        className={`fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] max-w-sm transition-all duration-300 origin-bottom-right ${
          open
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="bg-white rounded-xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden" style={{ height: "480px" }}>
          {/* Header */}
          <div className="bg-brand-900 px-4 py-3 flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 bg-accent-500 rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-bold text-sm">FoodCity Туслах</div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                <span className="text-gray-400 text-xs">Онлайн</span>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-white transition-colors p-1"
              aria-label="Хаах"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.from === "bot" && (
                  <div className="w-7 h-7 bg-accent-500 rounded-full flex items-center justify-center shrink-0 mr-2 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                )}
                <div
                  className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                    msg.from === "user"
                      ? "bg-accent-500 text-white rounded-br-sm"
                      : "bg-white text-brand-900 shadow-sm border border-gray-100 rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="w-7 h-7 bg-accent-500 rounded-full flex items-center justify-center shrink-0 mr-2 mt-0.5">
                  <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <div className="bg-white border border-gray-100 shadow-sm px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 flex gap-2 overflow-x-auto shrink-0 bg-gray-50 border-t border-gray-100">
              {QUICK.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="shrink-0 text-xs border border-accent-300 text-accent-600 hover:bg-accent-500 hover:text-white hover:border-accent-500 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-3 py-3 border-t border-gray-100 bg-white flex gap-2 shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Асуулт бичих…"
              className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm text-brand-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition"
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim()}
              className="w-9 h-9 bg-accent-500 hover:bg-accent-600 disabled:opacity-40 text-white rounded-full flex items-center justify-center transition-colors shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Чат нээх"
        className="fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 bg-accent-500 hover:bg-accent-600 text-white rounded-full shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>
    </>
  );
}
