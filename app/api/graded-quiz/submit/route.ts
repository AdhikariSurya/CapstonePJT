import { NextRequest, NextResponse } from "next/server";
import { createSubmission, hasSubmissionForRoll } from "@/lib/gradedQuizStore";
import type { StudentAnswer } from "@/components/quiz/types";

interface SubmitBody {
  quizId: string;
  shareCode: string;
  studentName: string;
  roll: string;
  answers: StudentAnswer[];
  totalQuestions: number;
  timeTakenSec: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SubmitBody;
    const studentName = body.studentName?.trim();
    const roll = body.roll?.trim();

    if (!body.quizId || !body.shareCode || !studentName || !roll || !Array.isArray(body.answers)) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const alreadyAttempted = await hasSubmissionForRoll(body.quizId, roll);
    if (alreadyAttempted) {
      return NextResponse.json({ error: "Roll number already attempted this quiz." }, { status: 409 });
    }

    const score = body.answers.filter((answer) => answer.isCorrect).length;
    const attemptedCount = body.answers.length;

    const saved = await createSubmission({
      quizId: body.quizId,
      shareCode: body.shareCode,
      studentName,
      roll,
      score,
      attemptedCount,
      totalQuestions: body.totalQuestions,
      timeTakenSec: body.timeTakenSec ?? 0,
      answers: body.answers,
    });

    return NextResponse.json({
      score: saved.score,
      attemptedCount: saved.attemptedCount,
      totalQuestions: saved.totalQuestions,
      submittedAt: saved.submittedAt,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to submit quiz.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
