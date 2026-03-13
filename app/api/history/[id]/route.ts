import { NextResponse } from "next/server";
import { getGenerationHistoryById } from "@/lib/generationHistoryStore";

export async function GET(
  _request: Request,
  context: { params: { id: string } }
) {
  try {
    const id = context.params.id?.trim();
    if (!id) {
      return NextResponse.json({ error: "id is required." }, { status: 400 });
    }

    const entry = await getGenerationHistoryById(id);
    if (!entry) {
      return NextResponse.json({ error: "History entry not found." }, { status: 404 });
    }

    return NextResponse.json({ entry });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch history item.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
