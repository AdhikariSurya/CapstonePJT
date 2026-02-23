"use client";

import { clsx } from "clsx";

export type Language = "english" | "hindi" | "bengali";

interface LanguageSelectorProps {
  selected: Language;
  onChange: (lang: Language) => void;
}

const LANGUAGES: { id: Language; label: string }[] = [
  { id: "english", label: "English" },
  { id: "hindi", label: "Hindi" },
  { id: "bengali", label: "Bengali" },
];

export function LanguageSelector({ selected, onChange }: LanguageSelectorProps) {
  return (
    <div className="flex gap-2">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.id}
          onClick={() => onChange(lang.id)}
          className={clsx(
            "px-4 py-2 rounded-full text-sm font-semibold transition-all touch-manipulation",
            selected === lang.id
              ? "bg-neutral-900 text-white shadow-md"
              : "bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300 active:bg-neutral-50"
          )}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
