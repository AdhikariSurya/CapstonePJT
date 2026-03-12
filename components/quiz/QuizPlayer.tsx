"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, CheckCircle2, GripVertical, XCircle } from "lucide-react";
import type { QuizQuestion, StudentAnswer } from "./types";
import { useLanguage } from "@/components/LanguageProvider";

interface QuizPlayerProps {
  questionBank: QuizQuestion[];
  totalQuestions: number;
  onComplete: (answers: StudentAnswer[], highestDifficulty: number) => void;
}

type MatchSelection = Record<string, string>;

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function shuffled<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickNextQuestion(
  bank: QuizQuestion[],
  usedIds: Set<string>,
  targetDifficulty: number
): QuizQuestion | null {
  const bounded = Math.min(5, Math.max(1, targetDifficulty));

  for (let distance = 0; distance < 5; distance += 1) {
    const levels = distance === 0 ? [bounded] : [bounded - distance, bounded + distance];
    for (const level of levels) {
      if (level < 1 || level > 5) continue;
      const candidates = bank.filter((q) => q.difficulty === level && !usedIds.has(q.id));
      if (candidates.length > 0) {
        return candidates[Math.floor(Math.random() * candidates.length)];
      }
    }
  }

  const fallback = bank.filter((q) => !usedIds.has(q.id));
  if (fallback.length === 0) return null;
  return fallback[Math.floor(Math.random() * fallback.length)];
}

function Progress({
  current,
  total,
  streak,
  isHi,
}: {
  current: number;
  total: number;
  streak: number;
  isHi: boolean;
}) {
  const pct = Math.min(100, Math.round((current / total) * 100));
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-neutral-500">
          {isHi ? "प्रश्न" : "Question"} {current} {isHi ? "में से" : "of"} {total}
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-neutral-100 overflow-hidden">
        <div className="h-full bg-neutral-900 transition-all" style={{ width: `${pct}%` }} />
      </div>
      {streak >= 2 && (
        <p className="text-xs text-emerald-600 font-semibold">
          {isHi ? `${streak} लगातार सही!` : `${streak} in a row!`} 🔥
        </p>
      )}
    </div>
  );
}

export function QuizPlayer({ questionBank, totalQuestions, onComplete }: QuizPlayerProps) {
  const { t, locale } = useLanguage();
  const isHi = locale === "hi";
  const [usedIds, setUsedIds] = useState<Set<string>>(new Set());
  const [answers, setAnswers] = useState<StudentAnswer[]>([]);
  const [currentDifficulty, setCurrentDifficulty] = useState(3);
  const [highestDifficulty, setHighestDifficulty] = useState(3);
  const [consecutiveWrong, setConsecutiveWrong] = useState(0);
  const [streak, setStreak] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [answeredState, setAnsweredState] = useState<{
    isCorrect: boolean;
    message: string;
  } | null>(null);

  const [singleChoice, setSingleChoice] = useState("");
  const [fillAnswer, setFillAnswer] = useState("");
  const [multiChoice, setMultiChoice] = useState<string[]>([]);
  const [matchSelection, setMatchSelection] = useState<MatchSelection>({});
  const [activeLeft, setActiveLeft] = useState<string | null>(null);
  const [orderSelection, setOrderSelection] = useState<number[]>([]);

  const rightOptions = useMemo(() => {
    if (!currentQuestion || currentQuestion.type !== "match") return [];
    return shuffled(currentQuestion.pairs.map((pair) => pair.right));
  }, [currentQuestion]);

  useEffect(() => {
    const first = pickNextQuestion(questionBank, new Set(), 3);
    setCurrentQuestion(first);
  }, [questionBank]);

  useEffect(() => {
    setSingleChoice("");
    setFillAnswer("");
    setMultiChoice([]);
    setMatchSelection({});
    setActiveLeft(null);
    setAnsweredState(null);
    if (currentQuestion?.type === "order") {
      setOrderSelection(currentQuestion.items.map((_, idx) => idx));
    } else {
      setOrderSelection([]);
    }
  }, [currentQuestion]);

  const canSubmit = useMemo(() => {
    if (!currentQuestion || answeredState) return false;
    switch (currentQuestion.type) {
      case "mcq":
      case "true_false":
        return singleChoice.trim().length > 0;
      case "fill_blank":
        return fillAnswer.trim().length > 0;
      case "multi_select":
        return multiChoice.length > 0;
      case "match":
        return currentQuestion.pairs.every((pair) => Boolean(matchSelection[pair.left]));
      case "order":
        return orderSelection.length === currentQuestion.items.length;
      default:
        return false;
    }
  }, [answeredState, currentQuestion, fillAnswer, matchSelection, multiChoice, orderSelection, singleChoice]);

  const moveOrderItem = (idx: number, direction: "up" | "down") => {
    setOrderSelection((prev) => {
      const target = direction === "up" ? idx - 1 : idx + 1;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  };

  const handleOrderDragStart = (itemIdx: number, event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData("text/plain", String(itemIdx));
    event.dataTransfer.effectAllowed = "move";
  };

  const handleOrderDrop = (targetItemIdx: number, event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const draggedItemIdx = Number(event.dataTransfer.getData("text/plain"));
    if (Number.isNaN(draggedItemIdx)) return;

    setOrderSelection((prev) => {
      const from = prev.indexOf(draggedItemIdx);
      const to = prev.indexOf(targetItemIdx);
      if (from === -1 || to === -1 || from === to) return prev;
      const next = [...prev];
      next.splice(from, 1);
      next.splice(to, 0, draggedItemIdx);
      return next;
    });
  };

  const submitAnswer = () => {
    if (!currentQuestion || !canSubmit) return;

    let isCorrect = false;
    let studentAnswer: StudentAnswer["studentAnswer"] = "";
    let correctAnswer: StudentAnswer["correctAnswer"] = "";

    if (currentQuestion.type === "mcq" || currentQuestion.type === "true_false") {
      isCorrect = normalize(singleChoice) === normalize(currentQuestion.correct);
      studentAnswer = singleChoice;
      correctAnswer = currentQuestion.correct;
    }

    if (currentQuestion.type === "fill_blank") {
      const accepted = [currentQuestion.correct, ...(currentQuestion.acceptable_answers ?? [])].map(normalize);
      isCorrect = accepted.includes(normalize(fillAnswer));
      studentAnswer = fillAnswer;
      correctAnswer = currentQuestion.correct;
    }

    if (currentQuestion.type === "multi_select") {
      const student = [...multiChoice].map(normalize).sort();
      const correct = [...currentQuestion.correct].map(normalize).sort();
      isCorrect =
        student.length === correct.length && student.every((answer, index) => answer === correct[index]);
      studentAnswer = multiChoice;
      correctAnswer = currentQuestion.correct;
    }

    if (currentQuestion.type === "match") {
      const correctMap = currentQuestion.pairs.reduce<Record<string, string>>((acc, pair) => {
        acc[pair.left] = pair.right;
        return acc;
      }, {});
      isCorrect = currentQuestion.pairs.every(
        (pair) => normalize(matchSelection[pair.left] ?? "") === normalize(pair.right)
      );
      studentAnswer = matchSelection;
      correctAnswer = correctMap;
    }

    if (currentQuestion.type === "order") {
      isCorrect =
        orderSelection.length === currentQuestion.correct_order.length &&
        orderSelection.every((value, idx) => value === currentQuestion.correct_order[idx]);
      studentAnswer = orderSelection.map((idx) => currentQuestion.items[idx]);
      correctAnswer = currentQuestion.correct_order.map((idx) => currentQuestion.items[idx]);
    }

    const nextAnswer: StudentAnswer = {
      questionId: currentQuestion.id,
      difficulty: currentQuestion.difficulty,
      questionText: currentQuestion.question,
      type: currentQuestion.type,
      studentAnswer,
      correctAnswer,
      isCorrect,
      explanation: currentQuestion.explanation,
    };

    const nextAnswers = [...answers, nextAnswer];
    const newUsedIds = new Set(usedIds);
    newUsedIds.add(currentQuestion.id);

    setAnswers(nextAnswers);
    setUsedIds(newUsedIds);

    let nextDifficulty = currentDifficulty;
    if (isCorrect) {
      setConsecutiveWrong(0);
      setStreak((prev) => prev + 1);
      nextDifficulty = Math.min(5, currentDifficulty + 1);
    } else {
      const wrongChain = consecutiveWrong + 1;
      setConsecutiveWrong(wrongChain);
      setStreak(0);
      nextDifficulty = Math.max(1, currentDifficulty - 1);
      if (wrongChain >= 2) {
        nextDifficulty = Math.max(1, currentDifficulty - 2);
      }
    }

    setCurrentDifficulty(nextDifficulty);
    setHighestDifficulty((prev) => Math.max(prev, nextDifficulty));

    setAnsweredState({
      isCorrect,
      message: isCorrect ? "Correct! Nice work." : "Incorrect. Let's try the next one.",
    });
  };

  const nextQuestion = () => {
    if (!currentQuestion) return;
    const finished = answers.length >= totalQuestions;
    if (finished) {
      onComplete(answers, highestDifficulty);
      return;
    }

    const candidate = pickNextQuestion(questionBank, usedIds, currentDifficulty);
    if (!candidate) {
      onComplete(answers, highestDifficulty);
      return;
    }
    setCurrentQuestion(candidate);
  };

  if (!currentQuestion) {
    return (
      <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
        <p className="text-sm text-neutral-600">
          Quiz question bank is empty. Please go back and generate a new quiz.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Progress
        current={answers.length + 1}
        total={totalQuestions}
        streak={streak}
        isHi={isHi}
      />

      <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm space-y-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wider font-bold text-neutral-400">
            {currentQuestion.type.replace("_", " ")}
          </p>
          <h3 className="text-base font-bold text-neutral-900">{currentQuestion.question}</h3>
        </div>

        {(currentQuestion.type === "mcq" || currentQuestion.type === "true_false") && (
          <div className="space-y-2">
            {currentQuestion.options.map((option) => {
              const selected = singleChoice === option;
              return (
                <button
                  key={option}
                  onClick={() => setSingleChoice(option)}
                  className={`w-full text-left rounded-xl px-4 py-3 border text-sm transition-colors ${
                    selected
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        )}

        {currentQuestion.type === "fill_blank" && (
          <input
            type="text"
            value={fillAnswer}
            onChange={(e) => setFillAnswer(e.target.value)}
            placeholder={isHi ? "अपना उत्तर लिखें..." : "Type your answer..."}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300 transition-colors"
          />
        )}

        {currentQuestion.type === "multi_select" && (
          <div className="space-y-2">
            {currentQuestion.options.map((option) => {
              const selected = multiChoice.includes(option);
              return (
                <button
                  key={option}
                  onClick={() =>
                    setMultiChoice((prev) =>
                      prev.includes(option) ? prev.filter((v) => v !== option) : [...prev, option]
                    )
                  }
                  className={`w-full text-left rounded-xl px-4 py-3 border text-sm transition-colors ${
                    selected
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        )}

        {currentQuestion.type === "match" && (
          <div className="space-y-3">
            <p className="text-xs text-neutral-500">
              Tap a left item, then tap its matching right item.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-wider text-neutral-400 font-bold">Column A</p>
                {currentQuestion.pairs.map((pair) => {
                  const selected = activeLeft === pair.left;
                  const mapped = Boolean(matchSelection[pair.left]);
                  return (
                    <button
                      key={pair.left}
                      onClick={() => setActiveLeft((prev) => (prev === pair.left ? null : pair.left))}
                      className={`w-full text-left rounded-xl px-3 py-2.5 border text-xs font-semibold transition-colors ${
                        selected
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : mapped
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                      }`}
                    >
                      {pair.left}
                    </button>
                  );
                })}
              </div>
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-wider text-neutral-400 font-bold">Column B</p>
                {rightOptions.map((right) => {
                  const assignedLeft = Object.entries(matchSelection).find(
                    ([, mappedRight]) => mappedRight === right
                  )?.[0];
                  const disabled = Boolean(assignedLeft && assignedLeft !== activeLeft);
                  return (
                    <button
                      key={right}
                      onClick={() => {
                        if (!activeLeft || disabled) return;
                        setMatchSelection((prev) => {
                          const next = { ...prev };
                          Object.keys(next).forEach((left) => {
                            if (next[left] === right) delete next[left];
                          });
                          next[activeLeft] = right;
                          return next;
                        });
                        setActiveLeft(null);
                      }}
                      disabled={disabled}
                      className={`w-full text-left rounded-xl px-3 py-2.5 border text-xs font-medium transition-colors ${
                        assignedLeft
                          ? "border-blue-200 bg-blue-50 text-blue-700"
                          : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                      } disabled:opacity-60 disabled:cursor-not-allowed`}
                    >
                      {right}
                      {assignedLeft && <span className="ml-1">({assignedLeft})</span>}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 space-y-1.5">
              <p className="text-[11px] uppercase tracking-wider text-neutral-400 font-bold">
                Connections
              </p>
              {currentQuestion.pairs.map((pair) => (
                <p key={`connect-${pair.left}`} className="text-xs text-neutral-600">
                  {pair.left} {"->"} {matchSelection[pair.left] ?? "Not connected"}
                </p>
              ))}
            </div>
          </div>
        )}

        {currentQuestion.type === "order" && (
          <div className="space-y-2">
            <p className="text-xs text-neutral-500">
              Drag items to reorder. You can also use arrow buttons.
            </p>
            {orderSelection.map((itemIdx, idx) => (
              <div
                key={`${currentQuestion.id}-${itemIdx}`}
                draggable
                onDragStart={(event) => handleOrderDragStart(itemIdx, event)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => handleOrderDrop(itemIdx, event)}
                className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <GripVertical className="w-4 h-4 text-neutral-400 shrink-0" />
                  <p className="text-xs font-medium text-neutral-700">
                    {idx + 1}. {currentQuestion.items[itemIdx]}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveOrderItem(idx, "up")}
                    className="p-1.5 rounded-md border border-neutral-200 bg-white text-neutral-600 disabled:opacity-40"
                    disabled={idx === 0}
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveOrderItem(idx, "down")}
                    className="p-1.5 rounded-md border border-neutral-200 bg-white text-neutral-600 disabled:opacity-40"
                    disabled={idx === orderSelection.length - 1}
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {answeredState ? (
          <div className="space-y-3">
            <div
              className={`rounded-xl border px-3 py-2.5 text-xs ${
                answeredState.isCorrect
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              <div className="flex items-center gap-1.5 font-semibold">
                {answeredState.isCorrect ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                {answeredState.message}
              </div>
              <p className="mt-1">{currentQuestion.explanation}</p>
            </div>

            <button
              onClick={nextQuestion}
              className="w-full rounded-xl bg-neutral-900 text-white py-3 text-sm font-semibold transition-all touch-manipulation active:scale-[0.98]"
            >
              {answers.length >= totalQuestions ? t("core.quiz.finish") : t("core.quiz.next")}
            </button>
          </div>
        ) : (
          <button
            onClick={submitAnswer}
            disabled={!canSubmit}
            className="w-full rounded-xl bg-neutral-900 text-white py-3 text-sm font-semibold transition-all touch-manipulation active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {t("core.quiz.submit")}
          </button>
        )}
      </div>
    </div>
  );
}
