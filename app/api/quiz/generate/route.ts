import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface QuizRequestBody {
  grade: number;
  subject: string;
  topic: string;
  outputLanguage: string;
  numQuestions: number;
  details?: string;
  questionTypes?: string[];
}

const ALLOWED_QUESTION_TYPES = [
  "mcq",
  "fill_blank",
  "true_false",
  "match",
  "order",
  "multi_select",
] as const;

type AllowedQuestionType = (typeof ALLOWED_QUESTION_TYPES)[number];
type NormalizedQuestion = Record<string, unknown> & {
  id: string;
  type: AllowedQuestionType;
};

function canonicalQuestionType(raw: string): AllowedQuestionType | null {
  const normalized = raw
    .trim()
    .toLowerCase()
    .replace(/[ -]+/g, "_")
    .replace(/\//g, "_")
    .replace(/[^a-z_]/g, "");

  const aliasMap: Record<string, AllowedQuestionType> = {
    mcq: "mcq",
    multiple_choice: "mcq",
    multiplechoice: "mcq",
    fill_blank: "fill_blank",
    fill_in_blank: "fill_blank",
    fillintheblank: "fill_blank",
    true_false: "true_false",
    truefalse: "true_false",
    match: "match",
    match_the_following: "match",
    matchthefollowing: "match",
    order: "order",
    ordering: "order",
    sequence: "order",
    multi_select: "multi_select",
    multiselect: "multi_select",
    multi_choice: "multi_select",
  };

  return aliasMap[normalized] ?? null;
}

function stripCodeFence(raw: string): string {
  return raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
}

function buildPrompt({
  grade,
  subject,
  topic,
  outputLanguage,
  numQuestions,
  details,
  questionTypes,
}: QuizRequestBody): string {
  const questionTypeInstruction =
    questionTypes && questionTypes.length > 0
      ? `3) Use ONLY these question types and distribute them as evenly as possible:\n${questionTypes
          .map((type) => `   - ${type}`)
          .join("\n")}`
      : `3) Use all six question types and distribute them roughly evenly:
   - mcq
   - fill_blank
   - true_false
   - match
   - order
   - multi_select`;

  return `You are an expert Indian school assessment designer.

Generate a dynamic quiz question bank as STRICT JSON only (no markdown, no extra text).

Teacher configuration:
- Grade: ${grade}
- Subject: ${subject}
- Topic: ${topic}
- Output Language: ${outputLanguage}
- Student quiz length target: ${numQuestions}
${details ? `- Optional reference text/context: ${details}` : ""}

CRITICAL REQUIREMENTS:
1) Return exactly 25 questions in a single JSON object.
2) Cover difficulty levels 1 to 5 with exactly 5 questions at each difficulty.
${questionTypeInstruction}
4) Keep vocabulary grade-appropriate for Grade ${grade}.
5) Ensure factual correctness and unambiguous answers.
6) Keep each question concise and classroom-friendly.
7) Do not repeat the same concept phrasing across many questions.

JSON OUTPUT SCHEMA:
{
  "quiz_title": "string",
  "questions": [
    {
      "id": "q1",
      "type": "mcq | fill_blank | true_false | match | order | multi_select",
      "difficulty": 1,
      "question": "string",
      "options": ["..."],                   // required for mcq, true_false, multi_select
      "correct": "string | string[]",       // mcq/true_false/fill_blank => string; multi_select => string[]
      "acceptable_answers": ["..."],        // optional for fill_blank
      "pairs": [{"left":"...","right":"..."}], // required for match
      "items": ["..."],                     // required for order
      "correct_order": [0,1,2,3],           // required for order (indices in correct sequence)
      "explanation": "short explanation"
    }
  ]
}

TYPE RULES:
- true_false must include exactly 2 options: ["True", "False"].
- match should have 4 pairs.
- order should have 4 to 6 items and a valid correct_order index list.
- multi_select must have 4 to 6 options and at least 2 correct answers.
- fill_blank acceptable_answers should include common case variants if needed.

OUTPUT FORMAT RULES:
- Return pure JSON only.
- No markdown code fences.
- No comments.
- No trailing commas.`;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as QuizRequestBody;
    const { grade, subject, topic, outputLanguage, numQuestions, details, questionTypes } = body;
    const normalizedRequestedTypes = (questionTypes ?? [])
      .map(canonicalQuestionType)
      .filter((type): type is AllowedQuestionType => Boolean(type));

    if (!grade || !subject || !topic || !outputLanguage || !numQuestions) {
      return NextResponse.json(
        { error: "Missing required fields: grade, subject, topic, outputLanguage, numQuestions" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const prompt = buildPrompt({
      grade,
      subject,
      topic,
      outputLanguage,
      numQuestions,
      details,
      questionTypes: normalizedRequestedTypes,
    });
    const result = await model.generateContent(prompt);
    const raw = result.response.text();
    const clean = stripCodeFence(raw);

    let parsed: unknown;
    try {
      parsed = JSON.parse(clean);
    } catch {
      return NextResponse.json(
        { error: "Model did not return valid JSON. Please regenerate." },
        { status: 502 }
      );
    }

    if (!isObject(parsed) || !Array.isArray(parsed.questions)) {
      return NextResponse.json(
        { error: "Invalid quiz response structure. Please regenerate." },
        { status: 502 }
      );
    }

    const normalizedQuestions = parsed.questions
      .map((question, index) => {
        if (!isObject(question) || typeof question.type !== "string") return null;
        const canonicalType = canonicalQuestionType(question.type);
        if (!canonicalType) return null;
        return {
          ...question,
          id: typeof question.id === "string" ? question.id : `q${index + 1}`,
          type: canonicalType,
        } satisfies NormalizedQuestion;
      })
      .filter((question): question is NormalizedQuestion => question !== null);

    if (normalizedQuestions.length === 0) {
      return NextResponse.json(
        { error: "Model returned unsupported question types. Please regenerate." },
        { status: 502 }
      );
    }

    // If teacher selected specific types, prefer those questions.
    // If model under-produces them, fallback to all normalized questions to avoid blocking quiz generation.
    const selectedTypeSet = new Set(normalizedRequestedTypes);
    const filteredQuestions =
      selectedTypeSet.size > 0
        ? normalizedQuestions.filter((question) =>
            selectedTypeSet.has(question.type as AllowedQuestionType)
          )
        : normalizedQuestions;
    const finalQuestions = filteredQuestions.length > 0 ? filteredQuestions : normalizedQuestions;

    return NextResponse.json({
      quiz_title: typeof parsed.quiz_title === "string" ? parsed.quiz_title : `${topic} Quiz`,
      questions: finalQuestions,
      metadata: {
        grade,
        subject,
        topic,
        numQuestions,
        outputLanguage,
        selectedQuestionTypes:
          normalizedRequestedTypes.length > 0 ? normalizedRequestedTypes : undefined,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
