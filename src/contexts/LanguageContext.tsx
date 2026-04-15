"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations, Lang, Translations } from "@/lib/translations";

type LanguageContextType = {
  lang: Lang;
  t: Translations;
  toggle: () => void;
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "mn",
  t: translations.mn,
  toggle: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("mn");

  useEffect(() => {
    const stored = localStorage.getItem("lang") as Lang | null;
    if (stored === "en" || stored === "mn") {
      setLang(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const toggle = () => {
    const next: Lang = lang === "mn" ? "en" : "mn";
    setLang(next);
    localStorage.setItem("lang", next);
  };

  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
