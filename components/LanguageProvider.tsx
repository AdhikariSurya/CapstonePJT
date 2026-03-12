"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { APP_LOCALE_STORAGE_KEY, APP_MESSAGES, type AppLocale } from "@/lib/i18n";

interface LanguageContextValue {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(APP_LOCALE_STORAGE_KEY);
    if (stored === "en" || stored === "hi") {
      setLocaleState(stored);
    }
  }, []);

  const setLocale = (nextLocale: AppLocale) => {
    setLocaleState(nextLocale);
    window.localStorage.setItem(APP_LOCALE_STORAGE_KEY, nextLocale);
  };

  const t = (key: string) => APP_MESSAGES[locale][key] ?? APP_MESSAGES.en[key] ?? key;

  const value = useMemo(() => ({ locale, setLocale, t }), [locale]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
