import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

function buildPrompt(
  grade: number,
  subject: string,
  topic: string,
  duration: number,
  outputLanguage: string,
  details: string | undefined
): string {
  return `You are an expert pedagogical planner for Indian schools. Create a detailed lesson plan for a ${duration}-minute class.

SPECIFICATIONS:
- Grade Level: ${grade}
- Subject: ${subject}
- Topic: ${topic}
- Duration: ${duration} minutes
- Output Language: ${outputLanguage}
${details ? `- Additional Context: ${details}` : ""}

PEDAGOGICAL FRAMEWORK:
- Use the Gradual Release of Responsibility model (I do, We do, You do).
- Align with Bloom's Taxonomy appropriate for Grade ${grade}.
- Ensure time allocation fits exactly ${duration} minutes.

FORMATTING RULES:
- Start with a main heading: # **Lesson Title**
- Use the following section headings exactly as written below (with ### **Heading:** format):
  1. ### **Objective:**
  2. ### **Assessment:** (Brief formative/summative idea, do not generate full worksheet)
  3. ### **Key Points:**
  4. ### **Opening:** (Include time allocation in minutes)
  5. ### **Introduction to New Material:** (Include time allocation in minutes)
  6. ### **Guided Practice:** (Include time allocation in minutes)
  7. ### **Independent Practice:** (Include time allocation in minutes)
  8. ### **Closing:** (Include time allocation in minutes)
  9. ### **Extension Activity:**
  10. ### **Homework:**

- Use bullet points for content within sections.
- Keep language clear, actionable, and encouraging.
- Do NOT add any preamble or conversational text. Just the lesson plan.

Now generate the lesson plan.`;
}

export async function POST(request: NextRequest) {
  try {
    const { grade, subject, topic, duration, outputLanguage, details } = await request.json();

    if (!grade || !subject || !topic || !duration || !outputLanguage) {
      return NextResponse.json(
        { error: "Missing required fields: grade, subject, topic, duration, outputLanguage" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const prompt = buildPrompt(grade, subject, topic, duration, outputLanguage, details);
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    return NextResponse.json({
      plan: text,
      metadata: {
        grade,
        subject,
        topic,
        duration,
        outputLanguage,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
