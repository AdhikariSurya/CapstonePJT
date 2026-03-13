import { NextRequest, NextResponse } from "next/server";
import { getQuizByShareCode, hasSubmissionForRoll } from "@/lib/gradedQuizStore";

export async function GET(
  request: NextRequest,
  context: { params: { shareCode: string } }
) {
  try {
    const shareCode = context.params.shareCode;
    const quiz = await getQuizByShareCode(shareCode);
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found." }, { status: 404 });
    }

    const now = Date.now();
    const availableUntilTime = new Date(quiz.availableUntil).getTime();
    const isOpen = availableUntilTime > now;
    const maxAllowedSeconds = Math.max(0, Math.floor((availableUntilTime - now) / 1000));
    const durationSeconds = quiz.durationMinutes * 60;

    const roll = request.nextUrl.searchParams.get("roll")?.trim().toLowerCase();
    if (!roll) {
      return NextResponse.json({
        ...quiz,
        isOpen,
        maxAllowedSeconds,
        durationSeconds,
      });
    }

    const alreadyAttempted = await hasSubmissionForRoll(quiz.quizId, roll);

    return NextResponse.json({
      ...quiz,
      isOpen,
      maxAllowedSeconds,
      durationSeconds,
      alreadyAttempted,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch quiz.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
