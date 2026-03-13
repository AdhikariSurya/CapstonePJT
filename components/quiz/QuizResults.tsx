"use client";

import { RotateCcw, Sparkles, Trophy } from "lucide-react";
import { StudentAnswer } from "./types";
import { useLanguage } from "@/components/LanguageProvider";

interface QuizResultsProps {
  answers: StudentAnswer[];
  maxQuestions: number;
  highestDifficulty: number;
  onTryAgain: () => void;
  onNewQuiz: () => void;
  showScoreSummary?: boolean;
  hideActions?: boolean;
}

function toDisplayAnswer(value: StudentAnswer["studentAnswer"]): string {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object" && value !== null) {
    return Object.entries(value)
      .map(([k, v]) => `${k} -> ${v}`)
      .join(" | ");
  }
  return String(value);
}

export function QuizResults({
  answers,
  maxQuestions,
  highestDifficulty,
  onTryAgain,
  onNewQuiz,
  showScoreSummary = true,
  hideActions = false,
}: QuizResultsProps) {
  const { t, locale } = useLanguage();
  const isHi = locale === "hi";
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const accuracy = answers.length > 0 ? Math.round((correctCount / answers.length) * 100) : 0;
  const adaptiveScore = answers.reduce(
    (sum, answer) => sum + (answer.isCorrect ? answer.difficulty * 2 : 0),
    0
  );
  const maxAdaptive = maxQuestions * 10;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-neutral-900">{isHi ? "क्विज़ परिणाम" : "Quiz Results"}</h2>
          <Trophy className="w-5 h-5 text-amber-500" />
        </div>

        {showScoreSummary ? (
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-3">
              <p className="text-xs uppercase tracking-wider text-neutral-400 font-bold">{isHi ? "स्कोर" : "Score"}</p>
              <p className="text-xl font-bold text-neutral-900 mt-1">
                {correctCount}/{answers.length}
              </p>
            </div>
            <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-3">
              <p className="text-xs uppercase tracking-wider text-neutral-400 font-bold">{isHi ? "सटीकता" : "Accuracy"}</p>
              <p className="text-xl font-bold text-neutral-900 mt-1">{accuracy}%</p>
            </div>
            <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-3">
              <p className="text-xs uppercase tracking-wider text-neutral-400 font-bold">
                {isHi ? "उच्चतम स्तर" : "Highest Level"}
              </p>
              <p className="text-xl font-bold text-neutral-900 mt-1">{highestDifficulty}</p>
            </div>
            <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-3">
              <p className="text-xs uppercase tracking-wider text-neutral-400 font-bold">
                {isHi ? "अनुकूली स्कोर" : "Adaptive Score"}
              </p>
              <p className="text-xl font-bold text-neutral-900 mt-1">
                {adaptiveScore}/{maxAdaptive}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-neutral-600">
            {isHi ? "क्विज़ पूरा हो गया।" : "Quiz completed. Your teacher will review your score."}
          </p>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-neutral-900">{isHi ? "प्रश्न समीक्षा" : "Question Review"}</h3>
        <div className="space-y-3">
          {answers.map((answer, idx) => (
            <div
              key={answer.questionId}
              className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 space-y-1.5"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Q{idx + 1} • Level {answer.difficulty}
              </p>
              <p className="text-sm font-semibold text-neutral-800">{answer.questionText}</p>
              <p className="text-xs text-neutral-600">
                {isHi ? "आपका उत्तर:" : "Your answer:"}{" "}
                <span className="font-medium">{toDisplayAnswer(answer.studentAnswer)}</span>
              </p>
              {!answer.isCorrect && (
                <p className="text-xs text-red-600">
                  {isHi ? "सही उत्तर:" : "Correct answer:"}{" "}
                  <span className="font-medium">{toDisplayAnswer(answer.correctAnswer)}</span>
                </p>
              )}
              <p className="text-xs text-neutral-500">{answer.explanation}</p>
            </div>
          ))}
        </div>
      </div>

      {!hideActions && (
        <div className="space-y-2">
          <button
            onClick={onTryAgain}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-neutral-200 bg-white text-neutral-700 text-sm font-semibold hover:bg-neutral-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            {t("core.quiz.tryAgain")}
          </button>
          <button
            onClick={onNewQuiz}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-neutral-900 text-white text-sm font-semibold transition-all touch-manipulation active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4" />
            {t("core.quiz.new")}
          </button>
        </div>
      )}
    </div>
  );
}
