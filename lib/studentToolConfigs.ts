import type { UploadedContextFile } from "@/lib/contextFiles";
import type { TeacherToolConfig } from "@/lib/teacherToolConfigs";

function value(values: Record<string, string>, key: string, fallback = "Not provided"): string {
  const v = values[key]?.trim();
  return v ? v : fallback;
}

function contextNote(files: UploadedContextFile[]): string {
  if (files.length === 0) return "No context files attached.";
  return `Used ${files.length} context file(s): ${files.map((f) => f.name).join(", ")}.`;
}

const LANGUAGES = [
  { id: "English", label: "English" },
  { id: "Hindi", label: "Hindi" },
];

export const STUDENT_TOOL_CONFIGS: Record<string, TeacherToolConfig> = {
  "research-assistant": {
    fields: [
      { id: "topic", label: "Research Topic", type: "text", required: true, placeholder: "e.g. Impact of solar energy in cities" },
      { id: "gradeLevel", label: "Grade / Level", type: "text", placeholder: "e.g. Grade 9" },
      { id: "goal", label: "Research Goal", type: "textarea", rows: 3, voiceInput: true, placeholder: "What are you trying to find out?" },
      { id: "sourceCount", label: "Suggested Source Count", type: "number", defaultValue: "5", min: 3, max: 15 },
    ],
    generateOutput: (v, files) => `# Research Starter\n\nTopic: ${value(v, "topic")}\nGoal: ${value(v, "goal")}\n\n## Suggested Plan\n1) Define key questions\n2) Find credible sources\n3) Note evidence and citations\n\nRecommended sources: ${value(v, "sourceCount")}\n${contextNote(files)}`,
  },
  "text-translator": {
    fields: [
      { id: "sourceText", label: "Source Text", type: "textarea", rows: 6, required: true, voiceInput: true },
      { id: "targetLanguage", label: "Target Language", type: "select", required: true, defaultValue: "Hindi", options: LANGUAGES },
      { id: "tone", label: "Tone", type: "select", defaultValue: "neutral", options: [{ id: "neutral", label: "Neutral" }, { id: "friendly", label: "Friendly" }, { id: "formal", label: "Formal" }] },
    ],
    generateOutput: (v, files) => `# Translation Draft\n\nTarget language: ${value(v, "targetLanguage")}\nTone: ${value(v, "tone")}\n\nTranslated version prepared from your input text.\n${contextNote(files)}`,
  },
  "character-chatbot": {
    fields: [
      { id: "character", label: "Character / Figure", type: "text", required: true, placeholder: "e.g. Albert Einstein / Hamlet" },
      { id: "context", label: "Context", type: "text", placeholder: "e.g. preparing for history test" },
      { id: "question", label: "Your First Question", type: "textarea", rows: 4, required: true, voiceInput: true },
    ],
    generateOutput: (v, files) => `# Character Chat Starter\n\nYou are now chatting as: ${value(v, "character")}.\n\nFirst response will address: "${value(v, "question")}".\nContext: ${value(v, "context")}\n${contextNote(files)}`,
  },
  "create-a-skit": {
    fields: [
      { id: "topic", label: "Skit Topic", type: "text", required: true },
      { id: "characters", label: "Characters", type: "text", placeholder: "e.g. 3 friends, teacher, narrator" },
      { id: "duration", label: "Duration", type: "select", defaultValue: "5", options: [{ id: "3", label: "3 mins" }, { id: "5", label: "5 mins" }, { id: "8", label: "8 mins" }] },
      { id: "tone", label: "Tone", type: "select", defaultValue: "fun", options: [{ id: "fun", label: "Fun" }, { id: "serious", label: "Serious" }, { id: "mixed", label: "Mixed" }] },
    ],
    generateOutput: (v, files) => `# Skit Draft\n\nTopic: ${value(v, "topic")}\nDuration: ${value(v, "duration")} mins\nCharacters: ${value(v, "characters", "Not specified")}\nTone: ${value(v, "tone")}\n\nIncludes opening, conflict, and ending scene outline.\n${contextNote(files)}`,
  },
  "step-by-step": {
    fields: [
      { id: "task", label: "Task / Topic", type: "text", required: true },
      { id: "level", label: "Difficulty Level", type: "select", defaultValue: "beginner", options: [{ id: "beginner", label: "Beginner" }, { id: "intermediate", label: "Intermediate" }, { id: "advanced", label: "Advanced" }] },
      { id: "stepCount", label: "Number of Steps", type: "number", defaultValue: "6", min: 3, max: 15 },
    ],
    generateOutput: (v, files) => `# Step-by-Step Guide\n\nTask: ${value(v, "task")}\nLevel: ${value(v, "level")}\n\nGenerated ${value(v, "stepCount")} clear steps with checkpoints.\n${contextNote(files)}`,
  },
  "college-career-counselor": {
    fields: [
      { id: "interestArea", label: "Interest Area", type: "text", required: true, placeholder: "e.g. Computer Science, Design, Healthcare" },
      { id: "currentClass", label: "Current Class / Year", type: "text", placeholder: "e.g. Class 11" },
      { id: "question", label: "Your Question", type: "textarea", rows: 4, required: true, voiceInput: true },
    ],
    generateOutput: (v, files) => `# College & Career Guidance\n\nInterest area: ${value(v, "interestArea")}\nQuestion: ${value(v, "question")}\n\nSuggested pathways, skills to build, and next 3 action steps provided.\n${contextNote(files)}`,
  },
  "idea-generator": {
    fields: [
      { id: "topic", label: "Topic", type: "text", required: true },
      { id: "goal", label: "What You Need Ideas For", type: "text", required: true, placeholder: "e.g. project title, campaign, story idea" },
      { id: "count", label: "Number of Ideas", type: "number", defaultValue: "10", min: 5, max: 30 },
    ],
    generateOutput: (v, files) => `# Idea List\n\nTopic: ${value(v, "topic")}\nGoal: ${value(v, "goal")}\n\nGenerated ${value(v, "count")} idea options with short descriptions.\n${contextNote(files)}`,
  },
  "five-questions": {
    fields: [
      { id: "topic", label: "Topic / Idea", type: "text", required: true },
      { id: "purpose", label: "Thinking Goal", type: "text", placeholder: "e.g. improve argument, refine startup idea" },
      { id: "questionStyle", label: "Question Style", type: "select", defaultValue: "critical", options: [{ id: "critical", label: "Critical Thinking" }, { id: "creative", label: "Creative" }, { id: "reflective", label: "Reflective" }] },
    ],
    generateOutput: (v, files) => `# 5 Thinking Questions\n\nTopic: ${value(v, "topic")}\nStyle: ${value(v, "questionStyle")}\nPurpose: ${value(v, "purpose", "Not specified")}\n\nGenerated 5 prompts that push deeper thinking and reflection.\n${contextNote(files)}`,
  },
  "book-suggestions": {
    fields: [
      { id: "interests", label: "Interests", type: "text", required: true, placeholder: "e.g. mystery, science, fantasy" },
      { id: "readingLevel", label: "Reading Level", type: "text", placeholder: "e.g. middle school" },
      { id: "count", label: "Number of Suggestions", type: "number", defaultValue: "8", min: 3, max: 20 },
    ],
    generateOutput: (v, files) => `# Book Suggestions\n\nInterests: ${value(v, "interests")}\nReading level: ${value(v, "readingLevel", "Not specified")}\n\nGenerated ${value(v, "count")} book suggestions with why each may fit.\n${contextNote(files)}`,
  },
  "text-rewriter": {
    fields: [
      { id: "originalText", label: "Original Text", type: "textarea", rows: 6, required: true, voiceInput: true },
      { id: "rewriteGoal", label: "Rewrite Goal", type: "select", defaultValue: "clearer", options: [{ id: "clearer", label: "Make Clearer" }, { id: "shorter", label: "Make Shorter" }, { id: "formal", label: "Make Formal" }] },
      { id: "outputLanguage", label: "Output Language", type: "select", defaultValue: "English", options: LANGUAGES },
    ],
    generateOutput: (v, files) => `# Rewritten Text\n\nGoal: ${value(v, "rewriteGoal")}\nLanguage: ${value(v, "outputLanguage")}\n\nText rewritten according to your selected style.\n${contextNote(files)}`,
  },
  "text-summarizer": {
    fields: [
      { id: "sourceText", label: "Text to Summarize", type: "textarea", rows: 6, required: true, voiceInput: true },
      { id: "summaryType", label: "Summary Type", type: "select", defaultValue: "bullets", options: [{ id: "bullets", label: "Bullets" }, { id: "short", label: "Short Paragraph" }, { id: "detailed", label: "Detailed" }] },
      { id: "targetLength", label: "Target Length", type: "text", placeholder: "e.g. 80 words / 5 bullets" },
    ],
    generateOutput: (v, files) => `# Summary\n\nType: ${value(v, "summaryType")}\nTarget length: ${value(v, "targetLength", "Not specified")}\n\nMain idea and key supporting points condensed.\n${contextNote(files)}`,
  },
  "expand-on-my-idea": {
    fields: [
      { id: "idea", label: "Your Idea", type: "textarea", rows: 5, required: true, voiceInput: true },
      { id: "expansionGoal", label: "What Kind of Expansion?", type: "select", defaultValue: "details", options: [{ id: "details", label: "More Details" }, { id: "angles", label: "Different Angles" }, { id: "execution", label: "Execution Plan" }] },
      { id: "audience", label: "Audience", type: "text", placeholder: "e.g. classmates, judges, online readers" },
    ],
    generateOutput: (v, files) => `# Expanded Idea\n\nOriginal idea captured and expanded with: ${value(v, "expansionGoal")}.\nAudience: ${value(v, "audience", "Not specified")}\n\nOutput includes stronger concept framing and next steps.\n${contextNote(files)}`,
  },
  "literary-devices": {
    fields: [
      { id: "topic", label: "Topic / Theme", type: "text", required: true },
      { id: "devices", label: "Devices to Include", type: "text", placeholder: "e.g. metaphor, alliteration, personification" },
      { id: "count", label: "Number of Examples", type: "number", defaultValue: "6", min: 3, max: 20 },
    ],
    generateOutput: (v, files) => `# Literary Devices Examples\n\nTheme: ${value(v, "topic")}\nDevices requested: ${value(v, "devices", "mixed devices")}\n\nGenerated ${value(v, "count")} writing-ready examples with labels.\n${contextNote(files)}`,
  },
  "informational-texts": {
    fields: [
      { id: "topic", label: "Topic", type: "text", required: true },
      { id: "gradeBand", label: "Reading Band", type: "select", defaultValue: "middle", options: [{ id: "primary", label: "Primary" }, { id: "middle", label: "Middle" }, { id: "secondary", label: "Secondary" }] },
      { id: "length", label: "Length", type: "select", defaultValue: "medium", options: [{ id: "short", label: "Short" }, { id: "medium", label: "Medium" }, { id: "long", label: "Long" }] },
    ],
    generateOutput: (v, files) => `# Informational Text\n\nTopic: ${value(v, "topic")}\nBand: ${value(v, "gradeBand")}\nLength: ${value(v, "length")}\n\nGenerated a student-friendly informational passage with key takeaways.\n${contextNote(files)}`,
  },
  "sentence-starters": {
    fields: [
      { id: "topic", label: "Topic", type: "text", required: true },
      { id: "writingType", label: "Writing Type", type: "select", defaultValue: "essay", options: [{ id: "essay", label: "Essay" }, { id: "reflection", label: "Reflection" }, { id: "analysis", label: "Analysis" }] },
      { id: "count", label: "Number of Starters", type: "number", defaultValue: "12", min: 5, max: 30 },
    ],
    generateOutput: (v, files) => `# Sentence Starters\n\nTopic: ${value(v, "topic")}\nType: ${value(v, "writingType")}\n\nGenerated ${value(v, "count")} starters to begin writing quickly.\n${contextNote(files)}`,
  },
  "role-play": {
    fields: [
      { id: "role", label: "Role to Practice With", type: "text", required: true, placeholder: "e.g. interviewer, customer, examiner" },
      { id: "scenario", label: "Scenario", type: "textarea", rows: 4, required: true, voiceInput: true },
      { id: "difficulty", label: "Difficulty", type: "select", defaultValue: "medium", options: [{ id: "easy", label: "Easy" }, { id: "medium", label: "Medium" }, { id: "hard", label: "Hard" }] },
    ],
    generateOutput: (v, files) => `# Role Play Setup\n\nRole: ${value(v, "role")}\nScenario: ${value(v, "scenario")}\nDifficulty: ${value(v, "difficulty")}\n\nGenerated a back-and-forth practice script starter.\n${contextNote(files)}`,
  },
  "data-collection-table": {
    fields: [
      { id: "topic", label: "Data Topic", type: "text", required: true },
      { id: "columns", label: "Columns", type: "number", defaultValue: "4", min: 2, max: 10 },
      { id: "rows", label: "Rows", type: "number", defaultValue: "10", min: 3, max: 30 },
      { id: "question", label: "Analysis Question (Optional)", type: "text", placeholder: "e.g. Which category has highest growth?" },
    ],
    generateOutput: (v, files) => `# Data Collection Table\n\nTopic: ${value(v, "topic")}\nSize: ${value(v, "rows")} rows x ${value(v, "columns")} columns\n\nGenerated a blank data table template plus suggested analysis prompt.\n${contextNote(files)}`,
  },
  "conceptual-understanding": {
    fields: [
      { id: "concept", label: "Concept", type: "text", required: true },
      { id: "whatConfusesMe", label: "What Confuses You?", type: "textarea", rows: 4, voiceInput: true },
      { id: "learningStyle", label: "Preferred Explanation Style", type: "select", defaultValue: "examples", options: [{ id: "examples", label: "Examples" }, { id: "analogy", label: "Analogy" }, { id: "stepwise", label: "Stepwise Breakdown" }] },
    ],
    generateOutput: (v, files) => `# Conceptual Understanding Help\n\nConcept: ${value(v, "concept")}\nStyle: ${value(v, "learningStyle")}\n\nProvided clearer explanation path and checkpoints for understanding.\nConfusion note: ${value(v, "whatConfusesMe", "Not provided")}\n${contextNote(files)}`,
  },
  "tongue-twisters": {
    fields: [
      { id: "soundFocus", label: "Sound / Letter Focus", type: "text", placeholder: "e.g. s, sh, tr" },
      { id: "difficulty", label: "Difficulty", type: "select", defaultValue: "medium", options: [{ id: "easy", label: "Easy" }, { id: "medium", label: "Medium" }, { id: "hard", label: "Hard" }] },
      { id: "count", label: "How Many", type: "number", defaultValue: "8", min: 3, max: 20 },
    ],
    generateOutput: (v, files) => `# Tongue Twisters\n\nSound focus: ${value(v, "soundFocus", "mixed sounds")}\nDifficulty: ${value(v, "difficulty")}\nCount: ${value(v, "count")}\n\nGenerated fun pronunciation practice lines.\n${contextNote(files)}`,
  },
  "thank-you-note": {
    fields: [
      { id: "recipient", label: "Recipient", type: "text", required: true, placeholder: "e.g. teacher, mentor, friend" },
      { id: "reason", label: "Reason for Thanks", type: "textarea", rows: 4, required: true, voiceInput: true },
      { id: "tone", label: "Tone", type: "select", defaultValue: "warm", options: [{ id: "warm", label: "Warm" }, { id: "formal", label: "Formal" }, { id: "short", label: "Short & Simple" }] },
      { id: "outputLanguage", label: "Output Language", type: "select", defaultValue: "English", options: LANGUAGES },
    ],
    generateOutput: (v, files) => `# Thank You Note Draft\n\nDear ${value(v, "recipient")},\n\n${value(v, "reason")}\n\nThank you again.\n\nTone: ${value(v, "tone")}\nLanguage: ${value(v, "outputLanguage")}\n${contextNote(files)}`,
  },
  "multiple-explanations": {
    fields: [
      { id: "topic", label: "Topic / Concept", type: "text", required: true },
      { id: "explanationCount", label: "How Many Explanations", type: "number", defaultValue: "3", min: 2, max: 8 },
      { id: "styles", label: "Styles to Include", type: "text", placeholder: "e.g. simple, analogy, exam-focused" },
    ],
    generateOutput: (v, files) => `# Multiple Explanations\n\nTopic: ${value(v, "topic")}\nGenerated ${value(v, "explanationCount")} explanation styles.\nRequested styles: ${value(v, "styles", "mixed")}\n${contextNote(files)}`,
  },
  "study-habits": {
    fields: [
      { id: "examOrTask", label: "Test / Assignment / Project", type: "text", required: true },
      { id: "timeLeft", label: "Time Left", type: "text", required: true, placeholder: "e.g. 10 days" },
      { id: "hoursPerDay", label: "Hours Per Day", type: "number", defaultValue: "2", min: 1, max: 10 },
      { id: "challengeAreas", label: "Challenge Areas", type: "textarea", rows: 3, voiceInput: true },
    ],
    generateOutput: (v, files) => `# Study Habits Plan\n\nGoal: ${value(v, "examOrTask")}\nTime left: ${value(v, "timeLeft")}\nDaily hours: ${value(v, "hoursPerDay")}\n\nGenerated a practical study routine, revision blocks, and break strategy.\n${contextNote(files)}`,
  },
  "make-it-relevant": {
    fields: [
      { id: "topic", label: "What You Are Learning", type: "text", required: true },
      { id: "interests", label: "Your Interests", type: "text", required: true, placeholder: "e.g. football, gaming, art, coding" },
      { id: "format", label: "Output Format", type: "select", defaultValue: "examples", options: [{ id: "examples", label: "Examples" }, { id: "stories", label: "Mini Stories" }, { id: "projects", label: "Project Ideas" }] },
    ],
    generateOutput: (v, files) => `# Make It Relevant\n\nTopic: ${value(v, "topic")}\nInterests: ${value(v, "interests")}\nFormat: ${value(v, "format")}\n\nGenerated meaningful links between your learning and real interests.\n${contextNote(files)}`,
  },
  "message-writer": {
    fields: [
      { id: "recipientType", label: "Recipient", type: "select", defaultValue: "teacher", options: [{ id: "teacher", label: "Teacher" }, { id: "peer", label: "Peer" }, { id: "other", label: "Other" }] },
      { id: "purpose", label: "Purpose", type: "text", required: true, placeholder: "e.g. request extension, ask doubt, share update" },
      { id: "keyPoints", label: "Key Points", type: "textarea", rows: 4, required: true, voiceInput: true },
      { id: "channel", label: "Channel", type: "select", defaultValue: "email", options: [{ id: "email", label: "Email" }, { id: "whatsapp", label: "WhatsApp" }] },
    ],
    generateOutput: (v, files) => `# Message Draft\n\nHello,\n\nI am writing regarding ${value(v, "purpose")}. ${value(v, "keyPoints")}\n\nThank you.\n\nRecipient: ${value(v, "recipientType")} | Channel: ${value(v, "channel")}\n${contextNote(files)}`,
  },
  "real-world-connections": {
    fields: [
      { id: "topic", label: "Learning Topic", type: "text", required: true },
      { id: "interestArea", label: "Interest Area", type: "text", placeholder: "e.g. sports, music, business" },
      { id: "exampleCount", label: "Number of Connections", type: "number", defaultValue: "6", min: 3, max: 20 },
    ],
    generateOutput: (v, files) => `# Real World Connections\n\nTopic: ${value(v, "topic")}\nInterest area: ${value(v, "interestArea", "general life examples")}\n\nGenerated ${value(v, "exampleCount")} real-world connections.\n${contextNote(files)}`,
  },
};

export function getStudentToolConfig(slug: string): TeacherToolConfig | undefined {
  return STUDENT_TOOL_CONFIGS[slug];
}
