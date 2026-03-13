"use client";

import { FormEvent, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { QuizPlayer } from "@/components/quiz/QuizPlayer";
import { QuizResults } from "@/components/quiz/QuizResults";
import type { StudentAnswer } from "@/components/quiz/types";
import type { GradedQuizPayload } from "@/components/quiz/gradedTypes";

type JoinStage = "identify" | "quiz" | "result";

interface CompletionData {
  answers: StudentAnswer[];
  highestDifficulty: number;
}

export default function JoinGradedQuizPage() {
  const params = useParams<{ shareCode: string }>();
  const shareCode = params.shareCode;
  const [stage, setStage] = useState<JoinStage>("identify");
  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizData, setQuizData] = useState<GradedQuizPayload | null>(null);
  const [completion, setCompletion] = useState<CompletionData | null>(null);
  const [timeTakenSec, setTimeTakenSec] = useState(0);
  const [quizStartedAt, setQuizStartedAt] = useState<number | null>(null);

  const allowedTimerSeconds = useMemo(() => {
    if (!quizData) return undefined;
    return Math.min(quizData.durationSeconds, quizData.maxAllowedSeconds);
  }, [quizData]);

  const startAttempt = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!name.trim() || !roll.trim()) {
      setError("Please enter both name and roll number.");
      return;
    }

    setLoading(true);
    try {
      const query = new URLSearchParams({ roll: roll.trim() });
      const res = await fetch(`/api/graded-quiz/${shareCode}?${query.toString()}`);
      const data = (await res.json()) as GradedQuizPayload & { error?: string };
      if (!res.ok) throw new Error(data.error || "Unable to load quiz.");
      if (!data.isOpen) throw new Error("This quiz is no longer accepting responses.");
      if ((data.alreadyAttempted ?? false) === true) {
        throw new Error("This roll number has already attempted this quiz.");
      }
      if (Math.min(data.durationSeconds, data.maxAllowedSeconds) <= 0) {
        throw new Error("Quiz time window has ended.");
      }

      setQuizData(data);
      setQuizStartedAt(Date.now());
      setStage("quiz");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to join quiz.");
    } finally {
      setLoading(false);
    }
  };

  const onComplete = async (answers: StudentAnswer[], highestDifficulty: number) => {
    if (!quizData) return;
    const elapsed = quizStartedAt ? Math.max(0, Math.floor((Date.now() - quizStartedAt) / 1000)) : 0;
    setTimeTakenSec(elapsed);
    try {
      const submitRes = await fetch("/api/graded-quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId: quizData.quizId,
          shareCode: quizData.shareCode,
          studentName: name.trim(),
          roll: roll.trim(),
          answers,
          totalQuestions: quizData.metadata.numQuestions,
          timeTakenSec: elapsed,
        }),
      });
      const submitData = (await submitRes.json()) as { error?: string };
      if (!submitRes.ok && submitRes.status !== 409) {
        throw new Error(submitData.error || "Failed to submit quiz.");
      }
      setCompletion({ answers, highestDifficulty });
      setStage("result");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to submit quiz.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <main className="px-4 pt-8 max-w-3xl mx-auto space-y-4">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Student Quiz Join</h1>
          <p className="text-sm text-neutral-500 mt-1">Enter your details to start the graded quiz.</p>
        </div>

        {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        {stage === "identify" && (
          <form onSubmit={startAttempt} className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm space-y-3">
            <label className="block space-y-1">
              <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold">Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm"
                placeholder="Student name"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold">Roll Number</span>
              <input
                type="text"
                value={roll}
                onChange={(e) => setRoll(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm"
                placeholder="e.g. 23"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 text-white py-3 text-sm font-semibold disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Start Quiz
            </button>
          </form>
        )}

        {stage === "quiz" && quizData && (
          <QuizPlayer
            key={`${quizData.quizId}-${name}-${roll}`}
            questionBank={quizData.questions}
            totalQuestions={quizData.metadata.numQuestions}
            onComplete={onComplete}
            feedbackMode={quizData.revealMode}
            timerSeconds={allowedTimerSeconds}
          />
        )}

        {stage === "result" && completion && quizData && (
          <QuizResults
            answers={completion.answers}
            maxQuestions={quizData.metadata.numQuestions}
            highestDifficulty={completion.highestDifficulty}
            onTryAgain={() => undefined}
            onNewQuiz={() => undefined}
            showScoreSummary={quizData.showFinalScore}
            hideActions
          />
        )}

        {stage === "result" && (
          <div className="text-xs text-neutral-500">Submission recorded. Time taken: {timeTakenSec} seconds.</div>
        )}
      </main>
    </div>
  );
}
