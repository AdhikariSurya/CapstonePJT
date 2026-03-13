"use client";

import { useState } from "react";
import { ClipboardCheck, GraduationCap, MoveLeft } from "lucide-react";
import { QuizModule } from "./QuizModule";
import { GradedQuizModule } from "./GradedQuizModule";
import type { TeacherQuizMode } from "./gradedTypes";

export function TeacherQuizHub() {
  const [mode, setMode] = useState<TeacherQuizMode | null>(null);

  if (mode === "practice") {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setMode(null)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-neutral-900"
        >
          <MoveLeft className="w-4 h-4" />
          Back to quiz modes
        </button>
        <QuizModule />
      </div>
    );
  }

  if (mode === "graded") {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setMode(null)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-neutral-900"
        >
          <MoveLeft className="w-4 h-4" />
          Back to quiz modes
        </button>
        <GradedQuizModule />
      </div>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <button
        onClick={() => setMode("practice")}
        className="text-left bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm hover:border-neutral-300 transition-colors"
      >
        <div className="inline-flex items-center justify-center rounded-xl bg-violet-50 p-2">
          <GraduationCap className="w-5 h-5 text-violet-600" />
        </div>
        <h3 className="mt-3 text-base font-bold text-neutral-900">Practice Quiz</h3>
        <p className="mt-1 text-sm text-neutral-600">
          Use the current quiz experience for adaptive in-class practice.
        </p>
      </button>

      <button
        onClick={() => setMode("graded")}
        className="text-left bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm hover:border-neutral-300 transition-colors"
      >
        <div className="inline-flex items-center justify-center rounded-xl bg-blue-50 p-2">
          <ClipboardCheck className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="mt-3 text-base font-bold text-neutral-900">Graded Quiz</h3>
        <p className="mt-1 text-sm text-neutral-600">
          Create a timed quiz, share it with students, and view marks by name and roll.
        </p>
      </button>
    </div>
  );
}
