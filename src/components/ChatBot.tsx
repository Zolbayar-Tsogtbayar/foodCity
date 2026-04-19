"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { getApiBaseUrl, getSocketBaseUrl, type ChatMessage } from "@/lib/api";

type ChatChoiceNode = {
  id: string;
  label: string;
  choices: ChatChoiceNode[];
};

type ChatbotConfig = {
  rootChoices: ChatChoiceNode[];
  /** Label for button that resets chip row to root (CMS `restartLabel`). */
  restartLabel: string;
};

const GUEST_KEY = "foodcity_guest_id";
const CONV_KEY = "foodcity_conversation_id";

const DEFAULT_CONFIG: ChatbotConfig = {
  rootChoices: [
    { id: "order", label: "Захиалга", choices: [] },
    { id: "sales", label: "Борлуулалтын зар", choices: [] },
    { id: "jobs", label: "Ажлын зар", choices: [] },
    { id: "connect", label: "Ажилтантай холбогдох", choices: [] },
  ],
  restartLabel: "Эхлэл рүү буцах",
};

/** `crypto.randomUUID` is only available in secure contexts (HTTPS or localhost). */
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

function normalizeNode(node: unknown, depth = 0): ChatChoiceNode | null {
  if (!node || typeof node !== "object" || depth > 8) return null;
  const raw = node as Record<string, unknown>;
  const label = String(raw.label ?? "").trim();
  if (!label) return null;
  const id = String(raw.id ?? label.toLowerCase().replace(/\s+/g, "-")).trim();
  const childrenRaw = Array.isArray(raw.choices) ? raw.choices : [];
  return {
    id: id || `choice-${depth}-${Math.random().toString(36).slice(2, 8)}`,
    label,
    choices: childrenRaw
      .map((c) => normalizeNode(c, depth + 1))
      .filter((c): c is ChatChoiceNode => Boolean(c)),
  };
}

function normalizeConfig(raw: unknown): ChatbotConfig {
  if (!raw || typeof raw !== "object") return DEFAULT_CONFIG;
  const r = raw as Record<string, unknown>;
  const rootChoicesRaw = Array.isArray(r.rootChoices) ? r.rootChoices : [];
  const rootChoices = rootChoicesRaw
    .map((n) => normalizeNode(n))
    .filter((n): n is ChatChoiceNode => Boolean(n));
  const restartLabel = String(r.restartLabel ?? "").trim() || DEFAULT_CONFIG.restartLabel;
  return {
    rootChoices: rootChoices.length > 0 ? rootChoices : DEFAULT_CONFIG.rootChoices,
    restartLabel,
  };
}

/** Mirrors `foodcity-back/src/services/chatbot.ts` when API omits botMsg (offline edge). */
function normalizeUserText(text: string): string {
  return text
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function getLocalBotFallback(userText: string): string {
  const n = normalizeUserText(userText);
  if (!n) {
    return "Хариу түр саатлаа. Дахин оролдоно уу эсвэл асуултаа тодруулж бичнэ үү.";
  }
  if (
    n.includes("баярлалаа") ||
    n.includes("thanks") ||
    n.includes("thank you") ||
    n.includes("thankyou")
  ) {
    return "Тустай сайхан байна! Өөр асуулт байвал энд бичнэ үү.";
  }
  if (
    n.startsWith("сайн байна") ||
    n.includes("сайн байна уу") ||
    n === "сайн уу" ||
    n === "сайн" ||
    /^hello\b/.test(n) ||
    /^hi\b/.test(n) ||
    /^hey\b/.test(n)
  ) {
    return "Сайн байна уу! Захиалга, борлуулалтын зар, ажлын зарын талаар асууж болно. Тодорхой зүйл хайвал доорх сонголтуудыг ашиглана уу.";
  }
  if (
    n.includes("холбоо барих") ||
    n.includes("утасны дугаар") ||
    (n.includes("утас") && (n.includes("дугаар") || n.includes("залгах"))) ||
    (n.includes("имэйл") && n.includes("хаяг")) ||
    n.includes("холбоо") ||
    n.includes("утас") ||
    n.includes("имэйл") ||
    n.includes("дугаар") ||
    n.includes("цагийн хуваарь") ||
    n.includes("ажлын цаг") ||
    (n.includes("ниээдэг") && n.includes("хаагддаг"))
  ) {
    return "Утас: +976 1100-0000\nИмэйл: info@foodcity.mn\nАжлын цаг: Даваа–Баасан 09:00–18:00";
  }
  if (
    n.includes("бидний тухай") ||
    n.includes("танилцуулга") ||
    n.includes("компани") ||
    (n.includes("түүх") && n.includes("food"))
  ) {
    return "«Бидний тухай» хэсгээс FoodCity-ийн туршлага, гүйцэтгэсэн төслүүд, багийн мэдээлэлтэй танилцана уу. Тодорхой асуулт байвал энд шууд бичээрэй.";
  }
  if (
    n.includes("ажлын зар") ||
    n.includes("ажлын байр") ||
    n.includes("нийцтэй ажил") ||
    n.includes("карьер") ||
    (n.includes("ажил") && (n.includes("зар") || n.includes("байр")))
  ) {
    return "Нээлттэй ажлын байрны заруудыг «Ажлын зар» хуудаснаас үзнэ үү.";
  }
  if (n.includes("ажилтан") && (n.includes("холбогдох") || n.includes("оператор"))) {
    return "Таны хүсэлтийг ажилтан руу дамжуулна. Түр хүлээнэ үү; шууд асуултанд хариулна.";
  }
  if (n.includes("үнэ") || n.includes("price") || n.includes("төлбөр") || n.includes("хямдрал") || n.includes("хөнгөлөлт")) {
    return "Үнэ, хямдралын мэдээллийг «Борлуулалтын зар» хэсэгт нийтэлдэг. Тодорхой бүтээгдэхүүнээс хамаарч өөр өөр байна.";
  }
  if (
    n.includes("оффис") ||
    n.includes("боломжит") ||
    n.includes("захиалга") ||
    n.includes("хоол") ||
    n.includes("заавар") ||
    n.includes("хэрхэн захиалах") ||
    n.includes("захиалах")
  ) {
    return "Захиалга өгөх бол вэб дээрх «Захиалга» хэсгээс бөглөнө үү. Оффис болон үйлчилгээний талаар дэлгэрэнгүй мэдээллийг «Борлуулалтын зар»-аас үзнэ үү.";
  }
  if (n.includes("байршил") || n.includes("хаана") || n.includes("хаяг") || n.includes("where")) {
    return "Бид Улаанбаатар хотод үйл ажиллагаа явуулдаг. Хаягийн дэлгэрэнгүйг «Холбоо барих» хэсгээс үзнэ үү.";
  }
  return "Хариу түр саатлаа. Дахин оролдоно уу эсвэл асуултаа тодруулж бичнэ үү.";
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [ready, setReady] = useState(false);
  const [socketLive, setSocketLive] = useState(false);
  const [config, setConfig] = useState<ChatbotConfig>(DEFAULT_CONFIG);
  /** Keep in sync with `config` defaults so the first open after refresh isn’t chip-empty. */
  const [activeChoices, setActiveChoices] = useState<ChatChoiceNode[]>(
    () => DEFAULT_CONFIG.rootChoices,
  );
  const [error, setError] = useState<string | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const seenIds = useRef<Set<string>>(new Set());
  const base = getApiBaseUrl();

  const loadConfig = useCallback(async () => {
    setLoadingConfig(true);
    try {
      const res = await fetch(`${base}/api/v1/site-pages/chatbot`);
      if (!res.ok) throw new Error(await res.text());
      const json = (await res.json()) as {
        data?: { sections?: unknown };
      };
      const next = normalizeConfig(json.data?.sections);
      setConfig(next);
      setActiveChoices(next.rootChoices);
    } catch {
      setConfig(DEFAULT_CONFIG);
      setActiveChoices(DEFAULT_CONFIG.rootChoices);
    } finally {
      setLoadingConfig(false);
    }
  }, [base]);

  const bootstrapConversation = useCallback(async () => {
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
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Алдаа");
      setReady(false);
    }
  }, [base]);

  /** Preload CMS chatbot config as soon as the widget mounts (not only when the panel opens). */
  useEffect(() => {
    void loadConfig();
  }, [loadConfig]);

  useEffect(() => {
    if (!open) return;
    void bootstrapConversation();
  }, [open, bootstrapConversation]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeChoices, open]);

  useEffect(() => {
    let s: Socket;
    try {
      s = io(getSocketBaseUrl(), {
        transports: ["websocket", "polling"],
        withCredentials: true,
      });
    } catch {
      return;
    }
    socketRef.current = s;

    function emitJoin() {
      const convId = localStorage.getItem(CONV_KEY);
      const guestId = getOrCreateGuestId();
      if (!convId || !s.connected) return;
      s.emit("join", { conversationId: convId, guestId }, () => {});
    }

    function onNew(payload: { conversationId?: string; message?: ChatMessage }) {
      const convId = localStorage.getItem(CONV_KEY);
      if (!payload?.message || payload.conversationId !== convId) return;
      const m = payload.message;
      if (
        (m.role === "bot" || m.role === "agent") &&
        !m.text?.trim()
      ) {
        return;
      }
      if (seenIds.current.has(m.id)) return;
      seenIds.current.add(m.id);
      setMessages((prev) => [...prev, m]);
    }

    s.on("message:new", onNew);
    s.on("connect", () => {
      setSocketLive(true);
      emitJoin();
    });
    s.on("disconnect", () => setSocketLive(false));
    s.on("reconnect", emitJoin);

    return () => {
      s.off("message:new", onNew);
      s.disconnect();
      socketRef.current = null;
      setSocketLive(false);
    };
  }, []);

  useEffect(() => {
    if (!open || !ready) return;
    const s = socketRef.current;
    if (!s) return;
    const convId = localStorage.getItem(CONV_KEY);
    const guestId = getOrCreateGuestId();
    if (!convId) return;
    const run = () => {
      s.emit("join", { conversationId: convId, guestId }, () => {});
    };
    if (s.connected) run();
    else s.once("connect", run);
  }, [open, ready]);

  const statusText = useMemo(() => {
    if (!ready || loadingConfig) return "Холбогдож байна…";
    if (error) return "Алдаа";
    return socketLive ? "Онлайн" : "Холбогдож байна…";
  }, [ready, socketLive, loadingConfig, error]);

  const atRootChips = useMemo(() => {
    if (activeChoices.length !== config.rootChoices.length) return false;
    const a = activeChoices.map((c) => c.id).join("\0");
    const b = config.rootChoices.map((c) => c.id).join("\0");
    return a === b;
  }, [activeChoices, config.rootChoices]);

  function backToRootChips() {
    setActiveChoices(config.rootChoices);
  }

  async function send(text: string, nextChoices?: ChatChoiceNode[]) {
    const trimmed = text.trim();
    if (!trimmed || !ready) return;
    const guestId = getOrCreateGuestId();
    const convId = localStorage.getItem(CONV_KEY);
    if (!convId) return;

    setTyping(true);
    setError(null);
    setInput("");
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
        if (botMsg?.text?.trim() && !seenIds.current.has(botMsg.id)) {
          seenIds.current.add(botMsg.id);
          next.push(botMsg);
        } else if (!botMsg?.text?.trim()) {
          next.push({
            id: `bot-local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            role: "bot",
            text: getLocalBotFallback(trimmed),
          });
        }
        return next;
      });
      if (nextChoices) setActiveChoices(nextChoices);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Алдаа");
    } finally {
      setTyping(false);
    }
  }

  function choose(node: ChatChoiceNode) {
    if (!ready) {
      setError("Чат хараахан холбогдоогүй байна. Түр хүлээгээд дахин оролдоно уу.");
      return;
    }
    void send(node.label, node.choices.length > 0 ? node.choices : config.rootChoices);
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
                <span className="text-gray-400 text-xs">{statusText}</span>
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
            {open && !ready && !error && (
              <p className="text-center text-xs text-gray-500 py-6">Яриа ачаалж байна…</p>
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
            {activeChoices.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {!atRootChips && config.restartLabel.trim() && (
                  <button
                    type="button"
                    onClick={backToRootChips}
                    disabled={!ready}
                    className="rounded-full border border-dashed border-gray-300 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm hover:border-accent-400 hover:bg-white hover:text-brand-900 disabled:opacity-50"
                  >
                    {config.restartLabel}
                  </button>
                )}
                {activeChoices.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => choose(c)}
                    disabled={!ready}
                    className="rounded-full border border-accent-200 bg-white px-3 py-1.5 text-xs font-medium text-brand-900 shadow-sm hover:border-accent-400 hover:bg-accent-50 disabled:opacity-50"
                  >
                    {c.label}
                  </button>
                ))}
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
              onKeyDown={(e) => e.key === "Enter" && void send(input)}
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
