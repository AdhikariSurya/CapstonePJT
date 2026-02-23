"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { clsx } from "clsx";
import { Copy, Check, RefreshCcw, PlusCircle } from "lucide-react";

interface WorksheetOutputProps {
  worksheets: Record<number, string>;
  metadata: {
    grades: number[];
    subject: string;
    topic: string;
    worksheetTypes: string[];
    questionCounts: Record<string, number>;
    generatedAt: string;
  };
  onRegenerate: () => void;
  onNew: () => void;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-500 hover:bg-neutral-100 transition-colors"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-500" />
          Copied
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          Copy
        </>
      )}
    </button>
  );
}

export function WorksheetOutput({ worksheets, metadata, onRegenerate, onNew }: WorksheetOutputProps) {
  const grades = metadata.grades.sort((a, b) => a - b);
  const [activeGrade, setActiveGrade] = useState<number>(grades[0]);

  const content = worksheets[activeGrade] ?? "_No content for this grade._";

  const typeLabel: Record<string, string> = {
    mcq: "MCQ",
    short_answer: "Short Ans.",
    long_answer: "Long Ans.",
    fill_blanks: "Fill Blanks",
  };

  const typesSummary = metadata.worksheetTypes
    .map((t) => `${typeLabel[t] ?? t} ×${metadata.questionCounts[t] ?? 0}`)
    .join("  ·  ");

  return (
    <div className="space-y-4">
      {/* Meta bar */}
      <div>
        <p className="text-xs text-neutral-400 font-medium">
          {metadata.subject} · {typesSummary}
        </p>
        <p className="text-sm font-bold text-neutral-800 mt-0.5">{metadata.topic}</p>
      </div>

      {/* Grade tabs */}
      {grades.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {grades.map((grade) => (
            <button
              key={grade}
              onClick={() => setActiveGrade(grade)}
              className={clsx(
                "flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all touch-manipulation",
                activeGrade === grade
                  ? "bg-neutral-900 text-white shadow-md"
                  : "bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300"
              )}
            >
              Grade {grade}
            </button>
          ))}
        </div>
      )}

      {/* Worksheet content */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-50 bg-neutral-50/50">
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
            Grade {activeGrade} Worksheet
          </span>
          <CopyButton text={content} />
        </div>
        <div className="px-5 py-5 prose prose-sm prose-neutral max-w-none text-neutral-800
          [&_h2]:text-base [&_h2]:font-bold [&_h2]:mt-0 [&_h2]:mb-3
          [&_h3]:text-sm [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-2
          [&_ol]:space-y-4 [&_ul]:space-y-2
          [&_li]:text-sm [&_p]:text-sm
          [&_strong]:font-bold [&_strong]:text-neutral-900
          [&_hr]:my-0
        ">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>

      {/* Bottom action buttons */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onRegenerate}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-neutral-900 text-white rounded-2xl text-sm font-bold transition-all touch-manipulation active:scale-[0.98] shadow-md"
        >
          <RefreshCcw className="w-4 h-4" />
          Regenerate
        </button>
        <button
          onClick={onNew}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-white text-neutral-700 rounded-2xl text-sm font-bold border border-neutral-200 transition-all touch-manipulation active:scale-[0.98] hover:bg-neutral-50"
        >
          <PlusCircle className="w-4 h-4" />
          New Worksheet
        </button>
      </div>
    </div>
  );
}
