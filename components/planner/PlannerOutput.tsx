"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Copy, Check, RefreshCcw, PlusCircle } from "lucide-react";

interface PlannerOutputProps {
  plan: string;
  metadata: {
    grade: number;
    subject: string;
    topic: string;
    duration: number;
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

export function PlannerOutput({ plan, metadata, onRegenerate, onNew }: PlannerOutputProps) {
  return (
    <div className="space-y-4">
      {/* Meta bar */}
      <div>
        <p className="text-xs text-neutral-400 font-medium">
          Grade {metadata.grade} · {metadata.subject} · {metadata.duration} mins
        </p>
        <p className="text-sm font-bold text-neutral-800 mt-0.5">{metadata.topic}</p>
      </div>

      {/* Plan content */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-50 bg-neutral-50/50">
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
            Lesson Plan
          </span>
          <CopyButton text={plan} />
        </div>
        <div className="px-5 py-5 prose prose-sm prose-neutral max-w-none text-neutral-800
          [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mb-4
          [&_h3]:text-sm [&_h3]:font-bold [&_h3]:uppercase [&_h3]:tracking-wide [&_h3]:text-neutral-500 [&_h3]:mt-6 [&_h3]:mb-2
          [&_ul]:space-y-2 [&_li]:text-sm [&_p]:text-sm
          [&_strong]:font-bold [&_strong]:text-neutral-900
          [&_hr]:my-6
        ">
          <ReactMarkdown>{plan}</ReactMarkdown>
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
          New Plan
        </button>
      </div>
    </div>
  );
}
