import type { QuizApiResponse } from "./types";

export type TeacherQuizMode = "practice" | "graded";
export type GradedRevealMode = "per_question" | "end";

export interface GradedQuizCreateResponse {
  quizId: string;
  shareCode: string;
  shareLink: string;
  availableUntil: string;
}

export interface GradedQuizPayload extends GradedQuizCreateResponse {
  quizTitle: string;
  metadata: QuizApiResponse["metadata"];
  questions: QuizApiResponse["questions"];
  revealMode: GradedRevealMode;
  showFinalScore: boolean;
  durationMinutes: number;
  isOpen: boolean;
  maxAllowedSeconds: number;
  durationSeconds: number;
  alreadyAttempted?: boolean;
}

export interface GradedSubmissionView {
  studentName: string;
  roll: string;
  score: number;
  attemptedCount: number;
  totalQuestions: number;
  submittedAt: string;
}
