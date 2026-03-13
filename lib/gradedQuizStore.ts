import type { QuizApiResponse, StudentAnswer } from "@/components/quiz/types";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export type GradedRevealMode = "per_question" | "end";

export interface CreateGradedQuizInput {
  quiz: QuizApiResponse;
  durationMinutes: number;
  availableUntil: string;
  revealMode: GradedRevealMode;
  showFinalScore: boolean;
  teacherName?: string;
}

export interface GradedQuizRecord {
  quizId: string;
  shareCode: string;
  shareLink: string;
  createdAt: string;
  availableUntil: string;
  durationMinutes: number;
  revealMode: GradedRevealMode;
  showFinalScore: boolean;
  teacherName: string;
  quizTitle: string;
  quizMetadataJson: string;
  questionsJson: string;
}

export interface GradedSubmissionRecord {
  quizId: string;
  shareCode: string;
  studentName: string;
  roll: string;
  score: number;
  attemptedCount: number;
  totalQuestions: number;
  submittedAt: string;
  timeTakenSec: number;
  answersJson: string;
}

export interface GradedQuizPublicData {
  quizId: string;
  shareCode: string;
  quizTitle: string;
  metadata: QuizApiResponse["metadata"];
  questions: QuizApiResponse["questions"];
  revealMode: GradedRevealMode;
  showFinalScore: boolean;
  durationMinutes: number;
  availableUntil: string;
}

function randomCode(length = 7): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

interface GradedQuizRow {
  quiz_id: string;
  share_code: string;
  share_link: string;
  created_at: string;
  available_until: string;
  duration_minutes: number;
  reveal_mode: GradedRevealMode;
  show_final_score: boolean;
  teacher_name: string;
  quiz_title: string;
  quiz_metadata_json: QuizApiResponse["metadata"];
  questions_json: QuizApiResponse["questions"];
}

interface GradedSubmissionRow {
  quiz_id: string;
  share_code: string;
  student_name: string;
  roll: string;
  score: number;
  attempted_count: number;
  total_questions: number;
  submitted_at: string;
  time_taken_sec: number;
  answers_json: StudentAnswer[];
}

function rowToQuizRecord(row: GradedQuizRow): GradedQuizRecord {
  return {
    quizId: row.quiz_id,
    shareCode: row.share_code,
    shareLink: row.share_link,
    createdAt: row.created_at,
    availableUntil: row.available_until,
    durationMinutes: Number(row.duration_minutes),
    revealMode: row.reveal_mode,
    showFinalScore: Boolean(row.show_final_score),
    teacherName: row.teacher_name ?? "",
    quizTitle: row.quiz_title ?? "",
    quizMetadataJson: JSON.stringify(row.quiz_metadata_json ?? {}),
    questionsJson: JSON.stringify(row.questions_json ?? []),
  };
}

function rowToSubmissionRecord(row: GradedSubmissionRow): GradedSubmissionRecord {
  return {
    quizId: row.quiz_id,
    shareCode: row.share_code,
    studentName: row.student_name,
    roll: row.roll,
    score: Number(row.score),
    attemptedCount: Number(row.attempted_count),
    totalQuestions: Number(row.total_questions),
    submittedAt: row.submitted_at,
    timeTakenSec: Number(row.time_taken_sec),
    answersJson: JSON.stringify(row.answers_json ?? []),
  };
}

async function generateUniqueShareCode() {
  const supabase = getSupabaseAdmin();

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const candidate = randomCode();
    const { data, error } = await supabase
      .from("graded_quizzes")
      .select("quiz_id")
      .eq("share_code", candidate)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      throw new Error(error.message);
    }
    if (!data) return candidate;
  }

  throw new Error("Unable to generate unique share code. Please retry.");
}

export async function createGradedQuiz(input: CreateGradedQuizInput) {
  const supabase = getSupabaseAdmin();
  const quizId = crypto.randomUUID();
  const shareCode = await generateUniqueShareCode();
  const createdAt = new Date().toISOString();
  const appBaseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL ?? "";
  const shareLink = appBaseUrl
    ? `${appBaseUrl.replace(/\/$/, "")}/games/join/${shareCode}`
    : `/games/join/${shareCode}`;

  const record: GradedQuizRecord = {
    quizId,
    shareCode,
    shareLink,
    createdAt,
    availableUntil: input.availableUntil,
    durationMinutes: input.durationMinutes,
    revealMode: input.revealMode,
    showFinalScore: input.showFinalScore,
    teacherName: input.teacherName ?? "Teacher",
    quizTitle: input.quiz.quiz_title,
    quizMetadataJson: JSON.stringify(input.quiz.metadata),
    questionsJson: JSON.stringify(input.quiz.questions),
  };

  const { error } = await supabase.from("graded_quizzes").insert({
    quiz_id: record.quizId,
    share_code: record.shareCode,
    share_link: record.shareLink,
    created_at: record.createdAt,
    available_until: record.availableUntil,
    duration_minutes: record.durationMinutes,
    reveal_mode: record.revealMode,
    show_final_score: record.showFinalScore,
    teacher_name: record.teacherName,
    quiz_title: record.quizTitle,
    quiz_metadata_json: input.quiz.metadata,
    questions_json: input.quiz.questions,
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    quizId: record.quizId,
    shareCode: record.shareCode,
    shareLink: record.shareLink,
    availableUntil: record.availableUntil,
  };
}

export async function getQuizByShareCode(shareCode: string): Promise<GradedQuizPublicData | null> {
  const supabase = getSupabaseAdmin();
  const query = await supabase
    .from("graded_quizzes")
    .select(
      "quiz_id, share_code, share_link, created_at, available_until, duration_minutes, reveal_mode, show_final_score, teacher_name, quiz_title, quiz_metadata_json, questions_json"
    )
    .eq("share_code", shareCode.toUpperCase())
    .maybeSingle();
  const data = query.data as GradedQuizRow | null;
  const { error } = query;

  if (error) {
    throw new Error(error.message);
  }
  if (!data) return null;

  const record = rowToQuizRecord(data);
  return {
    quizId: record.quizId,
    shareCode: record.shareCode,
    quizTitle: record.quizTitle,
    metadata: data.quiz_metadata_json ?? {
      grade: 0,
      subject: "",
      topic: "",
      numQuestions: 0,
      outputLanguage: "English",
      generatedAt: record.createdAt,
    },
    questions: data.questions_json ?? [],
    revealMode: record.revealMode,
    showFinalScore: record.showFinalScore,
    durationMinutes: record.durationMinutes,
    availableUntil: record.availableUntil,
  };
}

export async function hasSubmissionForRoll(quizId: string, roll: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  const normalized = roll.trim().toLowerCase();
  const { data, error } = await supabase
    .from("graded_submissions")
    .select("quiz_id")
    .eq("quiz_id", quizId)
    .eq("roll_normalized", normalized)
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    throw new Error(error.message);
  }

  return Boolean(data);
}

export async function createSubmission(input: {
  quizId: string;
  shareCode: string;
  studentName: string;
  roll: string;
  score: number;
  attemptedCount: number;
  totalQuestions: number;
  timeTakenSec: number;
  answers: StudentAnswer[];
}) {
  const supabase = getSupabaseAdmin();
  const submittedAt = new Date().toISOString();
  const record: GradedSubmissionRecord = {
    quizId: input.quizId,
    shareCode: input.shareCode,
    studentName: input.studentName,
    roll: input.roll,
    score: input.score,
    attemptedCount: input.attemptedCount,
    totalQuestions: input.totalQuestions,
    submittedAt,
    timeTakenSec: input.timeTakenSec,
    answersJson: JSON.stringify(input.answers),
  };

  const { error } = await supabase.from("graded_submissions").insert({
    quiz_id: record.quizId,
    share_code: record.shareCode,
    student_name: record.studentName,
    roll: record.roll,
    roll_normalized: record.roll.trim().toLowerCase(),
    score: record.score,
    attempted_count: record.attemptedCount,
    total_questions: record.totalQuestions,
    submitted_at: record.submittedAt,
    time_taken_sec: record.timeTakenSec,
    answers_json: input.answers,
  });

  if (error) {
    throw new Error(error.message);
  }

  return record;
}

export async function getSubmissionsByQuizId(quizId: string) {
  const supabase = getSupabaseAdmin();
  const query = await supabase
    .from("graded_submissions")
    .select(
      "quiz_id, share_code, student_name, roll, score, attempted_count, total_questions, submitted_at, time_taken_sec, answers_json"
    )
    .eq("quiz_id", quizId);
  const data = (query.data ?? []) as GradedSubmissionRow[];
  const { error } = query;

  if (error) {
    throw new Error(error.message);
  }

  return data
    .map((row) => rowToSubmissionRecord(row))
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}
