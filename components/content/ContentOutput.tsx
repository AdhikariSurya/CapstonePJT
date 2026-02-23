"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Copy, Check, RefreshCcw, PlusCircle } from "lucide-react";

const LANGUAGE_LABEL: Record<string, string> = {
  english: "English",
  hindi: "हिन्दी",
  bengali: "বাংলা",
};

const TYPE_LABEL: Record<string, string> = {
  story: "Story",
  poem: "Poem",
  play: "Play",
  essay: "Essay",
  article: "Article",
  biography: "Biography",
};

interface ContentOutputProps {
  content: string;
  metadata: {
    language: string;
    contentType: string;
    description: string;
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

export function ContentOutput({ content, metadata, onRegenerate, onNew }: ContentOutputProps) {
  // Choose a font class for non-Latin scripts for better readability
  const fontClass =
    metadata.language === "hindi" || metadata.language === "bengali"
      ? "text-[1rem] leading-8"
      : "text-sm leading-relaxed";

  return (
    <div className="space-y-4">
      {/* Meta bar */}
      <div>
        <p className="text-xs text-neutral-400 font-medium">
          {LANGUAGE_LABEL[metadata.language] ?? metadata.language} ·{" "}
          {TYPE_LABEL[metadata.contentType] ?? metadata.contentType}
        </p>
        <p className="text-sm font-bold text-neutral-800 mt-0.5 line-clamp-2">
          {metadata.description}
        </p>
      </div>

      {/* Content card */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-50 bg-neutral-50/50">
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
            Generated {TYPE_LABEL[metadata.contentType] ?? metadata.contentType}
          </span>
          <CopyButton text={content} />
        </div>
        <div
          className={`px-5 py-5 prose prose-neutral max-w-none text-neutral-800 ${fontClass}
            [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:text-neutral-900
            [&_h2]:text-base [&_h2]:font-bold [&_h2]:mt-5 [&_h2]:mb-2 [&_h2]:text-neutral-700
            [&_p]:mb-3
            [&_ul]:space-y-1 [&_ol]:space-y-1
            [&_strong]:font-bold [&_strong]:text-neutral-900
            [&_em]:italic [&_em]:text-neutral-600
            [&_blockquote]:border-l-4 [&_blockquote]:border-neutral-200 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-neutral-500
          `}
        >
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
          New Content
        </button>
      </div>
    </div>
  );
}
