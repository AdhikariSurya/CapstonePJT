import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_INSTRUCTION = `You are an expert reading assessment assistant for rural school students in India.
Evaluate the student's oral reading performance based on the reference text and the audio provided.

Evaluate on:
1. Word Accuracy (Did they say all words correctly?)
2. Pronunciation Quality
3. Fluency
4. Pacing
5. Confidence
6. Overall Reading Level

If the teacher has provided extra evaluation criteria, incorporate it into your assessment.

Be constructive and supportive.

Return output STRICTLY in JSON format:
{
  "word_accuracy_score": number (0-10),
  "pronunciation_score": number (0-10),
  "fluency_score": number (0-10),
  "pacing_score": number (0-10),
  "confidence_score": number (0-10),
  "overall_score": number (0-10),
  "mistakes": ["list specific word mistakes if any"],
  "strengths": "short paragraph",
  "improvements": "short paragraph",
  "teacher_summary": "2-3 line summary for teacher"
}

Do NOT return anything outside JSON. No markdown, no code fences, no explanation.`;

export async function POST(request: NextRequest) {
  try {
    const { referenceText, audioBase64, mimeType, optionalCriteria } =
      await request.json();

    if (!referenceText || !audioBase64) {
      return NextResponse.json(
        { error: "Missing referenceText or audioBase64" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    let userPrompt = `Reference text the student was asked to read:\n"${referenceText}"`;
    if (optionalCriteria?.trim()) {
      userPrompt += `\n\nTeacher's additional evaluation criteria:\n${optionalCriteria}`;
    }
    userPrompt += "\n\nPlease evaluate the student's reading from the attached audio.";

    const audioPart = {
      inlineData: {
        mimeType: mimeType || "audio/webm",
        data: audioBase64,
      },
    };

    // Attempt evaluation — retry once on JSON parse failure
    let lastError: Error | null = null;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const result = await model.generateContent([userPrompt, audioPart]);
        const responseText = result.response.text().trim();

        // Strip possible markdown fences
        const cleaned = responseText
          .replace(/^```json?\s*/i, "")
          .replace(/```\s*$/i, "")
          .trim();

        const parsed = JSON.parse(cleaned);
        return NextResponse.json(parsed);
      } catch (e) {
        lastError = e as Error;
      }
    }

    return NextResponse.json(
      {
        error: "Failed to parse evaluation response from Gemini",
        details: lastError?.message,
      },
      { status: 502 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
