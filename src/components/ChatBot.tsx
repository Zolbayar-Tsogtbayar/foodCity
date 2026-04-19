"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { getApiBaseUrl, type ChatMessage } from "@/lib/api";

const GUEST_KEY = "foodcity_guest_id";
const CONV_KEY = "foodcity_conversation_id";

/** `crypto.randomUUID` is only available in secure contexts (HTTPS or localhost). Plain HTTP sites crash if we call it. */
function createGuestId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `g_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;
}

function getOrCreateGuestId(): string {
  try {
    let id = localStorage.getItem(GUEST_KEY);
    if (!id) {
      id = createGuestId();
      localStorage.setItem(GUEST_KEY, id);
    }
    return id;
  } catch {
    return createGuestId();
  }
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const seenIds = useRef<Set<string>>(new Set());
  const base = getApiBaseUrl();

  const scrollBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const bootstrap = useCallback(async () => {
    setError(null);
    const guestId = getOrCreateGuestId();
    let convId = localStorage.getItem(CONV_KEY);

    const ensureConv = async () => {
      const res = await fetch(`${base}/api/v1/chat/conversations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestId }),
      });
      if (!res.ok) throw new Error(await res.text());
      const json = (await res.json()) as { data: { id: string } };
      convId = json.data.id;
      localStorage.setItem(CONV_KEY, convId!);
    };

    try {
      if (!convId) await ensureConv();
      else {
        const check = await fetch(
          `${base}/api/v1/chat/conversations/${convId}/messages?guestId=${encodeURIComponent(guestId)}`,
        );
        if (!check.ok) {
          localStorage.removeItem(CONV_KEY);
          await ensureConv();
        }
      }
      const finalId = localStorage.getItem(CONV_KEY);
      if (!finalId) throw new Error("No conversation");

      const res = await fetch(
        `${base}/api/v1/chat/conversations/${finalId}/messages?guestId=${encodeURIComponent(guestId)}`,
      );
      if (!res.ok) throw new Error(await res.text());
      const json = (await res.json()) as { data: ChatMessage[] };
      const list = json.data ?? [];
      seenIds.current = new Set(list.map((m) => m.id));
      setMessages(list);
      setReady(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Алдаа");
      setReady(false);
    }
  }, [base]);

  useEffect(() => {
    if (open) void bootstrap();
  }, [open, bootstrap]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    scrollBottom();
  }, [messages, open, scrollBottom]);

  useEffect(() => {
    let s: Socket;
    let guestId: string;
    try {
      guestId = getOrCreateGuestId();
      s = io(base, { transports: ["websocket", "polling"] });
    } catch (e) {
      console.warn("[ChatBot] init failed", e);
      return;
    }
    socketRef.current = s;

    function onNew(payload: { conversationId?: string; message?: ChatMessage }) {
      const convId = localStorage.getItem(CONV_KEY);
      if (!payload?.message || payload.conversationId !== convId) return;
      const id = payload.message.id;
      if (seenIds.current.has(id)) return;
      seenIds.current.add(id);
      setMessages((prev) => [...prev, payload.message!]);
    }

    s.on("message:new", onNew);

    function joinRoom() {
      const convId = localStorage.getItem(CONV_KEY);
      if (!convId || !s.connected) return;
      s.emit("join", { conversationId: convId, guestId }, (err: Error | null) => {
        if (err) console.warn(err);
      });
    }

    s.on("connect", joinRoom);

    return () => {
      s.off("message:new", onNew);
      s.off("connect", joinRoom);
      s.disconnect();
      socketRef.current = null;
    };
  }, [base]);

  useEffect(() => {
    if (!ready) return;
    const s = socketRef.current;
    const convId = localStorage.getItem(CONV_KEY);
    const guestId = getOrCreateGuestId();
    if (!s || !convId) return;
    const run = () =>
      s.emit("join", { conversationId: convId, guestId }, (err: Error | null) => {
        if (err) console.warn(err);
      });
    if (s.connected) run();
    else s.once("connect", run);
  }, [ready]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || !ready) return;
    const guestId = getOrCreateGuestId();
    const convId = localStorage.getItem(CONV_KEY);
    if (!convId) return;

    setInput("");
    setTyping(true);
    setError(null);
    try {
      const res = await fetch(`${base}/api/v1/chat/conversations/${convId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed, guestId }),
      });
      if (!res.ok) throw new Error(await res.text());
      const json = (await res.json()) as {
        data: { userMsg: ChatMessage; botMsg: ChatMessage | null };
      };
      const { userMsg, botMsg } = json.data;
      setMessages((prev) => {
        const next = [...prev];
        if (!seenIds.current.has(userMsg.id)) {
          seenIds.current.add(userMsg.id);
          next.push(userMsg);
        }
        if (botMsg && !seenIds.current.has(botMsg.id)) {
          seenIds.current.add(botMsg.id);
          next.push(botMsg);
        }
        return next;
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Алдаа");
    } finally {
      setTyping(false);
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") void send(input);
  }

  return (
    <>
      <div
        className={`fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] max-w-sm transition-all duration-300 origin-bottom-right ${
          open
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div
          className="bg-white rounded-xl shadow-2xl border border-gray-100 flex flex-col min-h-0 overflow-hidden"
          style={{ height: "480px" }}
        >
          <div className="bg-brand-900 px-4 py-3 flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 bg-accent-500 rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-bold text-sm">FoodCity Чат</div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                <span className="text-gray-400 text-xs">
                  {ready ? "Онлайн" : "Холбогдож байна…"}
                </span>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-white transition-colors p-1"
              aria-label="Хаах"
              type="button"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 flex flex-col gap-3 bg-gray-50">
            {error && (
              <p className="text-xs text-red-600 bg-red-50 rounded-lg px-2 py-1">{error}</p>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role !== "user" && (
                  <div className="w-7 h-7 bg-accent-500 rounded-full flex items-center justify-center shrink-0 mr-2 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                )}
                <div
                  className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === "user"
                      ? "bg-accent-500 text-white rounded-br-sm"
                      : msg.role === "agent"
                        ? "bg-emerald-700 text-white rounded-bl-sm"
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

          <div className="px-3 py-3 border-t border-gray-100 bg-white flex gap-2 shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Асуулт бичих…"
              disabled={!ready}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm text-brand-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => void send(input)}
              disabled={!input.trim() || !ready}
              className="w-9 h-9 bg-accent-500 hover:bg-accent-600 disabled:opacity-40 text-white rounded-full flex items-center justify-center transition-colors shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
      </button>
    </>
  );
}
