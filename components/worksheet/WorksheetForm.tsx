"use client";

import { GradeSelector } from "./GradeSelector";
import { PillSelector } from "./PillSelector";
import { WorksheetTypeSelector } from "./WorksheetTypeSelector";
import { Loader2, Sparkles, Lock, Pencil } from "lucide-react";
import { applySubjectLanguageRule, getSubjectLanguageRule } from "@/lib/languageSubject";
import { ContextFileUpload } from "../shared/ContextFileUpload";
import { VoiceInputAssist } from "../shared/VoiceInputAssist";
import type { UploadedContextFile } from "@/lib/contextFiles";

const SUBJECTS = [
  { id: "English", label: "English" },
  { id: "Hindi", label: "Hindi" },
  { id: "Maths", label: "Maths" },
  { id: "Science", label: "Science" },
  { id: "EVS", label: "EVS" },
  { id: "Social Science", label: "Social Sc." },
  { id: "Sanskrit", label: "Sanskrit" },
  { id: "GK", label: "GK" },
];

const LANGUAGES = [
  { id: "English", label: "English" },
  { id: "Hindi", label: "Hindi" },
];

export interface WorksheetFormData {
  grades: number[];
  subject: string;
  topic: string;
  worksheetTypes: string[];
  questionCounts: Record<string, number>;
  outputLanguage: string;
  details: string;
  contextFiles: UploadedContextFile[];
}

interface WorksheetFormProps {
  formData: WorksheetFormData;
  onChange: (data: Partial<WorksheetFormData>) => void;
  onSubmit: () => void;
  onUnlock: () => void;
  loading: boolean;
  locked: boolean;
}

export function WorksheetForm({
  formData,
  onChange,
  onSubmit,
  onUnlock,
  loading,
  locked,
}: WorksheetFormProps) {
  const appendText = (current: string, incoming: string) =>
    current.trim() ? `${current.trim()} ${incoming}` : incoming;

  const isValid =
    formData.grades.length > 0 &&
    formData.subject &&
    formData.topic.trim() &&
    formData.worksheetTypes.length > 0 &&
    formData.outputLanguage;

  const { isLanguageSubject } = getSubjectLanguageRule(formData.subject);

  const handleSubjectChange = (subject: string) => {
    const newOutputLanguage = applySubjectLanguageRule(subject, formData.outputLanguage);
    onChange({ subject, outputLanguage: newOutputLanguage });
  };

  const speechLang = formData.outputLanguage === "Hindi" ? "hi-IN" : "en-IN";

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
        {/* Grade Selector */}
        <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
          <GradeSelector
            selected={formData.grades}
            onChange={(grades) => onChange({ grades })}
          />
        </div>

        <div className="space-y-4 mt-4">
          {/* Subject */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm space-y-3">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
              Subject
            </label>
            <PillSelector
              options={SUBJECTS}
              selected={formData.subject}
              onChange={handleSubjectChange}
              wrap
            />
          </div>

          {/* Topic */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm space-y-3">
            <label
              htmlFor="topic"
              className="text-xs font-bold text-neutral-400 uppercase tracking-wider block"
            >
              Topic
            </label>
            <input
              id="topic"
              type="text"
              value={formData.topic}
              onChange={(e) => onChange({ topic: e.target.value })}
              placeholder="e.g. Photosynthesis, Addition & Subtraction, Adjectives…"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300 transition-colors"
            />
            <VoiceInputAssist
              language={speechLang}
              disabled={locked}
              onApply={(spokenText) => onChange({ topic: appendText(formData.topic, spokenText) })}
            />
          </div>

          {/* Worksheet Types + Question Counts */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
            <WorksheetTypeSelector
              selectedTypes={formData.worksheetTypes}
              questionCounts={formData.questionCounts}
              onChange={(worksheetTypes, questionCounts) =>
                onChange({ worksheetTypes, questionCounts })
              }
            />
          </div>

          {/* Output Language */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
                Output Language
              </label>
              {isLanguageSubject && (
                <span className="text-xs text-amber-600 font-medium">
                  Fixed for language subjects
                </span>
              )}
            </div>
            <div className={isLanguageSubject ? "pointer-events-none opacity-50" : ""}>
              <PillSelector
                options={LANGUAGES}
                selected={formData.outputLanguage}
                onChange={(outputLanguage) => onChange({ outputLanguage })}
                wrap
              />
            </div>
          </div>

          {/* Details / Reference */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm space-y-3">
            <label
              htmlFor="details"
              className="text-xs font-bold text-neutral-400 uppercase tracking-wider block"
            >
              Content Reference (Optional)
            </label>
            <textarea
              id="details"
              value={formData.details}
              onChange={(e) => onChange({ details: e.target.value })}
              placeholder="Paste chapter text, key concepts, or any context to guide the worksheet generation…"
              rows={4}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300 resize-none transition-colors"
            />
            <VoiceInputAssist
              language={speechLang}
              disabled={locked}
              onApply={(spokenText) =>
                onChange({ details: appendText(formData.details, spokenText) })
              }
            />
          </div>

          <ContextFileUpload
            files={formData.contextFiles}
            onChange={(contextFiles) => onChange({ contextFiles })}
          />
        </div>
      </div>

      {/* Generate button — hidden when locked (Regenerate is in output panel) */}
      {!locked && (
        <button
          onClick={onSubmit}
          disabled={loading || !isValid}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-neutral-900 text-white rounded-2xl text-sm font-bold transition-all touch-manipulation active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-neutral-900/10"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Worksheets…
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Worksheets
            </>
          )}
        </button>
      )}
    </div>
  );
}
