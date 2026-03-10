"use client";

import { useState } from "react";
import { QuizPlayer } from "./QuizPlayer";
import { QuizResults } from "./QuizResults";
import { QuizSetupData, QuizSetupForm } from "./QuizSetupForm";
import type { QuizApiResponse, QuizQuestionType, StudentAnswer } from "./types";

const DEFAULT_FORM: QuizSetupData = {
  grade: null,
  subject: "",
  topic: "",
  outputLanguage: "English",
  details: "",
  contextFiles: [],
  numQuestions: "10",
  questionTypes: [],
};

type QuizStage = "setup" | "quiz" | "result";

export function QuizModule() {
  const [formData, setFormData] = useState<QuizSetupData>(DEFAULT_FORM);
  const [stage, setStage] = useState<QuizStage>("setup");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generated, setGenerated] = useState<QuizApiResponse | null>(null);
  const [answers, setAnswers] = useState<StudentAnswer[]>([]);
  const [highestDifficulty, setHighestDifficulty] = useState(3);
  const [attemptSeed, setAttemptSeed] = useState(0);

  const handleChange = (partial: Partial<QuizSetupData>) => {
    setFormData((prev) => ({ ...prev, ...partial }));
  };

  const generateQuizBank = async () => {
    if (!formData.grade) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grade: formData.grade,
          subject: formData.subject,
          topic: formData.topic,
          outputLanguage: formData.outputLanguage,
          numQuestions: parseInt(formData.numQuestions, 10),
          details: formData.details.trim() || undefined,
          contextFiles: formData.contextFiles,
          questionTypes:
            formData.questionTypes.length > 0
              ? (formData.questionTypes as QuizQuestionType[])
              : undefined,
        }),
      });

      const data = (await response.json()) as QuizApiResponse & { error?: string };
      if (!response.ok) throw new Error(data.error || "Failed to generate quiz bank");

      setGenerated(data);
      setAnswers([]);
      setHighestDifficulty(3);
      setStage("quiz");
      setAttemptSeed((prev) => prev + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = (allAnswers: StudentAnswer[], peakDifficulty: number) => {
    setAnswers(allAnswers);
    setHighestDifficulty(peakDifficulty);
    setStage("result");
  };

  const handleTryAgain = () => {
    if (!generated) return;
    setAnswers([]);
    setHighestDifficulty(3);
    setStage("quiz");
    setAttemptSeed((prev) => prev + 1);
  };

  const handleNewQuiz = () => {
    setStage("setup");
    setGenerated(null);
    setAnswers([]);
    setHighestDifficulty(3);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      {stage === "setup" && (
        <QuizSetupForm formData={formData} onChange={handleChange} onSubmit={generateQuizBank} loading={loading} />
      )}

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl p-4 font-medium">
          {error}
        </div>
      )}

      {stage !== "setup" && generated && (
        <div className="bg-white rounded-2xl border border-neutral-100 p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-neutral-400 font-bold">Quiz</p>
          <h2 className="text-base font-bold text-neutral-900 mt-1">{generated.quiz_title}</h2>
          <p className="text-xs text-neutral-500 mt-1">
            Grade {generated.metadata.grade} • {generated.metadata.subject} • {generated.metadata.topic}
          </p>
        </div>
      )}

      {stage === "quiz" && generated && (
        <QuizPlayer
          key={`${generated.metadata.generatedAt}-${attemptSeed}`}
          questionBank={generated.questions}
          totalQuestions={generated.metadata.numQuestions}
          onComplete={handleComplete}
        />
      )}

      {stage === "result" && generated && (
        <QuizResults
          answers={answers}
          maxQuestions={generated.metadata.numQuestions}
          highestDifficulty={highestDifficulty}
          onTryAgain={handleTryAgain}
          onNewQuiz={handleNewQuiz}
        />
      )}
    </div>
  );
}
