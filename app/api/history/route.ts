import { NextRequest, NextResponse } from "next/server";
import {
  listGenerationHistory,
  saveGenerationHistory,
  type GenerationModule,
} from "@/lib/generationHistoryStore";

const ALLOWED_MODULES: GenerationModule[] = ["worksheet", "planner", "content"];

interface SaveHistoryBody {
  teacherName?: string;
  moduleType?: GenerationModule;
  title?: string;
  summary?: string;
  payload?: unknown;
}

export async function GET(request: NextRequest) {
  try {
    const teacherName = request.nextUrl.searchParams.get("teacherName") ?? undefined;
    const limitParam = request.nextUrl.searchParams.get("limit");
    const limit = limitParam ? Number(limitParam) : 25;

    const entries = await listGenerationHistory({
      teacherName,
      limit: Number.isFinite(limit) ? limit : 25,
    });

    return NextResponse.json({ entries });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch history.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SaveHistoryBody;
    if (!body.teacherName || body.teacherName.trim().length === 0) {
      return NextResponse.json({ error: "teacherName is required." }, { status: 400 });
    }
    if (!body.moduleType || !ALLOWED_MODULES.includes(body.moduleType)) {
      return NextResponse.json({ error: "moduleType is invalid." }, { status: 400 });
    }
    if (!body.title || body.title.trim().length === 0) {
      return NextResponse.json({ error: "title is required." }, { status: 400 });
    }
    if (!body.summary || body.summary.trim().length === 0) {
      return NextResponse.json({ error: "summary is required." }, { status: 400 });
    }
    if (body.payload === undefined) {
      return NextResponse.json({ error: "payload is required." }, { status: 400 });
    }

    const entry = await saveGenerationHistory({
      teacherName: body.teacherName,
      moduleType: body.moduleType,
      title: body.title,
      summary: body.summary,
      payload: body.payload,
    });

    return NextResponse.json({ entry });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save history.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
