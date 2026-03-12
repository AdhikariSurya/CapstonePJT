"use client";

import { clsx } from "clsx";
import { useLanguage } from "@/components/LanguageProvider";

export type WorksheetTypeId = "mcq" | "short_answer" | "long_answer" | "fill_blanks";

const ALL_TYPES: { id: WorksheetTypeId; label: string; shortLabel: string }[] = [
  { id: "mcq", label: "Multiple Choice", shortLabel: "MCQ" },
  { id: "short_answer", label: "Short Answer", shortLabel: "Short Ans." },
  { id: "long_answer", label: "Long Answer", shortLabel: "Long Ans." },
  { id: "fill_blanks", label: "Fill in the Blanks", shortLabel: "Fill Blanks" },
];

const COUNT_OPTIONS = [3, 4, 5, 6, 8, 10, 12];

// Distribute total evenly across types, minimum 3 each
export function distributeQuestions(
  types: string[],
  total: number
): Record<string, number> {
  const n = types.length;
  if (n === 0) return {};
  const minTotal = n * 3;
  const safeTotal = Math.max(total, minTotal);
  const base = Math.floor(safeTotal / n);
  const remainder = safeTotal - base * n;
  return Object.fromEntries(types.map((t, i) => [t, base + (i < remainder ? 1 : 0)]));
}

interface WorksheetTypeSelectorProps {
  selectedTypes: string[];
  questionCounts: Record<string, number>;
  onChange: (types: string[], counts: Record<string, number>) => void;
}

export function WorksheetTypeSelector({
  selectedTypes,
  questionCounts,
  onChange,
}: WorksheetTypeSelectorProps) {
  const { locale } = useLanguage();
  const isHi = locale === "hi";
  const currentTotal = selectedTypes.reduce((s, t) => s + (questionCounts[t] ?? 0), 0);

  const toggleType = (id: string) => {
    let newTypes: string[];
    if (selectedTypes.includes(id)) {
      newTypes = selectedTypes.filter((t) => t !== id);
    } else {
      newTypes = [...selectedTypes, id];
    }

    // Redistribute keeping the same total (or at least minTotal)
    const prevTotal = selectedTypes.reduce((s, t) => s + (questionCounts[t] ?? 0), 0);
    const targetTotal = prevTotal > 0 ? prevTotal : newTypes.length * 4;
    const newCounts = distributeQuestions(newTypes, targetTotal);
    onChange(newTypes, newCounts);
  };

  const setCount = (typeId: string, count: number) => {
    const newCounts = { ...questionCounts, [typeId]: count };
    onChange(selectedTypes, newCounts);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
          {isHi ? "वर्कशीट प्रकार" : "Worksheet Type(s)"}
        </label>
        {selectedTypes.length > 0 && (
          <span className="text-xs text-neutral-400 font-medium">
            {isHi ? "कुल:" : "Total:"}{" "}
            <span className="font-bold text-neutral-600">
              {currentTotal} {isHi ? "प्रश्न" : "questions"}
            </span>
          </span>
        )}
      </div>

      {/* Type toggle pills */}
      <div className="flex flex-wrap gap-2">
        {ALL_TYPES.map((type) => {
          const isSelected = selectedTypes.includes(type.id);
          return (
            <button
              key={type.id}
              onClick={() => toggleType(type.id)}
              className={clsx(
                "px-4 py-2 rounded-full text-sm font-semibold transition-all touch-manipulation active:scale-95",
                isSelected
                  ? "bg-neutral-900 text-white shadow-md"
                  : "bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300"
              )}
            >
              {type.shortLabel}
            </button>
          );
        })}
      </div>

      {/* Per-type count selectors */}
      {selectedTypes.length > 0 && (
        <div className="space-y-3 pt-1">
          {selectedTypes.map((typeId) => {
            const typeMeta = ALL_TYPES.find((t) => t.id === typeId);
            const count = questionCounts[typeId] ?? 3;
            return (
              <div key={typeId} className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-neutral-700 min-w-0 flex-shrink-0 w-28">
                  {typeMeta?.shortLabel}
                </span>
                <div className="flex gap-1.5 flex-wrap justify-end">
                  {COUNT_OPTIONS.map((n) => (
                    <button
                      key={n}
                      onClick={() => setCount(typeId, n)}
                      className={clsx(
                        "w-8 h-8 rounded-lg text-xs font-bold transition-all touch-manipulation active:scale-90",
                        count === n
                          ? "bg-neutral-900 text-white shadow-sm"
                          : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
