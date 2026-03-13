"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Copy, Loader2, RefreshCcw, Share2 } from "lucide-react";
import { QuizSetupData, QuizSetupForm } from "./QuizSetupForm";
import type { QuizApiResponse, QuizQuestionType } from "./types";
import type { GradedQuizCreateResponse, GradedRevealMode, GradedSubmissionView } from "./gradedTypes";

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

const DURATION_OPTIONS = ["5", "10", "15", "20", "30"];

function toLocalDateTimeInputValue(date: Date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

function toAbsoluteUrl(urlOrPath: string): string {
  if (/^https?:\/\//i.test(urlOrPath)) return urlOrPath;
  if (typeof window === "undefined") return urlOrPath;
  return `${window.location.origin}${urlOrPath.startsWith("/") ? "" : "/"}${urlOrPath}`;
}

export function GradedQuizModule() {
  const [formData, setFormData] = useState<QuizSetupData>(DEFAULT_FORM);
  const [durationMinutesInput, setDurationMinutesInput] = useState("10");
  const [availableUntilLocal, setAvailableUntilLocal] = useState(() =>
    toLocalDateTimeInputValue(new Date(Date.now() + 60 * 60 * 1000))
  );
  const [revealMode, setRevealMode] = useState<GradedRevealMode>("end");
  const [showFinalScore, setShowFinalScore] = useState(true);
  const [teacherName, setTeacherName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<GradedQuizCreateResponse | null>(null);
  const [submissions, setSubmissions] = useState<GradedSubmissionView[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const quizCloseTimeMs = useMemo(() => new Date(availableUntilLocal).getTime(), [availableUntilLocal]);

  const handleChange = (partial: Partial<QuizSetupData>) => {
    setFormData((prev) => ({ ...prev, ...partial }));
  };

  const fetchSubmissions = async (quizId: string) => {
    setLoadingSubmissions(true);
    try {
      const res = await fetch(`/api/graded-quiz/submissions?quizId=${encodeURIComponent(quizId)}`);
      const data = (await res.json()) as { submissions?: GradedSubmissionView[]; error?: string };
      if (!res.ok) throw new Error(data.error || "Failed to fetch submissions.");
      setSubmissions(data.submissions ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch submissions.");
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const createGradedQuiz = async () => {
    if (!formData.grade) return;
    setError(null);
    const parsedDurationMinutes = Number(durationMinutesInput);

    if (!availableUntilLocal || Number.isNaN(quizCloseTimeMs) || quizCloseTimeMs <= Date.now()) {
      setError("Please select a valid future availability time.");
      return;
    }
    if (!Number.isFinite(parsedDurationMinutes) || parsedDurationMinutes <= 0) {
      setError("Please enter a valid quiz duration in minutes.");
      return;
    }

    setLoading(true);
    try {
      const generatedRes = await fetch("/api/quiz/generate", {
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
      const generatedData = (await generatedRes.json()) as QuizApiResponse & { error?: string };
      if (!generatedRes.ok) throw new Error(generatedData.error || "Failed to generate quiz bank.");

      const createRes = await fetch("/api/graded-quiz/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quiz: generatedData,
          durationMinutes: parsedDurationMinutes,
          availableUntil: new Date(availableUntilLocal).toISOString(),
          revealMode,
          showFinalScore,
          teacherName: teacherName.trim() || undefined,
        }),
      });
      const createData = (await createRes.json()) as GradedQuizCreateResponse & { error?: string };
      if (!createRes.ok) throw new Error(createData.error || "Failed to create graded quiz.");

      setCreated(createData);
      setSubmissions([]);
      await fetchSubmissions(createData.quizId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const copyShareLink = async () => {
    if (!created) return;
    const absolute = toAbsoluteUrl(created.shareLink);
    await navigator.clipboard.writeText(absolute);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 1800);
  };

  return (
    <div className="space-y-5">
      <QuizSetupForm formData={formData} onChange={handleChange} onSubmit={createGradedQuiz} loading={loading} />

      <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">Graded Quiz Settings</h3>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-xs text-neutral-500 font-semibold">Teacher Name (optional)</span>
            <input
              type="text"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              placeholder="Ms. Sharma"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs text-neutral-500 font-semibold">Duration (minutes)</span>
            <input
              type="number"
              min={1}
              step={1}
              value={durationMinutesInput}
              onChange={(e) => setDurationMinutesInput(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300"
              placeholder="Enter any duration, e.g. 7"
            />
            <div className="flex flex-wrap gap-2 pt-1">
              {DURATION_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => setDurationMinutesInput(option)}
                  className={`px-2.5 py-1.5 rounded-full border text-xs font-semibold ${
                    durationMinutesInput === option
                      ? "bg-neutral-900 text-white border-neutral-900"
                      : "bg-white text-neutral-700 border-neutral-200"
                  }`}
                >
                  {option}m
                </button>
              ))}
            </div>
          </label>

          <label className="space-y-1.5 md:col-span-2">
            <span className="text-xs text-neutral-500 font-semibold">Quiz Available Until (set in IST)</span>
            <input
              type="datetime-local"
              value={availableUntilLocal}
              onChange={(e) => setAvailableUntilLocal(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300"
            />
          </label>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-neutral-500 font-semibold">Answer reveal behavior</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setRevealMode("per_question")}
              className={`px-3 py-2 rounded-full border text-sm font-semibold ${
                revealMode === "per_question"
                  ? "bg-neutral-900 text-white border-neutral-900"
                  : "bg-white text-neutral-700 border-neutral-200"
              }`}
            >
              After each question
            </button>
            <button
              onClick={() => setRevealMode("end")}
              className={`px-3 py-2 rounded-full border text-sm font-semibold ${
                revealMode === "end"
                  ? "bg-neutral-900 text-white border-neutral-900"
                  : "bg-white text-neutral-700 border-neutral-200"
              }`}
            >
              At end of quiz
            </button>
          </div>
        </div>

        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={showFinalScore}
            onChange={(e) => setShowFinalScore(e.target.checked)}
            className="mt-1"
          />
          <span className="text-sm text-neutral-700">
            Show final score to students at the end (enabled by default)
          </span>
        </label>
      </div>

      {loading && (
        <div className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-600 flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Creating graded quiz and share link...
        </div>
      )}

      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {created && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Graded quiz is ready to share
              </h3>
              <span className="text-xs font-semibold text-neutral-500">Code: {created.shareCode}</span>
            </div>
            <p className="text-sm text-neutral-600 break-all">{toAbsoluteUrl(created.shareLink)}</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={copyShareLink}
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
              >
                {copySuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                {copySuccess ? "Copied" : "Copy share link"}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">Student submissions</h4>
              <button
                onClick={() => fetchSubmissions(created.quizId)}
                disabled={loadingSubmissions}
                className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-2.5 py-1.5 text-xs font-semibold text-neutral-700"
              >
                <RefreshCcw className={`w-3.5 h-3.5 ${loadingSubmissions ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
            {submissions.length === 0 ? (
              <p className="text-sm text-neutral-500">No submissions yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-neutral-500">
                      <th className="py-2 pr-3 font-semibold">Name</th>
                      <th className="py-2 pr-3 font-semibold">Roll</th>
                      <th className="py-2 pr-3 font-semibold">Score</th>
                      <th className="py-2 pr-3 font-semibold">Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((submission) => (
                      <tr key={`${submission.roll}-${submission.submittedAt}`} className="border-t border-neutral-100">
                        <td className="py-2 pr-3 text-neutral-800">{submission.studentName}</td>
                        <td className="py-2 pr-3 text-neutral-700">{submission.roll}</td>
                        <td className="py-2 pr-3 text-neutral-800 font-semibold">
                          {submission.score}/{submission.totalQuestions}
                        </td>
                        <td className="py-2 pr-3 text-neutral-600">
                          {new Date(submission.submittedAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
