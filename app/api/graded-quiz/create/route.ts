import { NextRequest, NextResponse } from "next/server";
import { createGradedQuiz, type GradedRevealMode } from "@/lib/gradedQuizStore";
import type { QuizApiResponse } from "@/components/quiz/types";

interface CreateQuizBody {
  quiz: QuizApiResponse;
  durationMinutes: number;
  availableUntil: string;
  revealMode: GradedRevealMode;
  showFinalScore: boolean;
  teacherName?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateQuizBody;
    if (!body.quiz || !body.quiz.questions || !body.quiz.metadata) {
      return NextResponse.json({ error: "Invalid quiz payload." }, { status: 400 });
    }
    if (!body.durationMinutes || body.durationMinutes <= 0) {
      return NextResponse.json({ error: "Duration is required." }, { status: 400 });
    }
    if (!body.availableUntil) {
      return NextResponse.json({ error: "Availability end time is required." }, { status: 400 });
    }
    if (new Date(body.availableUntil).getTime() <= Date.now()) {
      return NextResponse.json({ error: "Availability must be a future time." }, { status: 400 });
    }
    if (body.revealMode !== "per_question" && body.revealMode !== "end") {
      return NextResponse.json({ error: "Invalid reveal mode." }, { status: 400 });
    }

    const created = await createGradedQuiz({
      quiz: body.quiz,
      durationMinutes: body.durationMinutes,
      availableUntil: body.availableUntil,
      revealMode: body.revealMode,
      showFinalScore: Boolean(body.showFinalScore),
      teacherName: body.teacherName,
    });

    return NextResponse.json(created);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create graded quiz.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
