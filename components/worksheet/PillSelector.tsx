"use client";

import { clsx } from "clsx";

interface PillOption {
  id: string;
  label: string;
}

interface PillSelectorProps {
  options: PillOption[];
  selected: string;
  onChange: (id: string) => void;
  wrap?: boolean;
}

export function PillSelector({ options, selected, onChange, wrap = false }: PillSelectorProps) {
  return (
    <div className={clsx("flex gap-2", wrap ? "flex-wrap" : "flex-wrap")}>
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          className={clsx(
            "px-4 py-2 rounded-full text-sm font-semibold transition-all touch-manipulation active:scale-95 whitespace-nowrap",
            selected === opt.id
              ? "bg-neutral-900 text-white shadow-md"
              : "bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
