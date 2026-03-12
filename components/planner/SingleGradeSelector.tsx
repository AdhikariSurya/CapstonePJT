"use client";

import { clsx } from "clsx";
import { useLanguage } from "@/components/LanguageProvider";

interface SingleGradeSelectorProps {
  selected: number | null;
  onChange: (grade: number) => void;
}

const GRADES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export function SingleGradeSelector({ selected, onChange }: SingleGradeSelectorProps) {
  const { locale } = useLanguage();
  const isHi = locale === "hi";
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
        {isHi ? "कक्षा स्तर" : "Grade Level"}
      </label>
      <div className="flex flex-wrap gap-2">
        {GRADES.map((grade) => (
          <button
            key={grade}
            onClick={() => onChange(grade)}
            className={clsx(
              "w-11 h-11 rounded-xl text-sm font-bold transition-all touch-manipulation active:scale-95",
              selected === grade
                ? "bg-neutral-900 text-white shadow-md"
                : "bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300"
            )}
          >
            {grade}
          </button>
        ))}
      </div>
    </div>
  );
}
