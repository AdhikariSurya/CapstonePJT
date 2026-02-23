import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

type QuestionCounts = Record<string, number>;

function gradeTier(grade: number): string {
  if (grade <= 3)
    return "Grades 1-3: Use very simple vocabulary, basic recall questions, concrete examples from daily life. Keep sentences short.";
  if (grade <= 6)
    return "Grades 4-6: Use moderate vocabulary, application-level questions, relatable examples. Expect 2-3 sentence answers for short answers.";
  return "Grades 7-10: Use subject-specific terminology, higher-order thinking (analysis, evaluation). Expect detailed, reasoned responses.";
}

function typeSection(type: string, count: number): string {
  switch (type) {
    case "mcq":
      return `### Section: Multiple Choice Questions (${count} questions)
Generate exactly ${count} MCQ questions. Each question must have 4 options labeled A, B, C, D.
Immediately after each question's options write the correct answer in plain text: Answer: X (do NOT bold this).`;
    case "short_answer":
      return `### Section: Short Answer Questions (${count} questions)
Generate exactly ${count} short answer questions. Each requires a 2-3 sentence response.
Immediately after each question write the expected answer in plain text: Answer: ... (do NOT bold this).`;
    case "long_answer":
      return `### Section: Long Answer Questions (${count} questions)
Generate exactly ${count} long answer questions. Each requires a detailed paragraph response.
Immediately after each question write a model answer in plain text: Model Answer: ... (do NOT bold this).`;
    case "fill_blanks":
      return `### Section: Fill in the Blanks (${count} questions)
Provide a Word Bank at the top listing all the missing words for this section.
Generate exactly ${count} sentences with one blank each.
Immediately after each sentence write the answer in plain text: Answer: ... (do NOT bold this). Do NOT add a separate Answer Key.`;
    default:
      return `### Section: ${type} (${count} questions)\nGenerate exactly ${count} questions of this type with inline answers.`;
  }
}

function buildPrompt(
  grades: number[],
  subject: string,
  topic: string,
  worksheetTypes: string[],
  questionCounts: QuestionCounts,
  outputLanguage: string,
  details: string | undefined
): string {
  const totalQuestions = worksheetTypes.reduce((sum, t) => sum + (questionCounts[t] ?? 0), 0);

  const sectionsDescription = worksheetTypes
    .map((t) => `  - ${t.replace("_", " ")}: ${questionCounts[t] ?? 0} questions`)
    .join("\n");

  const gradeBlocks = grades
    .map((g) => {
      const sections = worksheetTypes.map((t) => typeSection(t, questionCounts[t] ?? 0)).join("\n\n");
      return `## Grade ${g} Worksheet\n_${gradeTier(g)}_\n\n${sections}`;
    })
    .join("\n\n---\n\n");

  return `You are an expert Indian school curriculum worksheet generator. Generate differentiated worksheets for the following grades in a SINGLE response.

SPECIFICATIONS:
- Subject: ${subject}
- Topic: ${topic}
- Output Language: ${outputLanguage}
- Grades to generate: ${grades.join(", ")}
- Total questions per grade: ${totalQuestions}
- Question breakdown:
${sectionsDescription}
${details ? `- Additional context / reference material: ${details}` : ""}

DIFFERENTIATION RULES:
- Grades 1-3: Simple vocabulary, basic recall, concrete everyday examples, short sentences.
- Grades 4-6: Moderate vocabulary, concept application, relatable examples.
- Grades 7-10: Subject-specific terminology, higher-order thinking (Bloom's Taxonomy levels 4-6).

FORMATTING RULES:
- Start each grade section with exactly: ## Grade N Worksheet
- Put a horizontal rule (---) between grade sections
- Number all questions within each section clearly (1., 2., etc.)
- Write question text in bold: **Question text here**
- Write all answers immediately after their question in plain text (no bold, no emphasis)
- Do NOT add a separate Answer Key at the end — answers must appear inline after each question
- Use Markdown headings for grade sections (##) and question type sections (###)
- Do NOT add any preamble or explanation outside the worksheet content

Now generate all worksheets:

${gradeBlocks}`;
}

export async function POST(request: NextRequest) {
  try {
    const { grades, subject, topic, worksheetTypes, questionCounts, outputLanguage, details } =
      await request.json();

    if (!grades?.length || !subject || !topic || !worksheetTypes?.length || !outputLanguage) {
      return NextResponse.json(
        { error: "Missing required fields: grades, subject, topic, worksheetTypes, outputLanguage" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const prompt = buildPrompt(grades, subject, topic, worksheetTypes, questionCounts, outputLanguage, details);
    const result = await model.generateContent(prompt);
    const rawText = result.response.text().trim();

    // Parse out per-grade sections
    const gradeMap: Record<number, string> = {};
    for (const grade of grades) {
      const regex = new RegExp(
        `## Grade ${grade} Worksheet[\\s\\S]*?(?=## Grade \\d+ Worksheet|$)`,
        "i"
      );
      const match = rawText.match(regex);
      gradeMap[grade] =
        match
          ? match[0].trim()
          : `## Grade ${grade} Worksheet\n\n_Content not generated. Please try again._`;
    }

    return NextResponse.json({
      worksheets: gradeMap,
      metadata: {
        grades,
        subject,
        topic,
        worksheetTypes,
        questionCounts,
        outputLanguage,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
