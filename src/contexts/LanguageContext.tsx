"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
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
    // Try to read from cookie first (matches what server-side will see)
    const match = document.cookie.match(/(^|;)\s*lang\s*=\s*([^;]+)/);
    const cookieVal = match ? match[2] as Lang : null;
    
    if (cookieVal === "en" || cookieVal === "mn") {
      setLang(cookieVal);
    } else {
      // Fallback to localStorage if cookie is missing (migration/client-only)
      const stored = localStorage.getItem("lang") as Lang | null;
      if (stored === "en" || stored === "mn") {
        setLang(stored);
        // Sync cookie for future requests
        document.cookie = `lang=${stored}; path=/; max-age=${60 * 60 * 24 * 365}`;
      }
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const toggle = () => {
    const next: Lang = lang === "mn" ? "en" : "mn";
    setLang(next);
    localStorage.setItem("lang", next);
    // Set cookie (Next.js server components can read this via headers/cookies)
    document.cookie = `lang=${next}; path=/; max-age=${60 * 60 * 24 * 365}; path=/`;
    // Refresh to ensure all server components re-render with new language
    window.location.reload();
  };

  return (
    <LanguageContext.Provider
      value={{
        lang,
        t: translations[lang] as Translations,
        toggle,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
