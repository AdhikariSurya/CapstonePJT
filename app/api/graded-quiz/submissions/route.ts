import { NextRequest, NextResponse } from "next/server";
import { getSubmissionsByQuizId } from "@/lib/gradedQuizStore";

export async function GET(request: NextRequest) {
  try {
    const quizId = request.nextUrl.searchParams.get("quizId");
    if (!quizId) {
      return NextResponse.json({ error: "quizId is required." }, { status: 400 });
    }

    const submissions = await getSubmissionsByQuizId(quizId);
    return NextResponse.json({
      submissions: submissions.map((entry) => ({
        studentName: entry.studentName,
        roll: entry.roll,
        score: entry.score,
        attemptedCount: entry.attemptedCount,
        totalQuestions: entry.totalQuestions,
        submittedAt: entry.submittedAt,
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch submissions.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
