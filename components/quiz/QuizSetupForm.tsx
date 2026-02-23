"use client";

import { Loader2, Sparkles } from "lucide-react";
import { SingleGradeSelector } from "../planner/SingleGradeSelector";
import { PillSelector } from "../worksheet/PillSelector";
import { clsx } from "clsx";

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

const QUESTION_COUNTS = [
  { id: "5", label: "5 Qs" },
  { id: "8", label: "8 Qs" },
  { id: "10", label: "10 Qs" },
  { id: "12", label: "12 Qs" },
  { id: "15", label: "15 Qs" },
];

const QUESTION_TYPES = [
  { id: "mcq", label: "MCQ" },
  { id: "fill_blank", label: "Fill Blank" },
  { id: "true_false", label: "True/False" },
  { id: "match", label: "Match" },
  { id: "order", label: "Ordering" },
  { id: "multi_select", label: "Multi Select" },
];

export interface QuizSetupData {
  grade: number | null;
  subject: string;
  topic: string;
  outputLanguage: string;
  details: string;
  numQuestions: string;
  questionTypes: string[];
}

interface QuizSetupFormProps {
  formData: QuizSetupData;
  onChange: (data: Partial<QuizSetupData>) => void;
  onSubmit: () => void;
  loading: boolean;
}

export function QuizSetupForm({ formData, onChange, onSubmit, loading }: QuizSetupFormProps) {
  const isValid =
    formData.grade !== null &&
    formData.subject.trim().length > 0 &&
    formData.topic.trim().length > 0 &&
    formData.outputLanguage.trim().length > 0 &&
    formData.numQuestions.trim().length > 0;

  const toggleQuestionType = (typeId: string) => {
    if (formData.questionTypes.includes(typeId)) {
      onChange({ questionTypes: formData.questionTypes.filter((t) => t !== typeId) });
      return;
    }
    onChange({ questionTypes: [...formData.questionTypes, typeId] });
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
        <SingleGradeSelector
          selected={formData.grade}
          onChange={(grade) => onChange({ grade })}
        />
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm space-y-3">
          <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
            Subject
          </label>
          <PillSelector
            options={SUBJECTS}
            selected={formData.subject}
            onChange={(subject) => onChange({ subject })}
            wrap
          />
        </div>

        <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm space-y-3">
          <label
            htmlFor="quiz-topic"
            className="text-xs font-bold text-neutral-400 uppercase tracking-wider block"
          >
            Topic
          </label>
          <input
            id="quiz-topic"
            type="text"
            value={formData.topic}
            onChange={(e) => onChange({ topic: e.target.value })}
            placeholder="e.g. Photosynthesis, Mughal Empire, Fractions..."
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300 transition-colors"
          />
        </div>

        <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm space-y-3">
          <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
            Output Language
          </label>
          <PillSelector
            options={LANGUAGES}
            selected={formData.outputLanguage}
            onChange={(outputLanguage) => onChange({ outputLanguage })}
            wrap
          />
        </div>

        <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm space-y-3">
          <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
            Number of Questions
          </label>
          <PillSelector
            options={QUESTION_COUNTS}
            selected={formData.numQuestions}
            onChange={(numQuestions) => onChange({ numQuestions })}
            wrap
          />
        </div>

        <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
              Question Types (Optional)
            </label>
            <span className="text-[11px] text-neutral-400">None selected = mixed</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {QUESTION_TYPES.map((type) => {
              const selected = formData.questionTypes.includes(type.id);
              return (
                <button
                  key={type.id}
                  onClick={() => toggleQuestionType(type.id)}
                  className={clsx(
                    "px-4 py-2 rounded-full text-sm font-semibold transition-all touch-manipulation active:scale-95 whitespace-nowrap",
                    selected
                      ? "bg-neutral-900 text-white shadow-md"
                      : "bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300"
                  )}
                >
                  {type.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm space-y-3">
          <label
            htmlFor="quiz-details"
            className="text-xs font-bold text-neutral-400 uppercase tracking-wider block"
          >
            Reference Content (Optional)
          </label>
          <textarea
            id="quiz-details"
            value={formData.details}
            onChange={(e) => onChange({ details: e.target.value })}
            placeholder="Paste notes/chapter excerpt to ground question generation..."
            rows={4}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300 resize-none transition-colors"
          />
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={loading || !isValid}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-neutral-900 text-white rounded-2xl text-sm font-bold transition-all touch-manipulation active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-neutral-900/10"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating Quiz Bank...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Start Quiz
          </>
        )}
      </button>
    </div>
  );
}
