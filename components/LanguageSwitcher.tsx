"use client";

import { Globe } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import type { AppLocale } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">{t("header.languageLabel")}</span>
      <Globe className="w-4 h-4 text-neutral-500 absolute left-3 pointer-events-none" />
      <select
        value={locale}
        onChange={(event) => setLocale(event.target.value as AppLocale)}
        aria-label={t("header.languageLabel")}
        className="h-10 pl-8 pr-7 rounded-full border border-neutral-200 bg-white text-neutral-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-300"
      >
        <option value="en">{t("language.english")}</option>
        <option value="hi">{t("language.hindi")}</option>
      </select>
    </label>
  );
}
