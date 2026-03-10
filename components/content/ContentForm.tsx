"use client";

import { PillSelector } from "../worksheet/PillSelector";
import { Loader2, Sparkles, Lock, Pencil } from "lucide-react";
import { ContextFileUpload } from "../shared/ContextFileUpload";
import { VoiceInputAssist } from "../shared/VoiceInputAssist";
import type { UploadedContextFile } from "@/lib/contextFiles";

const LANGUAGES = [
  { id: "english", label: "English" },
  { id: "hindi", label: "Hindi" },
  { id: "bengali", label: "Bengali" },
];

const CONTENT_TYPES = [
  { id: "story", label: "Story" },
  { id: "poem", label: "Poem" },
  { id: "play", label: "Play" },
  { id: "essay", label: "Essay" },
  { id: "article", label: "Article" },
  { id: "biography", label: "Biography" },
];

export interface ContentFormData {
  language: string;
  contentType: string;
  description: string;
  contextFiles: UploadedContextFile[];
}

interface ContentFormProps {
  formData: ContentFormData;
  onChange: (data: Partial<ContentFormData>) => void;
  onSubmit: () => void;
  onUnlock: () => void;
  loading: boolean;
  locked: boolean;
}

export function ContentForm({
  formData,
  onChange,
  onSubmit,
  onUnlock,
  loading,
  locked,
}: ContentFormProps) {
  const appendText = (current: string, incoming: string) =>
    current.trim() ? `${current.trim()} ${incoming}` : incoming;

  const isValid =
    formData.language && formData.contentType && formData.description.trim();

  const contentTypeLabel =
    CONTENT_TYPES.find((t) => t.id === formData.contentType)?.label ?? "";

  const placeholderMap: Record<string, string> = {
    story: "e.g. A story about a young girl who saves her village during a flood…",
    poem: "e.g. A poem about the monsoon season and its joy for farmers…",
    play: "e.g. A short play about two friends learning the value of honesty…",
    essay: "e.g. An essay on the importance of trees in our environment…",
    article: "e.g. An article about how solar energy works and its benefits…",
    biography: "e.g. A biography of Dr. APJ Abdul Kalam focused on his childhood…",
  };

  const placeholder = formData.contentType
    ? placeholderMap[formData.contentType]
    : "Describe what you'd like the content to be about…";

  const speechLangMap: Record<string, string> = {
    english: "en-IN",
    hindi: "hi-IN",
    bengali: "bn-IN",
  };
  const speechLang = speechLangMap[formData.language] ?? "en-IN";

  return (
    <div className="space-y-4">
      {/* Locked banner */}
      {locked && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-100 rounded-xl">
          <div className="flex items-center gap-2 text-neutral-500">
            <Lock className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">Inputs locked</span>
          </div>
          <button
            onClick={onUnlock}
            className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 hover:text-neutral-900 transition-colors"
          >
            <Pencil className="w-3 h-3" />
            Edit
          </button>
        </div>
      )}

      <div className={locked ? "pointer-events-none select-none opacity-60" : ""}>
        {/* Language */}
        <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm space-y-3">
          <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
            Language
          </label>
          <PillSelector
            options={LANGUAGES}
            selected={formData.language}
            onChange={(language) => onChange({ language })}
            wrap
          />
        </div>

        <div className="space-y-4 mt-4">
          {/* Content Type */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm space-y-3">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
              Content Type
            </label>
            <PillSelector
              options={CONTENT_TYPES}
              selected={formData.contentType}
              onChange={(contentType) => onChange({ contentType })}
              wrap
            />
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm space-y-3">
            <label
              htmlFor="description"
              className="text-xs font-bold text-neutral-400 uppercase tracking-wider block"
            >
              {contentTypeLabel ? `${contentTypeLabel} Description` : "Description"}
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder={placeholder}
              rows={4}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300 resize-none transition-colors"
            />
            <VoiceInputAssist
              language={speechLang}
              disabled={locked}
              onApply={(spokenText) =>
                onChange({ description: appendText(formData.description, spokenText) })
              }
            />
          </div>

          <ContextFileUpload
            files={formData.contextFiles}
            onChange={(contextFiles) => onChange({ contextFiles })}
          />
        </div>
      </div>

      {/* Generate button */}
      {!locked && (
        <button
          onClick={onSubmit}
          disabled={loading || !isValid}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-neutral-900 text-white rounded-2xl text-sm font-bold transition-all touch-manipulation active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-neutral-900/10"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Content…
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Content
            </>
          )}
        </button>
      )}
    </div>
  );
}
