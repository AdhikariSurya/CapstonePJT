"use client";

import { clsx } from "clsx";
import { useLanguage } from "@/components/LanguageProvider";

interface GradeSelectorProps {
  selected: number[];
  onChange: (grades: number[]) => void;
}

const GRADES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export function GradeSelector({ selected, onChange }: GradeSelectorProps) {
  const { locale, t } = useLanguage();
  const isHi = locale === "hi";
  const toggle = (grade: number) => {
    if (selected.includes(grade)) {
      onChange(selected.filter((g) => g !== grade));
    } else {
      onChange([...selected, grade].sort((a, b) => a - b));
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
          {isHi ? "कक्षा स्तर" : "Grade Level(s)"}
        </label>
        {selected.length > 0 && (
          <button
            onClick={() => onChange([])}
            className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            {t("common.clear")}
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {GRADES.map((grade) => {
          const isSelected = selected.includes(grade);
          return (
            <button
              key={grade}
              onClick={() => toggle(grade)}
              className={clsx(
                "w-11 h-11 rounded-xl text-sm font-bold transition-all touch-manipulation active:scale-95",
                isSelected
                  ? "bg-neutral-900 text-white shadow-md"
                  : "bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300"
              )}
            >
              {grade}
            </button>
          );
        })}
      </div>
      {selected.length === 0 && (
        <p className="text-xs text-neutral-400">
          {isHi ? "कम से कम एक कक्षा चुनें" : "Select at least one grade"}
        </p>
      )}
    </div>
  );
}
