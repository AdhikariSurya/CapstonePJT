"use client";

import { clsx } from "clsx";
import { AlertTriangle, CheckCircle2, TrendingUp, MessageSquare } from "lucide-react";

export interface EvaluationData {
  word_accuracy_score: number;
  pronunciation_score: number;
  fluency_score: number;
  pacing_score: number;
  confidence_score: number;
  overall_score: number;
  mistakes: string[];
  strengths: string;
  improvements: string;
  teacher_summary: string;
}

function scoreColor(score: number): string {
  if (score >= 8) return "text-emerald-600 bg-emerald-50";
  if (score >= 5) return "text-amber-600 bg-amber-50";
  return "text-red-600 bg-red-50";
}

function overallBg(score: number): string {
  if (score >= 8) return "from-emerald-500 to-emerald-600";
  if (score >= 5) return "from-amber-500 to-amber-600";
  return "from-red-500 to-red-600";
}

function ScoreCard({ label, score }: { label: string; score: number }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-sm text-neutral-600">{label}</span>
      <span
        className={clsx(
          "text-sm font-bold px-3 py-1 rounded-full",
          scoreColor(score)
        )}
      >
        {score}/10
      </span>
    </div>
  );
}

interface EvaluationResultsProps {
  data: EvaluationData;
}

export function EvaluationResults({ data }: EvaluationResultsProps) {
  return (
    <div className="space-y-4">
      {/* Overall Score */}
      <div
        className={clsx(
          "bg-gradient-to-br text-white rounded-2xl p-6 text-center shadow-lg",
          overallBg(data.overall_score)
        )}
      >
        <p className="text-sm font-medium opacity-90 mb-1">Overall Score</p>
        <p className="text-5xl font-extrabold tracking-tight">
          {data.overall_score}
          <span className="text-2xl font-medium opacity-70">/10</span>
        </p>
      </div>

      {/* Sub-scores */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
          Detailed Scores
        </h3>
        <div className="divide-y divide-neutral-50">
          <ScoreCard label="Word Accuracy" score={data.word_accuracy_score} />
          <ScoreCard label="Pronunciation" score={data.pronunciation_score} />
          <ScoreCard label="Fluency" score={data.fluency_score} />
          <ScoreCard label="Pacing" score={data.pacing_score} />
          <ScoreCard label="Confidence" score={data.confidence_score} />
        </div>
      </div>

      {/* Mistakes */}
      {data.mistakes && data.mistakes.length > 0 && (
        <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Mistakes
            </h3>
          </div>
          <ul className="space-y-1.5">
            {data.mistakes.map((m, i) => (
              <li
                key={i}
                className="text-sm text-neutral-600 pl-3 border-l-2 border-amber-200"
              >
                {m}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Strengths */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Strengths
          </h3>
        </div>
        <p className="text-sm text-neutral-600 leading-relaxed">
          {data.strengths}
        </p>
      </div>

      {/* Improvements */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-blue-500" />
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Areas to Improve
          </h3>
        </div>
        <p className="text-sm text-neutral-600 leading-relaxed">
          {data.improvements}
        </p>
      </div>

      {/* Teacher Summary */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-4 h-4 text-violet-500" />
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Teacher Summary
          </h3>
        </div>
        <p className="text-sm text-neutral-700 leading-relaxed font-medium">
          {data.teacher_summary}
        </p>
      </div>
    </div>
  );
}
