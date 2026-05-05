"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function Loading() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      {/* Premium Loader Animation */}
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 border-4 border-accent-500/20 rounded-full" />
        <div className="absolute inset-0 border-4 border-accent-500 border-t-transparent rounded-full animate-spin" />
        <div className="absolute inset-2 border-4 border-brand-900/10 rounded-full" />
        <div className="absolute inset-2 border-4 border-brand-900 border-b-transparent rounded-full animate-spin-slow" />
      </div>

      {/* Text Feedback */}
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-brand-900 font-bold text-lg tracking-tight uppercase">
          {t.chatbot.common.loading || "Loading..."}
        </h3>
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 bg-accent-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-1.5 h-1.5 bg-accent-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-1.5 h-1.5 bg-accent-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }
      `}</style>
    </div>
  );
}
