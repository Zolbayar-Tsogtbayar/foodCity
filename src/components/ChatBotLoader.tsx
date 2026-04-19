"use client";

import dynamic from "next/dynamic";

const ChatBot = dynamic(() => import("@/components/ChatBot"), {
  ssr: false,
  loading: () => null,
});

export default function ChatBotLoader() {
  if (process.env.NEXT_PUBLIC_DISABLE_CHAT === "1") {
    return null;
  }
  return <ChatBot />;
}
