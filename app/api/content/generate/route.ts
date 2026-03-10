import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildGeminiInput, sanitizeContextFiles } from "@/lib/contextFiles";

type ContentType = "story" | "poem" | "play" | "essay" | "article" | "biography";
type Language = "english" | "hindi" | "bengali";

const LANGUAGE_CONTEXT: Record<Language, { name: string; script: string; culture: string }> = {
  english: {
    name: "English",
    script: "Latin script in standard Indian English",
    culture:
      "Indian cultural context — reference Indian festivals, geography, food, traditions, customs, flora and fauna, and everyday life familiar to Indian students",
  },
  hindi: {
    name: "Hindi",
    script: "Devanagari script (हिन्दी). Use proper conjuncts, matras, and diacritics.",
    culture:
      "हिंदी भाषी क्षेत्र की संस्कृति — भारतीय त्योहार, रीति-रिवाज, लोक-कथाएं, ग्रामीण जीवन, प्रकृति और परिवेश का उपयोग करें",
  },
  bengali: {
    name: "Bengali",
    script: "Bengali script (বাংলা). Use proper Unicode Bengali characters with correct conjuncts.",
    culture:
      "বাংলাদেশ ও পশ্চিমবঙ্গের সংস্কৃতি — বাংলার উৎসব, লোককথা, নদী, প্রকৃতি, গ্রামজীবন এবং পরিচিত রেফারেন্স ব্যবহার করুন",
  },
};

const TYPE_INSTRUCTIONS: Record<ContentType, string> = {
  story:
    "Write a complete narrative story with a clear beginning, middle, and end. Include character development, dialogue, and a moral lesson. Use traditional storytelling style with cultural wisdom. Format with paragraphs.",
  poem:
    "Write a rhythmic poem with multiple stanzas. Follow cultural poetic traditions. Include imagery, metaphor, and cultural symbolism. Format each stanza separately with a blank line between stanzas.",
  play:
    "Write a short play with 2-3 scenes. Include character names in bold before their dialogue (e.g. **Ram:** ...), clear stage directions in italics, and scene headings. Ensure natural, engaging dialogue.",
  essay:
    "Write a structured essay with an introduction, 3-4 body paragraphs, and a conclusion. Use clear argumentation, examples, and a logical flow. Use ## for section headings.",
  article:
    "Write an informative article with a headline, lead paragraph, and well-structured body sections. Present facts clearly with examples. Use ## for section headings.",
  biography:
    "Write a biography in chronological or thematic structure. Include early life, key achievements, challenges, and lasting impact. Use ## for section headings.",
};

function buildPrompt(
  language: Language,
  contentType: ContentType,
  description: string
): string {
  const lang = LANGUAGE_CONTEXT[language];
  const typeInstruction = TYPE_INSTRUCTIONS[contentType];

  return `You are an expert educational content writer creating culturally authentic content for Indian school students.

SPECIFICATIONS:
- Language: ${lang.name}
- Script: ${lang.script}
- Content Type: ${contentType.charAt(0).toUpperCase() + contentType.slice(1)}
- Content Description: ${description}

CULTURAL CONTEXT:
${lang.culture}

CONTENT REQUIREMENTS:
${typeInstruction}

IMPORTANT RULES:
- Write the ENTIRE content in ${lang.name} using ${lang.script}
- Only section headings (if used) may appear in English for markdown formatting
- Make content culturally relevant, age-appropriate, and aligned with NCERT themes
- Embed moral or ethical lessons naturally where appropriate
- Do NOT include any preamble, explanation, or meta-commentary — output the content directly
- Start with a title using # **Title**

Now write the ${contentType}:`;
}

export async function POST(request: NextRequest) {
  try {
    const { language, contentType, description, contextFiles } = await request.json();

    if (!language || !contentType || !description?.trim()) {
      return NextResponse.json(
        { error: "Missing required fields: language, contentType, description" },
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
    const prompt = buildPrompt(language as Language, contentType as ContentType, description);
    const result = await model.generateContent(buildGeminiInput(prompt, safeFiles));
    const text = result.response.text().trim();

    return NextResponse.json({
      content: text,
      metadata: {
        language,
        contentType,
        description,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
