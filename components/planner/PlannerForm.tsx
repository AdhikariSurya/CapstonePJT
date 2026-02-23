"use client";

import { SingleGradeSelector } from "./SingleGradeSelector";
import { PillSelector } from "../worksheet/PillSelector";
import { Loader2, Sparkles, Lock, Pencil } from "lucide-react";

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

const DURATIONS = [
  { id: "30", label: "30 mins" },
  { id: "40", label: "40 mins" },
  { id: "50", label: "50 mins" },
  { id: "60", label: "60 mins" },
];

const LANGUAGES = [
  { id: "English", label: "English" },
  { id: "Hindi", label: "Hindi" },
];

export interface PlannerFormData {
  grade: number | null;
  subject: string;
  duration: string;
  topic: string;
  details: string;
  outputLanguage: string;
}

interface PlannerFormProps {
  formData: PlannerFormData;
  onChange: (data: Partial<PlannerFormData>) => void;
  onSubmit: () => void;
  onUnlock: () => void;
  loading: boolean;
  locked: boolean;
}

export function PlannerForm({
  formData,
  onChange,
  onSubmit,
  onUnlock,
  loading,
  locked,
}: PlannerFormProps) {
  const isValid =
    formData.grade !== null &&
    formData.subject &&
    formData.duration &&
    formData.topic.trim();

  // Check if selected subject is a language subject
  const isLanguageSubject = ["English", "Hindi", "Sanskrit"].includes(formData.subject);

  // If subject changes to a language subject, force output language to match
  const handleSubjectChange = (subject: string) => {
    let newOutputLanguage = formData.outputLanguage;
    if (["English"].includes(subject)) newOutputLanguage = "English";
    if (["Hindi", "Sanskrit"].includes(subject)) newOutputLanguage = "Hindi";
    
    onChange({ subject, outputLanguage: newOutputLanguage });
  };

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
          <SingleGradeSelector
            selected={formData.grade}
            onChange={(grade) => onChange({ grade })}
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

          {/* Duration */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm space-y-3">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
              Duration
            </label>
            <PillSelector
              options={DURATIONS}
              selected={formData.duration}
              onChange={(duration) => onChange({ duration })}
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
              placeholder="e.g. Photosynthesis, Fractions, The Solar System…"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300 transition-colors"
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
              Learning Objectives / Context (Optional)
            </label>
            <textarea
              id="details"
              value={formData.details}
              onChange={(e) => onChange({ details: e.target.value })}
              placeholder="Specific goals, student needs, or classroom context…"
              rows={4}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300 resize-none transition-colors"
            />
          </div>
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
              Generating Plan…
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Lesson Plan
            </>
          )}
        </button>
      )}
    </div>
  );
}
