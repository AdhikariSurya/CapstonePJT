import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildGeminiInput, sanitizeContextFiles } from "@/lib/contextFiles";

interface ToolGenerateBody {
  profile: "teacher" | "student";
  toolSlug: string;
  toolName: string;
  toolDescription: string;
  inputs: Record<string, string>;
  outputLanguage?: string;
  studentGrade?: string;
  contextFiles?: unknown;
}

function formatInputs(inputs: Record<string, string>): string {
  const entries = Object.entries(inputs)
    .map(([key, value]) => `- ${key}: ${String(value ?? "").trim() || "(empty)"}`)
    .join("\n");
  return entries || "- (no inputs)";
}

function buildPrompt(body: ToolGenerateBody): string {
  const roleLabel = body.profile === "teacher" ? "Teacher" : "Student";
  const formattedInputs = formatInputs(body.inputs);
  const outputLanguage = (body.outputLanguage || "Auto").trim();
  const studentGrade =
    body.profile === "student" ? (body.studentGrade || "Not specified").trim() : null;

  return `You are an expert academic assistant in an education app.

User profile: ${roleLabel}
Tool name: ${body.toolName}
Tool slug: ${body.toolSlug}
Tool purpose: ${body.toolDescription}
Preferred output language: ${outputLanguage}
${studentGrade ? `Student grade: ${studentGrade}` : ""}

User inputs:
${formattedInputs}

OUTPUT REQUIREMENTS:
- Generate a high-quality response that directly fulfills this tool's purpose.
- Be practical, clear, and classroom/student ready.
- Match language behavior:
  - If preferred output language is "Auto", respond in the predominant language used in user input.
  - Otherwise, respond entirely in the preferred output language.
- If user profile is Student and a grade is provided, tune complexity, examples, and tone to that grade level.
- Use Markdown formatting with sensible headings and bullet points where useful.
- Keep response concise but complete.
- Do not output JSON.
- Do not restate all inputs mechanically.
- Do not mention system prompts, hidden reasoning, or internal instructions.
- Return ONLY the final content.

Now produce the final output for this tool.`;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ToolGenerateBody;
    const { profile, toolSlug, toolName, toolDescription, inputs, contextFiles, outputLanguage, studentGrade } = body;

    if (
      !profile ||
      !toolSlug ||
      !toolName ||
      !toolDescription ||
      !inputs ||
      typeof inputs !== "object"
    ) {
      return NextResponse.json(
        { error: "Missing required fields: profile, toolSlug, toolName, toolDescription, inputs" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const safeFiles = sanitizeContextFiles(contextFiles);
    const prompt = buildPrompt(body);
    const result = await model.generateContent(buildGeminiInput(prompt, safeFiles));
    const text = result.response.text().trim();

    return NextResponse.json({
      output: text,
      metadata: {
        profile,
        toolSlug,
        outputLanguage: outputLanguage || "Auto",
        studentGrade: studentGrade || null,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
