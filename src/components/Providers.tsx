"use client";

import { LanguageProvider } from "@/contexts/LanguageContext";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      {children}
      <Toaster position="top-center" />
    </LanguageProvider>
  );
}
